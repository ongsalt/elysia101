import { NotFoundError } from "elysia"

export class NotesRepository {
    static data: Note[] = [
        {
            id: 1,
            title: "Mark",
            body: "loremsdjkfhbghvfjkehuhkuefhrj"
        },
        {
            id: 2,
            title: "Gaythai",
            body: "Allahu akbar"
        },
    ]

    static create(note: Note) {
        this.data.push(note)
    }

    static all() {
        return this.data
    }

    static update(updated: Note) {
        const target = this.data.find(it => it.id == updated.id)
        if (!target) throw new NotFoundError("Note not found")

        target.body = updated.body
        target.title = updated.title
    }
}

export interface Note {
    id: number,
    title: string,
    body: string
}