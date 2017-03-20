let whois = require('node-whois');
let whoisConfig = {
    verbose: false,
    // server: 'whois.verisign-grs.com' //comment or uncomment this when the default server starts timing out (this one says wkipedia.org is not found when it does exist though)
};

export default function (domainName, callback) {
    whois.lookup(domainName, whoisConfig, function (err, data) {
        let whoisExists = null;
        let whoisError = null;
        let countType = null;
        if (err) {
            console.error(err);
            whoisExists = 1;
            whoisError = 1;
            countType = 'ERROR';
        } else {
            if (
                data.includes('Registrant Email:')
                || data.includes('Registrant Name:')
                || data.includes('Registrant:')
                || data.includes('Name Server:')
                || data.includes('Creation Date:')
                || data.includes('Status: clientDeleteProhibited')
                || data.includes('Status: clientTransferProhibited')
                || data.includes('Status: clientUpdateProhibited')
                || data.includes('markmonitor')
            ) {
                whoisExists = 1;
                whoisError = 0;
                countType = 'EXISTS';
            } else {
                whoisExists = 0;
                whoisError = 0;
                countType = 'NOEXISTS'
            }
        }

        callback({
            detailedCode: countType,
            exists: whoisExists,
            error: whoisError,
            response: data
        });
    });
};
