import { Hono } from 'hono';
import { booksValidator } from './books-schema';
import { getBooksByPrice } from './queries';

const app = new Hono();

app.get('/books', booksValidator, (c) => {
  const { minPrice, maxPrice } = c.req.valid('query');

  const books = getBooksByPrice(minPrice, maxPrice);

  return c.json(books);
});

app.notFound((c) => {
  return c.json({ message: 'That endpoint does not exist' }, 404);
});

export default app;
