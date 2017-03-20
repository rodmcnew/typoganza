let url = require('url'),
    typoGen = require('./typoGen'),
    typoConfig = {
        transposedChars: true,
        missedChars: true
        //wrongKeys: true
        //doubleChars:true
        //generateHomophones: true
    };

function typoShouldBeIgnored(original, typoDomain) {
    if (original.substr(0, 1) != typoDomain.substr(0, 1)) {
        return true
    }
    return false;
}

/**
 *
 * @param {string} domain
 * @param {boolean} [justSearchDotCm] optinal
 * @returns {Array}
 */
module.exports = function (domain, justSearchDotCm) {
    let domainParts = domain.split(/\.(.+)?/);
    let beforeTld = domainParts[0];
    let tld = '.' + domainParts[1];
    let typosWithoutTlds = [];
    if (justSearchDotCm) {
        typosWithoutTlds = [beforeTld];
    } else {
        typosWithoutTlds = typoGen([beforeTld], typoConfig);
    }
    let typos = [];
    typosWithoutTlds.forEach(function (typoBeforeTld) {
        let domain = beforeTld + tld;
        if (justSearchDotCm) {
            tld = tld.replace('com', 'cm');
        }
        let typoDomain = typoBeforeTld + tld;
        if (!typoShouldBeIgnored(domain, typoDomain) || justSearchDotCm) {
            typos.push({
                domain: domain,
                typo: typoDomain
            });
        }
    });
    return typos;
};
