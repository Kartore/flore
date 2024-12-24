import GitHub from '@auth/core/providers/github';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { authHandler, initAuthConfig } from '@hono/auth-js';
import { drizzle } from 'drizzle-orm/d1';
import { csrf } from 'hono/csrf';
import { showRoutes } from 'hono/dev';
import { createApp } from 'honox/server';

import { accounts, sessions, users, verificationTokens } from './db/schema';

const app = createApp({
  init(app) {
    app
      .use(csrf())
      .use(
        '*',
        initAuthConfig((c) => {
          return {
            secret: c.env.AUTH_SECRET,
            providers: [
              GitHub({
                clientId: c.env.GITHUB_CLIENT_ID,
                clientSecret: c.env.GITHUB_CLIENT_SECRET,
              }),
            ],
            adapter: DrizzleAdapter(drizzle(c.env.DB), {
              usersTable: users,
              accountsTable: accounts,
              sessionsTable: sessions,
              verificationTokensTable: verificationTokens,
            }),
            pages: {
              signIn: '/signin',
              error: '/error',
            },
          };
        })
      )
      .use('/api/auth/*', authHandler());
  },
});

showRoutes(app);

export default app;
