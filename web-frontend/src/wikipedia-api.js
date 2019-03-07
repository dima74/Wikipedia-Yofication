import { fetchJson } from './base';

// with namespace, with underscores, without spaces
export const currentPageName = mw.config.get('wgPageName');

class WikipediaApi {
    isMainNamespace() {
        return mw.config.get('wgNamespaceNumber') === 0;
    }

    async getWikitext(title) {
        const data = {
            action: 'query',
            prop: 'revisions',
            titles: title,
            rvprop: 'content',
            format: 'json',
        };
        const response = await fetchJson(`/w/api.php`, { data });
        return Object.values(response.query.pages)[0].revisions[0]['*'];
    }
}

const wikipediaApi = new WikipediaApi();
export default wikipediaApi;
