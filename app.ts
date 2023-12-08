import { Elysia } from "elysia";
import { html } from '@elysiajs/html'
import { view } from "./core/view";

const app = new Elysia()

app
    .use(html())
    .get("/", () => "Hello Elysia")
    .get('/test', ({ query }) => {
        return view('index', { name: query.name ?? 'you' })
    })

app.listen(3000)

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
