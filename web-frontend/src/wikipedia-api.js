import {fetchJson} from "./base";

export default class WikipediaApi {
    // with namespace, with underscores, without spaces
    // getPageNameFull() {
    //     return mw.config.get('wgPageName');
    // }

    // without namespace, without underscores, with spaces
    // getPageName() {
    //     return mw.config.get('wgTitle');
    // }

    isMainNamespace() {
        return mw.config.get('wgNamespaceNumber') === 0;
    }

    async getWikitext(title) {
        let data = {
            action: 'query',
            prop: 'revisions',
            titles: title,
            rvprop: 'content',
            format: 'json'
        };
        let response = await fetchJson(`/w/api.php`, {data});
        return Object.values(response.query.pages)[0].revisions[0]['*'];
    }

    getEditToken() {
        return mw.user.tokens.get('editToken');
    }
}

// with namespace, with underscores, without spaces
export const currentPageName = mw.config.get('wgPageName');