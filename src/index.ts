import { Elysia } from "elysia";
import config from '../config'
import { rateLimit } from 'elysia-rate-limit'
import { staticPlugin } from '@elysiajs/static'
import { FileHandler } from "./utils/file-handler";
import html from "@elysiajs/html";
import { HtmlRenderer } from "./utils/html-render";


const fileHandler = new FileHandler('data')
const htmlRenderer = new HtmlRenderer(config.theme, config.name)

const app = new Elysia()
  .use(rateLimit({
    duration: config.rateLimit.windowMs || 10_000,
    max: config.rateLimit.max || 100,
  }))
  .use(staticPlugin({
    prefix: '/public',
    indexHTML: true,
  }))
  .use(html())
  .get('/', () => {
    return new Response(htmlRenderer.renderEditorPage({}), {
      headers: {
        'content-type': 'text/html; charset=utf-8'
      }
    });
  })
  .get('/:id', async ({ params: { id }, status }) => {
    if (id.includes('.')) {
      status(404, "Don't include dots in id");
      return 'Not found';
    }
    const fileContent = await fileHandler.readFile(id);
    if (!fileContent) {
      status(404, "File not found");
      return 'File not found';
    }

    return new Response(htmlRenderer.renderEditorPage({ content: fileContent, disableInput: true }), {
      headers: {
        'content-type': 'text/html; charset=utf-8'
      }
    });
  })
  .get('/raw/:id', async ({ params: { id }, status }) => {
    if (id.includes('.')) {
      status(404, "Don't include dots in id");
      return 'Not found';
    }

    const fileContent = await fileHandler.readFile(id);

    if (!fileContent) {
      status(404, "File not found");
      return 'File not found';
    }

    return fileContent;
  })
  .post('/save', async ({ body, set }) => {
    const content = typeof body === 'string'
      ? body
      : typeof body === 'object' && body !== null && 'content' in body && typeof body.content === 'string'
        ? body.content
        : null;

    if (!content) {
      set.status = 400;
      return 'Invalid content';
    }

    const name = await fileHandler.saveFile(content);
    return { key: name };
  })

  .listen(config.port)


console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
