let dns = require('dns');
export default function (domainName, callback) {
    dns.resolve4(domainName, function (err) {
        let dnsExists = null;
        let dnsError = null;
        let detailedCode = 'EXISTS';
        if (err) {
            detailedCode = err.code;
        }

        switch (detailedCode) {
            case 'EXISTS':
                dnsExists = 1;
                dnsError = 0;
                break;
            case 'FORMERR':
            case 'ESERVFAIL':
            case 'ENOTFOUND':
            case 'ENODATA':
                dnsExists = 0;
                dnsError = 0;
                break;
            default:
                dnsExists = 1;
                dnsError = 1;
        }

        callback({
            detailedCode: detailedCode,
            exists: dnsExists,
            error: dnsError
        });
    });
};
