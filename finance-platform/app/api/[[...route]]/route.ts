
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import {z} from "zod";
import { zValidator } from '@hono/zod-validator';

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.get('/hello', (c) => {
  return c.text('Hello from Hono!')
})

//validation route example
app.get('/users/:test',
  zValidator("param", z.object({
    test:z.number(),
  })),
  (c) => {
  const {test} = c.req.valid('param')
  return c.json({ test })
})

// Export the handler
export const GET = handle(app)
export const POST = handle(app)