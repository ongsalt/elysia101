import Elysia, { NotFoundError } from "elysia";
import { component, page } from "../core/view";
import { NotesRepository } from "../models/notes";
import htmx from "../core/htmx";

const noteController = new Elysia({ prefix: '/note' })

noteController
    .use(htmx)
    .get('/', () => {
        const notes = NotesRepository.all()
        return page('note', { notes })
    })
    .get('/edit/:id', ({ request, htmx }) => {
        if (!htmx.isHtmxRequest) {
            throw new NotFoundError("Expect htmx request")
        }

        return component('')
    })

export default noteController