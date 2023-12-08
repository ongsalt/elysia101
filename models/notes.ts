import { NotFoundError } from "elysia"

export class NotesRepository {
    static id = 2;
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

    static create(note: Omit<Note, "id">) {
        const data: Note = { ...note, id: ++this.id }
        this.data.push(data)
        return data
    }

    static all() {
        return this.data
    }


    static find(id: number) {
        return this.data.find(it => it.id === id)
    }

    static update(id: number, updated: Omit<Note, "id">) {
        const target = this.data.find(it => it.id == id)
        if (!target) throw new NotFoundError("Note not found")

        target.body = updated.body
        target.title = updated.title

        return target
    }
}

export interface Note {
    id: number,
    title: string,
    body: string
}