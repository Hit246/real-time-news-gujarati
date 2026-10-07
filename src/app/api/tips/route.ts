import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminClient, isSanityConfigured } from '@/lib/sanity/client';

const tipSchema = z.object({
  name: z.string().optional(),
  contact: z.string().optional(),
  details: z.string().min(3, 'Details must be at least 3 characters'),
});

// In-memory tip storage fallback
export const IN_MEMORY_TIPS: Array<{
  _id: string;
  name?: string;
  contact?: string;
  details: string;
  timestamp: string;
}> = [
  {
    _id: 'tip-1',
    name: 'સ્થાનિક નાગરિક',
    contact: 'citizen@example.com',
    details: 'કચ્છ હાઇવે નજીક નવી સોલાર પાવર ટ્રાન્સમિશન લાઇનનું કામ પૂર્ણ થયું છે અને ટેસ્ટિંગ શરૂ થયું છે.',
    timestamp: new Date().toISOString(),
  },
];

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = tipSchema.parse(json);

    const newTip = {
      _id: `tip-${Date.now()}`,
      _type: 'tip',
      name: parsed.name || 'Anonymous',
      contact: parsed.contact || 'Not provided',
      details: parsed.details,
      timestamp: new Date().toISOString(),
    };

    IN_MEMORY_TIPS.unshift(newTip);

    if (isSanityConfigured()) {
      try {
        const client = getAdminClient();
        await client.create(newTip);
      } catch (err) {
        console.error('Failed to save tip to Sanity, retained in memory:', err);
      }
    }

    return NextResponse.json({ success: true, message: 'Tip received successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Invalid tip submission' }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ tips: IN_MEMORY_TIPS });
}
