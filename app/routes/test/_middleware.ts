import { verifyAuth } from '@hono/auth-js';
import { createRoute } from 'honox/factory';

export default createRoute(verifyAuth());
