import { html } from "@elysiajs/html"
import Elysia from "elysia"

const errorPageHandler = new Elysia()
    .use(html())
    .onError(({ code, error, set }) => {
        if (code === "UNKNOWN") {
            return "dafaq"
        }
    })

export default errorPageHandler