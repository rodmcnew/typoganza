let url = require('url');

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}
function cutDown(domain, maxSectionCount) {
    let split = domain.split('.');
    while (split.length > maxSectionCount) {
        split.shift();
        domain = split.join('.');
    }
    return domain;
}
module.exports = function (inputUrl) {
    let domain = url.parse(inputUrl).hostname.replace('www.', '');

    if (
        endsWith(domain, '.com')
        || endsWith(domain, '.fr')
        || endsWith(domain, '.ca')
    ) {
        domain = cutDown(domain, 2)
    } else if (endsWith(domain, '.co.uk')) {
        domain = cutDown(domain, 3)
    }

    return domain;
};
//function test() {
//    let testDomains = [
//        'http://bad.bad.good.com',
//        'http://bad.good.com',
//        'http://good.com',
//        'http://www.good.com/bad.bad?bad',
//        'http://good.co.uk',
//        'http://bad.good.co.uk'
//    ];
//    testDomains.forEach(function (item) {
//        cxonsole.lxog(module.exports(item));
//    })
//}
//test();
