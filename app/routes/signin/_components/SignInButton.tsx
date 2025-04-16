import { FC, JSX } from 'hono/jsx';

import { SignInParameters } from '../../../utils/auth';
import { cn } from '../../../utils/tailwindUtli';

type SignInButtonProps = JSX.IntrinsicElements['button'] & {
  className?: string;
  redirectTo?: string;
  provider: SignInParameters[0];
};

export const SignInButton: FC<SignInButtonProps> = ({
  provider,
  redirectTo = '/',
  className,
  children,
  ...props
}) => {
  return (
    <form method="post">
      <input type="hidden" name="provider" value={provider} />
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <button
        type="submit"
        class={cn('cursor-pointer rounded border-2 border-gray-200 px-4 py-2', className)}
        {...props}
      >
        {children}
      </button>
    </form>
  );
};
