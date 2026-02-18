import { Elysia } from "elysia";
import generateName from "./utils/name";
import config from '../config'
import { rateLimit } from 'elysia-rate-limit'
import { staticPlugin } from '@elysiajs/static'
import { FileHandler } from "./utils/fileHandler";


const fileHandler = new FileHandler('data')


const app = new Elysia()
  .use(rateLimit({
    duration: config.rateLimit.windowMs || 10_000,
    max: config.rateLimit.max || 100,
  }))
  .use(staticPlugin({
    prefix: '/',
  }))
  .get('/:id', async ({ params: { id } }) => {
    const fileContent = await fileHandler.readFile(id);

    if (!fileContent) {
      return 'File not found';
    }

    return fileContent;
  })
  .post('/', async ({ request }) => {
    const content = await request.text();
    let name = generateName();

    while (Bun.file(`data/${name}`).exists()) {
      name = generateName();
    }

    await fileHandler.writeFile(name, content);
    return { key: name };
  })
  .listen(config.port)


console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
