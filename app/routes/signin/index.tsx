import { createRoute } from 'honox/factory';

import { signIn } from '../../utils/auth';

import { SignInButton } from './_components/SignInButton';

export const POST = createRoute(signIn());

export default createRoute(async (c) => {
  const user = c.get('authUser');
  if (user) {
    return c.redirect('/');
  }

  return c.render(
    <div
      class={
        'bg-background relative flex min-h-screen w-full flex-col items-center justify-center gap-6'
      }
    >
      <div class={'bg-card-background flex flex-col items-center gap-14 rounded-lg p-10 shadow'}>
        <h1
          class={
            'font-montserrat relative pb-1.5 text-3xl font-bold uppercase after:absolute after:right-0 after:bottom-0 after:left-0 after:h-[3px] after:bg-[linear-gradient(180deg,_#84fab0_0%,_#8fd3f4_100%)] after:content-[""]'
          }
        >
          Login
        </h1>
        <div>
          <SignInButton provider={'github'}>Sign in with GitHub</SignInButton>
        </div>
      </div>
      <p class={'gray-600 absolute bottom-4 left-4'}>&copy; 2024 Kartore</p>
    </div>
  );
});
