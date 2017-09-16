export default class WikipediaApi {
    // with namespace, with underscores, without spaces
    getPageNameFull() {
        return mw.config.get('wgPageName');
    }

    // without namespace, without underscores, with spaces
    getPageName() {
        return mw.config.get('wgTitle');
    }

    isMainNamespace() {
        return mw.config.get('wgNamespaceNumber') === 0;
    }
}