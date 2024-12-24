import { createRoute } from 'honox/factory';

import { signIn } from '../../utils/auth';

export const POST = createRoute(signIn());

export default createRoute(async (c) => {
  const user = c.get('authUser');
  if (user) {
    return c.redirect('/');
  }

  return c.render(
    <div>
      <form method="post">
        <input type="hidden" name="provider" value="github" />
        <input type="hidden" name="redirectTo" value="/test" />
        <button type="submit">Sign in with GitHub</button>
      </form>
    </div>
  );
});
