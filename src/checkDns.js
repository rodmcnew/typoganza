import dnsExists from './lib/dnsExists'
import getCurrentUnixTimeStamp from './lib/getCurrentUnixTimeStamp';

let counts = {};

export function checkDnsBatch(state, count) {
    let processedCount = -1;
    for (let i = 0; i < state.typos.length; i++) {
        let typo = state.typos[i];
        let dateCutOff = getCurrentUnixTimeStamp() - 60 * 60 * 24; //24 hours
        let currentUnixTimeStamp = getCurrentUnixTimeStamp();

        if (
            (typo.enabled === 0)
            || (typo.dnsChecked && typo.dnsChecked > dateCutOff)
            || typo.dnsCheckPending === 1
        ) {
            continue;
        }

        processedCount++;
        if (processedCount === count) {
            break
        }

        typo.dnsCheckPending = 1;

        dnsExists(typo.name, function (dnsCheckResponse) {
            delete typo.dnsCheckPending;
            typo.dnsExists = dnsCheckResponse.exists;
            typo.dnsChecked = currentUnixTimeStamp;
            typo.dnsError = dnsCheckResponse.error;
            if (typo.dnsError === 0) {
                delete typo.dnsError; //Save disk space
            }

            console.log(
                (dnsCheckResponse.dnsError == 1 ? '(!) ERROR (!) ' : '') + 'DNS - '
                + JSON.stringify(counts) + ' - ' + typo.name + ' - ' + dnsCheckResponse.detailedCode);

            if (!counts[dnsCheckResponse.detailedCode]) {
                counts[dnsCheckResponse.detailedCode] = 0;
            }
            counts[dnsCheckResponse.detailedCode]++;

        });
    }

    // if (processedCount === -1) {
    //     console.log('DNS - Nothing to process right now.')
    // }
}
