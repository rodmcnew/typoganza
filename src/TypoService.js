function getAvailableTypos(state) {
    return state.typos.filter(
        (typo) => typo.dnsExists === 0 && typo.whoisExists === 0
        //TODO just add these to banned list (co.jp, .jp, .ru, .com.cn though?)
        && !typo.parent.includes('google.')
        && !typo.parent.includes('yahoo.')
        && !typo.parent.includes('amazon.')
        && !typo.parent.includes('click')
        && !typo.parent.includes('.co.jp')
        && !typo.parent.includes('.jp')
        && !typo.parent.includes('.com.cn')
        && !typo.parent.includes('.ru')
        && !typo.parent.includes('.gov')
        && typo.name.length > 7
    );
}

export default class TypoService {
    static getAlexaTypos(state, hiddenParents, maxRank) {
        let typos = getAvailableTypos(state).filter(function (typo) {
            return typo.rank && typo.rank <= maxRank;
        });
        typos = TypoService.filterOutHiddenParents(typos, hiddenParents);
        return typos;
    }

    static getCjTypos(state, hiddenParents, rating) {
        let typos = getAvailableTypos(state).filter(function (typo) {
            return typo.rating;
        });

        if (rating) {
            typos = getAvailableTypos(state).filter((typo) => rating === typo.rating);
        }

        typos = TypoService.filterOutHiddenParents(typos, hiddenParents);

        //Change "rating" to "rank" because that is what the client views demand it be called
        typos = typos.map(function (typo) {
            return {
                name: typo.name,
                parent: typo.parent,
                rank: typo.rating
            };
        });

        return typos;
    }

    static filterOutHiddenParents(typos, hiddenParents) {
        if (hiddenParents.length === 0) {
            return typos;
        }
        return typos.filter((typo) => hiddenParents.indexOf(typo.parent) === -1);
    }

    static removeDuplicateTypos(typos) {
        //@TODO this is a hack of filter find better way
        let alreadySawNames = [];
        typos = typos.filter(function (typo) {
            let isNotDuplicate = alreadySawNames.indexOf(typo.name) === -1;
            alreadySawNames.push(typo.name);
            return isNotDuplicate
        });
        return typos;
    }
}
