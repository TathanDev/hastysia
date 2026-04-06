import { RedisClient } from "bun";
import { generateName } from "../utils/utils";
import { DataStorage } from "./data-storage";
import { log } from "../utils/logger";


export class RedisStorage extends DataStorage {

    private redisClient: RedisClient;
    private static readonly MAX_EXPIRE_SECONDS = 2147483647;

    constructor(connectionString: string, timeout: number | null) {
        super(timeout);
        log("Using Redis storage with connection string:", connectionString);

        this.redisClient = new RedisClient(connectionString);
        this.redisClient.connect().then(() => {
            log("Connected to Redis successfully");
        });

    }


    public async save(content: string): Promise<string> {
        let name = generateName();

        while (await this.redisClient.exists(name)) {
            name = generateName();
        }
        await this.redisClient.set(name, content);

        const expireSeconds = this.getExpireSeconds();
        if (expireSeconds !== null) {
            await this.redisClient.expire(name, expireSeconds);
        }

        log("Saved content with name:", name);
        return name;
    }

    public async read(name: string): Promise<string | null> {

        const value = await this.redisClient.get(name);
        if (value === null) {
            log("Failed to read content with name:", name);
            return null;
        }

        return value;
    }

    private getExpireSeconds(): number | null {
        if (!this.defaultTimeout) {
            return null;
        }

        const seconds = Math.floor(this.defaultTimeout / 1000);
        if (seconds <= 0) {
            return null;
        }

        return Math.min(seconds, RedisStorage.MAX_EXPIRE_SECONDS);
    }

    public checkAndDeleteExpiredEntries(): Promise<void> {
        // Redis handles expiration internally, so we don't need to implement this.
        return Promise.resolve();
    }
}