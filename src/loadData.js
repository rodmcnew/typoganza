let generateTypos = require('./lib/generateTypos');
let downloadAlexaTopSites = require('./lib/downloadAlexaTopSites');
let stateRepository = require('./stateRepository');

let cj = require('./lib/cj');
let args = process.argv.slice(2);
let memberId = args[0];
let authToken = args[1];
let minRating = 0;
let maxCjCount = 1000;

let alexaParentDomainCount = 1000;

let state = {
    typos: []
};

downloadAlexaTopSites(
    function (domains) {
        domains.forEach(function (domain) {
            add(domain.domain, {rank: domain.rank});
        });

        cj.getList(memberId, authToken, minRating, maxCjCount, processCjList);

    },
    alexaParentDomainCount
);

function processCjList(domains) {
    domains.forEach(function (domain) {
        add(domain.domain, {rating: domain.rating});
    });

    console.log('putting....');
    stateRepository.put(state);
    console.log('done');
}

function add(parentName, data) {
    if (parentName.length < 8) {
        //Skip domains there the part in front of .com is less that 4 chars. @TODO move this to the generator
        return;
    }
    let typos = generateTypos(parentName, false);
    typos.forEach(function (typo) {
        let previouslyExistingTypo = state.typos.find((typo) => typo.name == typo);
        if (previouslyExistingTypo) {
            //@TODO do better here, allow any data props
            if (data.rank) {
                previouslyExistingTypo.rank = data.rank;
            }
            if (data.rating) {
                previouslyExistingTypo.rating = data.rating;
            }
        } else {
            state.typos.push(
                Object.assign(
                    {
                        name: typo.typo,
                        parent: parentName
                    }, data)
            );
        }
    });
}

