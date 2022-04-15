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
        resource: RequestInfo,
        init?: RequestInit
    ): Promise<string | Response> {
        const value = localStorage.getItem(name);
        if (value != null) {
            return value;
        }

        const response = await fetch(resource, init);
        if (response.status != 200) {
            return response;
        }

        const str = await response.text();
        localStorage.setItem(name, str);
        return str;
    }
}
