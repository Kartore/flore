import { jsxRenderer } from 'hono/jsx-renderer';
import { Link, Script } from 'honox/server';

export default jsxRenderer(({ children, title }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Zen+Kaku+Gothic+New:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <Link rel="stylesheet" href="/app/index.css" />
        <Script src="/app/client.ts" async />
      </head>
      <body>{children}</body>
    </html>
  );
});
