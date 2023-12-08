import * as Sqrl from 'squirrelly'
import { TemplateFunction } from 'squirrelly/dist/types/compile'

const templateCache = new Map<string, TemplateFunction>()
await prepareLayout()

// Need to register all template first
// Sqrl.templates.define("my-partial", Sqrl.compile("This is a partial speaking"));

async function prepareLayout() {
    const fileContent = await Bun.file(`views/_layout.html`).text()
    const compile = Sqrl.compile(fileContent)
    templateCache.set('_layout', compile)
}

/**
 * 
 * @param name "dir.name" mean /views/dir/name.html  
 * @returns view
 */
export async function view(name: string, data: Record<string, any> = {}) {
    // format name
    const id = name.toLowerCase()

    let compile = templateCache.get(id);
    const withLayout = templateCache.get('_layout')!

    if (!compile) {
        const fileContent = await Bun.file(`views/${id.replaceAll('.', '/')}.html`).text()
        compile = Sqrl.compile(fileContent)

        // Only do cache in prod
        if (Bun.env.NODE_ENV === 'Production') {
            templateCache.set('id', compile)
        }
    }

    return withLayout({
        content: compile(data, Sqrl.defaultConfig)
    }, Sqrl.defaultConfig)
}