import { Elysia } from "elysia";
import config from '../config'
import { rateLimit } from 'elysia-rate-limit'
import { staticPlugin } from '@elysiajs/static'
import { FileHandler } from "./storage/file-storage";
import html from "@elysiajs/html";
import { HtmlRenderer } from "./utils/html-render";
import { RedisStorage } from "./storage/redis-storage";
import { DataStorage } from "./storage/data-storage";
import { log } from "./utils/logger";
import cron, { Patterns } from "@elysiajs/cron";


const dataStorage: DataStorage = config.storage.type === 'redis'
  ? new RedisStorage(config.storage.redis.connectionString, config.storage.timeout)
  : new FileHandler(config.storage.file.directory, config.storage.timeout);

const htmlRenderer = new HtmlRenderer(config.theme, config.name)


const app = new Elysia()
  //Plugins
  .use(rateLimit({
    duration: config.rateLimit.windowMs || 10_000,
    max: config.rateLimit.max || 100,
  }))
  .use(staticPlugin({
    prefix: '/public',
    indexHTML: true,
  }))
  .use(html())
  .use(
		cron({
			name: 'deleteExpiredEntries',
			pattern: Patterns.everyDayAt(), // Run every day at midnight
			run() {
				dataStorage.checkAndDeleteExpiredEntries()
			}
		})
	)
  .get('/', ({html}) => {
    return html(htmlRenderer.renderEditorPage({}))
  })

  //Homepage and API
  .get('/:id', async ({ params: { id }, status, html }) => {
    if (id.includes('.')) {
      status(404, "Don't include dots in id");
      return 'Not found';
    }
    const fileContent = await dataStorage.read(id);
    if (!fileContent) {
      status(404, "File not found");
      return 'File not found';
    }

    return html(htmlRenderer.renderEditorPage({ content: fileContent, disableInput: true }));
  })
  .get('/raw/:id', async ({ params: { id }, status }) => {
    if (id.includes('.')) {
      status(404, "Don't include dots in id");
      return 'Not found';
    }

    const fileContent = await dataStorage.read(id);

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

    const name = await dataStorage.save(content);
    return { key: name };
  })
  .listen({port: config.port, hostname: config.host});

log(
  `📚 Hastysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
