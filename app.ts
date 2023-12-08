import { Elysia } from "elysia";
import { html } from '@elysiajs/html'
import { staticPlugin } from '@elysiajs/static'
import { page } from "./core/view";
import noteController from "./controllers/note.controller";

const app = new Elysia()

app
    .use(html())
    .use(staticPlugin({
        assets: 'public'
      }))  
    .get("/", () => "Hello Elysia")
    .get('/test', ({ query }) => {
        return page('index', { name: query.name ?? 'you' })
    })
    .use(noteController)
    .onError(({ set, error }) => {
        set.headers['Content-Type'] = 'text/html;charset=utf-8'
        return page('404', {
            message: error.message
        })
    })

app.listen(3000)

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
