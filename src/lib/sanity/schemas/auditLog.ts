export const auditLogSchema = {
  name: 'auditLog',
  title: 'Audit Log',
  type: 'document',
  fields: [
    {
      name: 'action',
      title: 'Action',
      type: 'string',
      options: {
        list: [
          { title: 'Publish', value: 'publish' },
          { title: 'Unpublish', value: 'unpublish' },
          { title: 'Edit', value: 'edit' },
          { title: 'Delete', value: 'delete' },
          { title: 'Create', value: 'create' },
          { title: 'Restore', value: 'restore' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'postId',
      title: 'Post ID',
      type: 'string',
    },
    {
      name: 'postTitle',
      title: 'Post Title',
      type: 'string',
    },
    {
      name: 'timestamp',
      title: 'Timestamp',
      type: 'datetime',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'performedBy',
      title: 'Admin User',
      type: 'string',
    },
  ],
};
