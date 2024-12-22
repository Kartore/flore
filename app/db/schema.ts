import { AdapterAccountType } from '@auth/core/adapters';
import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text, primaryKey, unique } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: integer('emailVerified', { mode: 'timestamp_ms' }),
  image: text('image'),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(unixepoch('now','subsec'))`)
    .$onUpdate(() => sql`(unixepoch('now','subsec'))`),
  createAt: integer('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(unixepoch('now','subsec'))`),
});

export const accounts = sqliteTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch('now','subsec'))`)
      .$onUpdate(() => sql`(unixepoch('now','subsec'))`),
    createAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch('now','subsec'))`),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = sqliteTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(unixepoch('now','subsec'))`)
    .$onUpdate(() => sql`(unixepoch('now','subsec'))`),
  createAt: integer('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(unixepoch('now','subsec'))`),
});

export const verificationTokens = sqliteTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch('now','subsec'))`)
      .$onUpdate(() => sql`(unixepoch('now','subsec'))`),
    createAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch('now','subsec'))`),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
);

export const authenticators = sqliteTable(
  'authenticator',
  {
    credentialID: text('credentialID').notNull().unique(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    providerAccountId: text('providerAccountId').notNull(),
    credentialPublicKey: text('credentialPublicKey').notNull(),
    counter: integer('counter').notNull(),
    credentialDeviceType: text('credentialDeviceType').notNull(),
    credentialBackedUp: integer('credentialBackedUp', {
      mode: 'boolean',
    }).notNull(),
    transports: text('transports'),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch('now','subsec'))`)
      .$onUpdate(() => sql`(unixepoch('now','subsec'))`),
    createAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch('now','subsec'))`),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
);

export const organizations = sqliteTable('organization', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  image: text('image'),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(unixepoch('now','subsec'))`)
    .$onUpdate(() => sql`(unixepoch('now','subsec'))`),
  createAt: integer('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(unixepoch('now','subsec'))`),
});

export const organizationUsers = sqliteTable(
  'organizationUser',
  {
    id: text('id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    permission: text('permission').notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch('now','subsec'))`)
      .$onUpdate(() => sql`(unixepoch('now','subsec'))`),
    createAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch('now','subsec'))`),
  },
  (organizationMember) => ({
    compoundKey: primaryKey({
      columns: [organizationMember.id, organizationMember.userId],
    }),
  })
);

export const projects = sqliteTable(
  'project',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text('name'),
    description: text('description'),
    image: text('image'),
    organizationId: text('organizationId')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch('now','subsec'))`)
      .$onUpdate(() => sql`(unixepoch('now','subsec'))`),
    createAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch('now','subsec'))`),
  },
  (project) => ({
    uniqueProjectIdOrganizationId: unique('unique_project_id_organization_id').on(
      project.id,
      project.organizationId
    ),
  })
);

export const environments = sqliteTable(
  'environment',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text('name').notNull(),
    displayId: text('displayId').notNull(),
    description: text('description'),
    projectId: text('projectId')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch('now','subsec'))`)
      .$onUpdate(() => sql`(unixepoch('now','subsec'))`),
    createAt: integer('updated_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch('now','subsec'))`),
  },
  (environment) => ({
    uniqueIdProjectId: unique('unique_environment_id_project_id').on(
      environment.id,
      environment.projectId
    ),
  })
);

export const featureType = sqliteTable('featureType', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  description: text('description'),
  expires: integer('expires', { mode: 'number' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(unixepoch('now','subsec'))`)
    .$onUpdate(() => sql`(unixepoch('now','subsec'))`),
  createAt: integer('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(unixepoch('now','subsec'))`),
});

export const features = sqliteTable(
  'feature',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text('name').notNull(),
    type: text('featureTypeId')
      .notNull()
      .references(() => featureType.id, { onDelete: 'restrict' }),
    description: text('description'),
    environmentId: text('environmentId')
      .notNull()
      .references(() => environments.id, { onDelete: 'cascade' }),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch('now','subsec'))`)
      .$onUpdate(() => sql`(unixepoch('now','subsec'))`),
    createAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch('now','subsec'))`),
  },
  (feature) => ({
    uniqueDisplayIdEnvironmentId: unique('unique_feature_display_id_environment_id').on(
      feature.name,
      feature.environmentId
    ),
  })
);
