import { MaybePromise } from 'elysia';
import { readdir } from 'node:fs/promises';
import { sep as DIRECTORY_SEPARATOR } from 'node:path'

import * as Sqrl from 'squirrelly'
import { TemplateFunction } from 'squirrelly/dist/types/compile'

const templateCache = new Map<string, TemplateFunction>()
await preloadViews()


async function preloadViews() {
    // Need to register all template first 
    // then we wont need to look at template cache anymore

    // @ts-expect-error I suspect that Bun doesnt provide good typing for node api
    const compoentFileNames: string[] = (await readdir('components', { recursive: true, withFileTypes: true }))
        // @ts-expect-error
        .filter(it => !it.isDirectory())
        // @ts-expect-error 
        .map(it => `components/${it.name}`)

    // @ts-expect-error
    const pageFileNames: string[] = (await readdir('pages', { recursive: true, withFileTypes: true }))
        // @ts-expect-error
        .filter(it => !it.isDirectory())
        // @ts-expect-error 
        .map(it => `pages/${it.name}`)

    const tasks = [...compoentFileNames, ...pageFileNames].map(async name => {
        const id = name
            .toLowerCase()
            .replaceAll('.html', '')
            .replaceAll(DIRECTORY_SEPARATOR, '.')
        const content = await Bun.file(`${name}`).text()
        const compile = Sqrl.compile(content)

        templateCache.set(id, compile)
        Sqrl.templates.define(id, compile)
    })

    return Promise.all(tasks)
}

/**
 * 
 * @param name "dir.name" mean /views/dir/name.html  
 * @returns view
 */
export async function renderTemplate(name: string, data: Record<string, any> = {}) {
    // format name
    const id = name.toLowerCase()

    await preloadViews()

    let compile = templateCache.get(id);

    // Can emit .index
    if (!compile) {
        compile = templateCache.get(`${id}.index`)
    }

    if (!compile) {
        const fileContent = await Bun.file(`${id.replaceAll('.', DIRECTORY_SEPARATOR)}.html`).text()
        compile = Sqrl.compile(fileContent)
    }

    return compile(data, Sqrl.defaultConfig)
}

export async function page(name: string, data: Record<string, any> = {}) {
    const content = await renderTemplate(`pages.${name}`, data)

    const withLayout = templateCache.get('pages._layout')!

    return withLayout({
        content
    }, Sqrl.defaultConfig)
}

export async function component(name: string, data: Record<string, any> = {}) {
    return await renderTemplate(`components.${name}`, data)
}

export async function both(a: MaybePromise<string>, b: MaybePromise<string>) {
    return `${(await a)} ${(await b)}`
}