import Elysia, { NotFoundError } from "elysia"

interface HTMXData {
    isHtmxRequest: boolean,
    currentUrl?: string
    expectHtmx: () => void
}

const htmx = new Elysia()
    .derive(({ request }) => {
        const htmxData: any = {
            isHtmxRequest: request.headers.get('hx-request') === "true"
        }

        if (htmxData.isHtmxRequest) {
            htmxData.expectHtmx = () => { }
            htmxData.currentUrl = request.headers.get('hx-current-url')!
        } else {
            htmxData.expectHtmx = () => { throw new NotFoundError('Expect htmx request') }
        }

        return {
            htmx: (htmxData as HTMXData)
        }
    })

export default htmx