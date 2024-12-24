import { createRoute } from 'honox/factory';

import Counter from '../islands/counter';

export default createRoute((c) => {
  const name = c.req.query('name') ?? 'Hono';
  return c.render(
    <div>
      <h1 class={'text-red-400'}>Hello, {name}!</h1>
      <a href={'/test'}>Test</a>
      <Counter />
    </div>,
    { title: name }
  );
});
