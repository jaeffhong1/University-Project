export default class CacheSystem {
    /**
     * fetches from the cache if the same request has already been sent before
     * @param name unique name identifying the request
     * @param resource URL
     * @param init parameters
     * @returns string on success (response), Response object on error code != 200 (body not consumed)
     */
    static async fetch(
        name: string,
        durationSeconds: number,
        resource: RequestInfo,
        init?: RequestInit
    ): Promise<string | Response> {
        name += '-v1.0.0'
        const data = localStorage.getItem(name);
        if (data != null) {
            const {content, at} = JSON.parse(data)
            if (durationSeconds > 0 && Math.floor(Date.now() / 1000) < at + durationSeconds)
                return content
        }

        const response = await fetch(resource, init);
        if (response.status != 200) {
            return response;
        }

        const str = await response.text();
        const obj = {
            content: str,
            at: Math.floor(Date.now() / 1000),
        }
        localStorage.setItem(name, JSON.stringify(obj));
        return str;
    }
}
