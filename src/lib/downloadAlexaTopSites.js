/**
 *
 * @param {Function} cb
 * @param {int} [domainCountLimit] optional
 */
module.exports = function (cb, domainCountLimit) {
    let file_url = 'http://s3.amazonaws.com/alexa-static/top-1m.csv.zip';

    let request = require('request');
    let fs = require('fs');
    let AdmZip = require('adm-zip');
    let http = require('http');
    let url = require('url');

    let options = {
        host: url.parse(file_url).host,
        port: 80,
        path: url.parse(file_url).pathname
    };

    http.get(options, function (res) {
        let data = [], dataLen = 0;

        res.on('data', function (chunk) {

            data.push(chunk);
            dataLen += chunk.length;

        }).on('end', function () {
            let buf = new Buffer(dataLen);

            for (let i = 0, len = data.length, pos = 0; i < len; i++) {
                data[i].copy(buf, pos);
                pos += data[i].length;
            }

            let zip = new AdmZip(buf);
            let zipEntries = zip.getEntries();
            let content = zip.readAsText(zipEntries[0]);
            let lines = content.split("\n");
            let domains = [];
            for (let line = 0; i < lines.length; line++) {
                if (domainCountLimit && line >= domainCountLimit) {
                    break;
                }
                if (lines[line]) {
                    let lineParts = lines[line].split(',');
                    if (lineParts.count = 2) {
                        domains.push({
                            rank: lineParts[0],
                            domain: lineParts[1]
                        });
                    }
                }
            }
            cb(domains);
        });
    });
};
