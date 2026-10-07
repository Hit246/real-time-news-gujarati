import { postSchema } from './post';
import { categorySchema } from './category';
import { authorSchema } from './author';
import { revisionSchema } from './revision';
import { siteSettingsSchema } from './siteSettings';
import { auditLogSchema } from './auditLog';

export const schemaTypes = [
  postSchema,
  categorySchema,
  authorSchema,
  revisionSchema,
  siteSettingsSchema,
  auditLogSchema,
];

export {
  postSchema,
  categorySchema,
  authorSchema,
  revisionSchema,
  siteSettingsSchema,
  auditLogSchema,
};
