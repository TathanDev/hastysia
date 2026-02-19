import { redis, RedisClient } from "bun";
import generateName from "../utils/utils";
import { DataStorage } from "./data-storage";
import { log } from "../utils/logger";


export class RedisStorage implements DataStorage {

    private redisClient: any;

    constructor(connectionString: string) {
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
}