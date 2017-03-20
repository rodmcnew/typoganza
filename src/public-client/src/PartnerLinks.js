export default class PartnerLinks {
    static getNameCheapLink(domainName) {
        return 'http://www.anrdoezrs.net/links/7817669/type/dlg/https://www.namecheap.com/domains/registration/results.aspx?domain=' + domainName;
    }

    static getDoDaddyLink(domainName) {
        return 'https://www.godaddy.com/domains/searchresults.aspx?domainToCheck=' + domainName;
    }

    static getAlexaLink(domainName) {
        return 'http://www.alexa.com/siteinfo/' + domainName;
    }

    static getDomainToolsWhoisHistoryLink(domainName) {
        return 'http://research.domaintools.com/research/whois-history/search/?q=' + domainName;
    }

    static getGoogleSearchLink(domainName) {
        return 'https://www.google.com/#q=' + domainName;
    }

    static getGoogleSearchLinkIgnoreYouMayAlsoMean(domainName) {
        return 'https://www.google.com/#q=' + domainName + '&nfpr=1&*';
    }
}
