export interface Storage {
    save(content: string): Promise<string>
    read(name: string): Promise<string | null>
}