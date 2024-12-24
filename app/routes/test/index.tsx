import { createRoute } from 'honox/factory';

import { signOut } from '../../utils/auth';

export const POST = createRoute(signOut());

export default createRoute((c) => {
  const auth = c.get('authUser');
  return c.render(
    <div>
      <h1 class={'text-red-400'}>Test, {JSON.stringify(auth.session.user)}!</h1>
      <form method={'post'}>
        <input type={'hidden'} name={'redirectTo'} value={'/signin'} />
        <button type={'submit'}>Sign out</button>
      </form>
    </div>
  );
});
