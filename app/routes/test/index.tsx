import { createRoute } from 'honox/factory';

export default createRoute((c) => {
  const auth = c.get('authUser');
  return c.render(
    <div>
      <h1 class={'text-red-400'}>Test, {auth.session.user?.name}!</h1>
    </div>
  );
});
