let request = require('request'),
    extractDomain = require('./extractDomain');
// let args = process.argv.slice(2);
let verbose = 1;
function simplifyList(list, filterFunction) {
    let simpleList = [];
    for (let i = 0, len = list.length; i < len; i++) {
        let item = list[i];
        if (!filterFunction(item)) {
            continue;
        }
        simpleList[i] = {
            domain: extractDomain(item.advertiserUrl),
            rating: item.rating
        }
    }
    return simpleList;
}

function getList(publisherId, authToken, minRating, pageSize, onSuccess) {
    let listUrl = 'https://members.cj.com/member/publisher/' + publisherId + '/advertiserSearch.json?pageNumber=1&publisherId=' + publisherId + '&pageSize=' + pageSize + '&geographicSource=&ignoreForcedSort=true&sortColumn=rating&sortDescending=true';

    request.get(
        listUrl,
        {
            headers: {AuthenticationToken: authToken}
        },
        function (err, res, body) {
            if (err) {
                console.error(err, body);
                return;
            }
            try {
                body = JSON.parse(body);
            } catch (e) {
                console.error(e, body);
            }
            if(!body.advertisers){
                console.error(body);
            }
            let list = simplifyList(body.advertisers, function (itemToFilter) {
                return itemToFilter.rating >= minRating;
            });
            if (verbose == 1) {
                console.error('CJ:{Got: ' + list.length, ', Max: ' + pageSize + '}');
            }
            onSuccess(list);
            if (list.length == pageSize) {
                console.error('Page size is too small for minRating. List has been truncated.');
            }
        }
    )
}

// function login(onSuccess) {
//     let loginUrl = 'https://members.cj.com/member/foundation/memberlogin.do';
//     request.post(
//         loginUrl,
//         {
//             form: {
//                 uname: args[1],
//                 pw: args[2]
//             }
//         },
//         function (err, res, body) {
//             if (err) {
//                 console.error(err, body);
//                 return;
//             }
//             let cookies = res.headers['set-cookie'];
//             let authToken = null;
//             cookies.forEach(function (cookie) {
//                 let tokenStart = 'AuthenticationToken=';
//                 if (cookie.indexOf(tokenStart) === 0) {
//                     authToken = cookie.split(tokenStart)[1].split(';')[0];
//                 }
//             });
//             if (!authToken) {
//                 console.error('Auth failed.', res.statusCode, body);
//             }
//             if (authToken) {
//                 onSuccess(authToken);
//             }
//         }
//     );
// }

// login(function (authToken) {
//     getList(
//         authToken,
//         args[3],
//         args[4],
//         function (domains) {
//             process.stdout.write("\n" + JSON.stringify(domains, null, 4));
//         }
//     )
// });

module.exports = {
    // login: login,
    getList: getList
};

// /**
//  * Example args:
//  * publisherIdNumber authTokenFromLoggingIn 4 1000
//  */
// getList(
//     args[1],
//     args[2],
//     args[3],
//     function (domains) {
//         process.stdout.write("\n" + JSON.stringify(domains, null, 4));
//     }
// );
