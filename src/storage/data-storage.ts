//Interface to store data
export interface DataStorage {
    save(content: string): Promise<string>
    read(name: string): Promise<string | null>
}