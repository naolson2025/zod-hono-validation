import { expect, it } from 'bun:test';
import app from '.';
import { Book } from './types';

const baseUrl = 'http://localhost:3000';

it('should return a list of 20 books from /books', async () => {
  const req = new Request(baseUrl + '/books');
  const res = await app.fetch(req);
  const data = await res.json();
  expect(res.status).toBe(200);
  expect(data).toHaveLength(20);
});

it('should return a list of books with prices between $100 and $500', async () => {
  const req = new Request(baseUrl + '/books?minPrice=100&maxPrice=500');
  const res = await app.fetch(req);
  const data = await res.json();
  expect(res.status).toBe(200);
  data.forEach((book: Book) => {
    expect(book.price).toBeGreaterThanOrEqual(100);
    expect(book.price).toBeLessThanOrEqual(500);
  });
});

it('should return a list of books with prices above $500', async () => {
  const req = new Request(baseUrl + '/books?minPrice=500');
  const res = await app.fetch(req);
  const data = await res.json();
  expect(res.status).toBe(200);
  data.forEach((book: Book) => {
    expect(book.price).toBeGreaterThanOrEqual(500);
  });
});

it('should return a list of books with prices below $300', async () => {
  const req = new Request(baseUrl + '/books?maxPrice=300');
  const res = await app.fetch(req);
  const data = await res.json();
  expect(res.status).toBe(200);
  data.forEach((book: Book) => {
    expect(book.price).toBeLessThanOrEqual(300);
  });
});

it('should return a 400 error for invalid minPrice & maxPrice', async () => {
  const req = new Request(baseUrl + '/books?minPrice=none&maxPrice=none');
  const res = await app.fetch(req);
  const data = await res.json();
  expect(res.status).toBe(400);
  expect(data).toEqual({
    errors: [
      'minPrice must be a number between 0 and 1000',
      'maxPrice must be a number between 0 and 1000',
    ],
  });
});

it('should return a 400 error for minPrice & maxPrice out of range', async () => {
  const req = new Request(baseUrl + '/books?minPrice=-5&maxPrice=10000');
  const res = await app.fetch(req);
  const data = await res.json();
  expect(res.status).toBe(400);
  expect(data).toEqual({
    errors: [
      'minPrice must be a number between 0 and 1000',
      'maxPrice must be a number between 0 and 1000',
    ],
  });
});

it('should return a 400 error for invalid query params', async () => {
  const req = new Request(baseUrl + '/books?maxPric=invalid');
  const res = await app.fetch(req);
  const data = await res.json();
  expect(res.status).toBe(400);
  expect(data).toEqual({
    errors: ['Only minPrice and maxPrice are valid query params'],
  });
});

it('should return 400 error for minPrice greater than maxPrice', async () => {
  const req = new Request(baseUrl + '/books?minPrice=500&maxPrice=100');
  const res = await app.fetch(req);
  const data = await res.json();
  expect(res.status).toBe(400);
  expect(data).toEqual({
    errors: ['minPrice must be less than or equal to maxPrice'],
  });
});
