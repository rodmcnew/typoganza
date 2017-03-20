import whoisExists from './lib/whoisExists'
import getCurrentUnixTimeStamp from './lib/getCurrentUnixTimeStamp';

let counts = {};

export function checkWhoisBatch(state, count) {
    let processedCount = -1;
    for (let i = 0; i < state.typos.length; i++) {
        let typo = state.typos[i];
        let dateCutOff = getCurrentUnixTimeStamp() - 60 * 60 * 24; //24 hours
        let currentUnixTimeStamp = getCurrentUnixTimeStamp();

        if (
            typo.enabled === 0
            || typo.dnsExists === 1
            || (typo.whoisChecked && typo.whoisChecked > dateCutOff)
            || typo.whoisCheckPending === 1
        ) {
            continue
        }

        processedCount++;
        if (processedCount === count) {
            break
        }

        typo.whoisCheckPending = 1;
        whoisExists(typo.name, function (whoisCheckResponse) {
            delete typo.whoisCheckPending;
            typo.whoisExists = whoisCheckResponse.exists;
            typo.whoisChecked = currentUnixTimeStamp;
            typo.whoisError = whoisCheckResponse.error;
            if (typo.whoisError === 0) {
                delete typo.whoisError; //Save disk space
            }

            console.log(
                (whoisCheckResponse.whoisError == 1 ? '(!) ERROR (!) ' : '') + 'WHOIS - '
                + JSON.stringify(counts) + ' - ' + typo.name + ' - ' + whoisCheckResponse.detailedCode);

            if (!counts[whoisCheckResponse.detailedCode]) {
                counts[whoisCheckResponse.detailedCode] = 0;
            }
            counts[whoisCheckResponse.detailedCode]++;
        });
    }

    // if (processedCount === -1) {
    //     console.log('WHOIS - Nothing to process right now.')
    // }
}
