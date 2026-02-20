import { log } from "./logger";

/**
 * This class manages the deletion of expired files in the file storage system. 
 * It keeps track of when each file should expire and deletes them when necessary.
 */
export class DeletionManager {

    private defaultTimeout: number
    private dataFolder: string

    constructor(dataFolder: string, timeout: number) {
        this.defaultTimeout = timeout
        this.dataFolder = dataFolder
        this.checkStorageFile();
    }

    private async checkStorageFile(): Promise<void> {
        const storageFile = Bun.file(`${this.dataFolder}/storage.json`)
        if (!await storageFile.exists()) {
            await storageFile.write(JSON.stringify({}))
        }
    }

    public async addToDeletion(id: string) {
        const storageFile = Bun.file(`${this.dataFolder}/storage.json`)
        const data = JSON.parse(await storageFile.text())
        
        data[id] = Date.now() + this.defaultTimeout
        await storageFile.write(JSON.stringify(data))
    }

    public async removeOldEntries() {
        const storageFile = Bun.file(`${this.dataFolder}/storage.json`)
        const data = JSON.parse(await storageFile.text())
        const now = Date.now()
        let changed = false
        for (const id in data) {
            if (data[id] < now) {
                delete data[id]
                changed = true
                Bun.file(`${this.dataFolder}/${id}`).delete().catch(() => {
                    log("Failed to delete file with id:", id);
                });
                log("Deleted expired entry with id:", id);
            }
        }
        if (changed) {
            await storageFile.write(JSON.stringify(data))
        }
    }
}