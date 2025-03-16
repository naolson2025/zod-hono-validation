import { Hono } from 'hono';
import { getBooksByPrice } from './queries';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { schema, booksValidator } from './schema';

const app = new Hono();

app.get('/books', booksValidator, (c) => {
  const { minPrice, maxPrice } = c.req.valid('query');

  const books = getBooksByPrice(minPrice, maxPrice);

  return c.json(books);
});

// app.get('/books', (c) => {
//   // check for any invalid query params
//   const validQueryParams = ['minPrice', 'maxPrice'];
//   const queryParams = Object.keys(c.req.query());
//   const invalidQueryParams = queryParams.filter(
//     (param) => !validQueryParams.includes(param)
//   );
//   if (invalidQueryParams.length > 0) {
//     return c.json(
//       {
//         errors: ['Only minPrice and maxPrice are valid query params'],
//       },
//       400
//     );
//   }

//   // check for minPrice and maxPrice
//   // and validate their values are numbers between 0 and 1000
//   const minPrice = c.req.query('minPrice');
//   const maxPrice = c.req.query('maxPrice');
//   const errors: string[] = [];

//   if (
//     minPrice &&
//     (isNaN(Number(minPrice)) || Number(minPrice) < 0 || Number(minPrice) > 1000)
//   ) {
//     errors.push('minPrice must be a number between 0 and 1000');
//   }
//   if (
//     maxPrice &&
//     (isNaN(Number(maxPrice)) || Number(maxPrice) < 0 || Number(maxPrice) > 1000)
//   ) {
//     errors.push('maxPrice must be a number between 0 and 1000');
//   }

//   // check if minPrice is greater than maxPrice
//   if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
//     errors.push('minPrice must be less than or equal to maxPrice');
//   }

//   if (errors.length > 0) {
//     return c.json(
//       {
//         errors,
//       },
//       400
//     );
//   }

//   // convert minPrice and maxPrice to numbers or set defaults
//   const minPriceNum = Number(minPrice ?? 0);
//   const maxPriceNum = Number(maxPrice ?? 1000);

//   const books = getBooksByPrice(minPriceNum, maxPriceNum);
//   return c.json(books);
// });

export default app;
