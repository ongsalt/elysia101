import Elysia, { NotFoundError, t } from "elysia";
import { both, component, page } from "../core/view";
import { NotesRepository } from "../models/notes";
import htmx from "../core/htmx";

const noteController = new Elysia({ prefix: '/note' })

noteController
    .use(htmx)
    .get('/', () => {
        const notes = NotesRepository.all()
        return page('note', { notes })
    })
    .get('/edit/:id', ({ request, htmx, params }) => {
        if (!htmx.isHtmxRequest) {
            throw new NotFoundError("Expect htmx request")
        }

        return component('note.edit', NotesRepository.find(parseInt(params.id)))
    })
    .get('/:id', ({ request, htmx, params }) => {
        if (!htmx.isHtmxRequest) {
            throw new NotFoundError("Expect htmx request")
        }

        return component('note', NotesRepository.find(parseInt(params.id)))
    })
    .patch('/:id', ({ request, htmx, params, body }) => {
        console.log(body)
        if (!htmx.isHtmxRequest) {
            throw new NotFoundError("Expect htmx request")
        }

        const id = parseInt(params.id)

        if (!NotesRepository.find(id)) {
            return component('note', NotesRepository.create(body))
        }

        return component('note', NotesRepository.update(id, body))
    }, {
        body: t.Object({
            title: t.String(),
            body: t.String()
        })
    })
    .get('/new', ({ htmx}) => {
        if (!htmx.isHtmxRequest) {
            throw new NotFoundError("Expect htmx request")
        }
        return component('note.add')
    })
    .post('/', ({ request, htmx, body }) => {
        if (!htmx.isHtmxRequest) {
            throw new NotFoundError("Expect htmx request")
        }

        return both(component('note', NotesRepository.create(body)), component('note.addbutton'))
    }, {
        body: t.Object({
            title: t.String(),
            body: t.String()
        })
    })
export default noteController