import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { getAdminClient, isSanityConfigured } from '@/lib/sanity/client';
import { SAMPLE_POSTS, SAMPLE_REVISIONS } from '@/lib/sanity/sample-data';
import { Revision } from '@/types/sanity';

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(req: Request, { params }: Params) {
  const session = await auth();
  const adminEmail = process.env.AUTH_ADMIN_EMAIL?.trim().toLowerCase();

  if (!session?.user?.email || (adminEmail && session.user.email.toLowerCase() !== adminEmail)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const { revisionId } = await req.json();

    if (!revisionId) {
      return NextResponse.json({ error: 'Missing revisionId' }, { status: 400 });
    }

    let targetRevision: Revision | undefined = SAMPLE_REVISIONS.find(
      (r) => r._id === revisionId && r.postId === id
    );

    if (isSanityConfigured()) {
      try {
        const client = getAdminClient();
        const rev = await client.fetch(`*[_type == "revision" && _id == $revisionId][0]`, {
          revisionId,
        });
        if (rev) targetRevision = rev;
      } catch (err) {
        console.error('Error fetching revision from Sanity:', err);
      }
    }

    if (!targetRevision) {
      return NextResponse.json({ error: 'Revision not found' }, { status: 404 });
    }

    const now = new Date().toISOString();

    // Update in-memory fallback post
    const postIndex = SAMPLE_POSTS.findIndex((p) => p._id === id);
    if (postIndex !== -1) {
      SAMPLE_POSTS[postIndex] = {
        ...SAMPLE_POSTS[postIndex],
        title: targetRevision.titleSnapshot,
        body: targetRevision.bodySnapshot,
        summary: targetRevision.summarySnapshot || SAMPLE_POSTS[postIndex].summary,
        updatedAt: now,
      };
    }

    // Update in Sanity if configured
    if (isSanityConfigured()) {
      try {
        const client = getAdminClient();
        const updateFields: Record<string, any> = {
          title: targetRevision.titleSnapshot,
          body: targetRevision.bodySnapshot,
          updatedAt: now,
        };
        if (targetRevision.summarySnapshot) {
          updateFields.summary = targetRevision.summarySnapshot;
        }

        await client.patch(id).set(updateFields).commit();

        // Create new Revision snapshot for this restore event
        await client.create({
          _type: 'revision',
          postId: id,
          titleSnapshot: targetRevision.titleSnapshot,
          bodySnapshot: targetRevision.bodySnapshot,
          summarySnapshot: targetRevision.summarySnapshot,
          savedAt: now,
          authorEmail: `${session.user.email} (Restored from ${targetRevision._id})`,
        });

        // Write Audit Log
        await client.create({
          _type: 'auditLog',
          action: 'restore',
          postId: id,
          postTitle: targetRevision.titleSnapshot,
          timestamp: now,
          performedBy: session.user.email,
        });
      } catch (sanityErr) {
        console.error('Error restoring post in Sanity:', sanityErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Revision restored successfully',
      restoredData: {
        title: targetRevision.titleSnapshot,
        body: targetRevision.bodySnapshot,
        summary: targetRevision.summarySnapshot,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to restore revision' },
      { status: 500 }
    );
  }
}
