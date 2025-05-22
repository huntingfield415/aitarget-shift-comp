import handler from '@/pages/api/shift/save';
import { createMocks } from 'node-mocks-http';

describe('POST /api/shift/save', () => {
  it('should respond with 200 OK', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { test: true },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
  });
});
