import { Auth, createActionURL, raw, setEnvDefaults, skipCSRFCheck } from '@auth/core';
import { ProviderType } from '@auth/core/providers';
import { AuthEnv } from '@hono/auth-js';
import {
  signIn as signInReactFunction,
  signOut as signOutReactFunction,
} from '@hono/auth-js/react';
import { MiddlewareHandler } from 'hono';
import { env } from 'hono/adapter';
import { setCookie } from 'hono/cookie';

type SignInParameters = Parameters<typeof signInReactFunction>;

export function signIn(authorizationParams?: SignInParameters[2]): MiddlewareHandler {
  return async (c) => {
    const config = c.get('authConfig');

    const formData = await c.req.formData();
    const formDataStringValues: { [key: string]: string | null } = {
      provider: null,
      redirectTo: null,
    };
    formData.forEach((value, key) => {
      if (typeof value === 'string') {
        formDataStringValues[key] = value;
      }
    });

    const { provider, redirectTo, ...rest } = formDataStringValues;
    const rawHeaders = c.req.raw.headers;

    const ctxEnv = env(c) as AuthEnv;
    setEnvDefaults(ctxEnv, config);

    const reqUrl = new URL(c.req.url);
    const protocol = reqUrl.protocol;

    const callbackUrl = redirectTo ?? c.req.header().Referer ?? '/';
    const signInURL = createActionURL('signin', protocol, rawHeaders, ctxEnv, config);

    if (!provider) {
      signInURL.searchParams.append('callbackUrl', callbackUrl);
      return c.redirect(signInURL.toString(), 302);
    }

    let url = `${signInURL.toString()}/${provider}?${new URLSearchParams(authorizationParams).toString()}`;
    let foundProvider: { id?: SignInParameters[0]; type?: ProviderType } = {};

    for (const providerConfig of config.providers) {
      const { options, ...defaults } =
        typeof providerConfig === 'function' ? providerConfig() : providerConfig;
      const id = (options?.id as string | undefined) ?? defaults.id;
      if (id === provider) {
        foundProvider = { id, type: (options?.type as ProviderType | undefined) ?? defaults.type };
        break;
      }
    }

    if (!foundProvider.id) {
      const url = `${signInURL.toString()}?${new URLSearchParams({ callbackUrl }).toString()}`;
      return c.redirect(url, 302);
    }

    if (foundProvider.type === 'credentials') {
      url = url.replace('signin', 'callback');
    }

    const body = new URLSearchParams({ ...rest, callbackUrl });
    const req = new Request(url, { method: 'POST', headers: rawHeaders, body });
    req.headers.set('Content-Type', 'application/x-www-form-urlencoded');
    const res = await Auth(req, { ...config, raw, skipCSRFCheck });

    for (const resCookie of res?.cookies ?? []) {
      setCookie(c, resCookie.name, resCookie.value, {
        ...resCookie.options,
        sameSite:
          // ref: https://github.com/nextauthjs/next-auth/blob/a150f1e842fe44c068a9761c1f6e6d543c0f9d69/packages/core/src/lib/vendored/cookie.ts#L341-L360
          // typeof string -> sameSite lowercase string value
          // typeof boolean -> true = 'Strict', false = Invalid
          typeof resCookie.options.sameSite === 'string'
            ? resCookie.options.sameSite
            : resCookie.options.sameSite
              ? 'Strict'
              : undefined,
      });
    }

    return c.redirect(res.redirect!, 302);
  };
}

type SignOutParametes = Parameters<typeof signOutReactFunction>;

export function signOut(): MiddlewareHandler {
  return async (c) => {
    const config = c.get('authConfig');

    const formData = await c.req.formData();
    const redirectTo = formData.get('redirectTo');
    if (redirectTo && typeof redirectTo !== 'string') {
      return c.text('Invalid request: redirectTo is not string', 400);
    }

    const rawHeaders = c.req.raw.headers;

    const ctxEnv = env(c) as AuthEnv;
    setEnvDefaults(ctxEnv, config);

    const reqUrl = new URL(c.req.url);
    const protocol = reqUrl.protocol;

    const callbackUrl = redirectTo ?? c.req.header().Referer ?? '/';
    const signOutUrl = createActionURL('signout', protocol, rawHeaders, ctxEnv, config);

    const body = new URLSearchParams({ callbackUrl });
    const req = new Request(signOutUrl, { method: 'POST', headers: rawHeaders, body });
    req.headers.set('Content-Type', 'application/x-www-form-urlencoded');
    const res = await Auth(req, { ...config, raw, skipCSRFCheck });

    for (const resCookie of res?.cookies ?? []) {
      setCookie(c, resCookie.name, resCookie.value, {
        ...resCookie.options,
        sameSite:
          // ref: https://github.com/nextauthjs/next-auth/blob/a150f1e842fe44c068a9761c1f6e6d543c0f9d69/packages/core/src/lib/vendored/cookie.ts#L341-L360
          // typeof string -> sameSite lowercase string value
          // typeof boolean -> true = 'Strict', false = Invalid
          typeof resCookie.options.sameSite === 'string'
            ? resCookie.options.sameSite
            : resCookie.options.sameSite
              ? 'Strict'
              : undefined,
      });
    }

    return c.redirect(res.redirect!, 302);
  };
}
