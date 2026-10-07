export const revisionSchema = {
  name: 'revision',
  title: 'Revision',
  type: 'document',
  fields: [
    {
      name: 'postId',
      title: 'Post ID',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'titleSnapshot',
      title: 'Title Snapshot',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'bodySnapshot',
      title: 'Body Snapshot (Tiptap JSON)',
      type: 'text',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'savedAt',
      title: 'Saved At',
      type: 'datetime',
      validation: (Rule: any) => Rule.required(),
    },
  ],
};
