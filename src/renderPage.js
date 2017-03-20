import renderListPage from './renderListPage'
import TypoService from './TypoService'

let urls = [
    '/available-typo-domains/alexa/top/250',
    '/available-typo-domains/alexa/top/500',
    '/available-typo-domains/alexa/top/1000',
    '/available-typo-domains/cj/star-rating/5',
    '/available-typo-domains/cj/star-rating/4',
    '/available-typo-domains/cj/star-rating/3',
    '/available-typo-domains/cj/top/1000'
];

export function renderPage(url, state, user, authToken, userManager) {
    let html = '';

    function getHiddenParents(user) {
        let hiddenParents = [];

        //Any hidden parents on the admin's list apply to all users
        if (userManager.getUser('admin').hiddenParents) {
            hiddenParents = hiddenParents.concat(userManager.getUser('admin').hiddenParents);
        }

        //Add the current logged-in user's hidden parents
        if (user && user.hiddenParents) {
            hiddenParents = hiddenParents.concat(user.hiddenParents);
        }

        return hiddenParents;
    }

    function renderList(title, rankLabel, typos) {
        return renderListPage(
            title,
            {
                rankLabel: rankLabel,
                listTitle: title,
                typos: typos,
                currentNavLink: url,
                authToken: authToken
            }
        );
    }

    function renderAlexaTop(topCount) {
        return renderList(
            'Available Typo Domain List - Alexa Top ' + topCount,
            'Alexa Ranking',
            TypoService.getAlexaTypos(state, getHiddenParents(user), topCount)
        );
    }

    function renderCjStar(star) {
        return renderList(
            'Available Typo Domain List - CJ ' + star + ' Star Rated',
            'CJ Rating',
            TypoService.getCjTypos(state, getHiddenParents(user), star)
        );
    }

    switch (url) {
        case '/available-typo-domains/alexa/top/250':
            html = renderAlexaTop(250);
            break;
        case '/available-typo-domains/alexa/top/500':
            html = renderAlexaTop(500);
            break;
        case '/available-typo-domains/alexa/top/1000':
            html = renderAlexaTop(1000);
            break;
        case '/available-typo-domains/cj/star-rating/5':
            html = renderCjStar(5);
            break;
        case '/available-typo-domains/cj/star-rating/4':
            html = renderCjStar(4);
            break;
        case '/available-typo-domains/cj/star-rating/3':
            html = renderCjStar(3);
            break;
        case '/available-typo-domains/cj/top/1000':
            html = renderList(
                'Available Typo Domain List - CJ Top 1000',
                'CJ Rating',
                TypoService.getCjTypos(state, getHiddenParents(user), null)
            );
            break;
        default:
            throw new Error('Unknown URL: ' + url);
    }

    return html;
}

export function warmCache(state, user, userManager) {
    urls.forEach((url) => {
        renderPage(url, state, user, null, userManager);
    });
}

export function getUrls() {
    return urls;
}
