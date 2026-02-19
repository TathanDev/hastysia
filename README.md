# Hastysia

Discover a modern haste server based on [Elysia](https://elysiajs.com/)

> [!WARNING]  
> This project is in early beta! Bugs may occurs

## Features

- Fast : Based on the super fast elysia framework, this haste server is very fast too (I hope).

- Modern : Use modern libraries to run so everything is updated !

- Configurable : Configure the server as you wish (well not for now but soon yes).

- Copy File : Copy the page of your choice and then edit as you wish.

- Raw File : Get the raw file by just going to `http://website/raw/:id`

- Multiple Data Storage : Store data via file or with redis !

## Getting Started

Install Bun : [Installation](https://bun.com/docs/installation)

Clone the repository

```bash
git clone https://github.com/TathanDev/haste-elysia.git
```

Install dependencies

```bash
bun install
```

Configure the server in the `config.ts`

Start the Server

```bash
bun run dev
```

Open http://localhost:7777/ with your browser to see the result.

## Upcoming features

Here a list of features I want to add to hastysia.

**More File storage**
Right now, Hastysia haste only support file storage and redis.
But I want to add support for database supports

**Auto File Delete**
Add an option to delete old files

**Docker File**
I also want to add a docker file to easily deploy the service.

**A Better Name**
I think this name is good but can maybe change to something more profesionnal... I don't know for now

## Settings

All the settings can be found in the [Config Type Definiton](https://github.com/TathanDev/hastysia/blob/main/src/types/config.ts).

### Redis Storage

To use redis, you need to give it a connection string like this.

```ts
storage: {
    type: 'redis',
    redis: {
        connectionString: 'redis://localhost:6379'
    }
}
```

## Documentation

### Post file

To post a file to your haste server, you need to use the `/save` endpoints.
You need to pass your file content in the body.

Here an exemple for vanilla javascript

```js
const request = new XMLHttpRequest();
request.open("POST", yourHasteServerUrl);
request.setRequestHeader("Content-Type", "application/json");
request.send(JSON.stringify({ content }));
```
