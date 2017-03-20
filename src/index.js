import express from 'express'
import {checkDnsBatch} from './checkDns'
import {checkWhoisBatch} from './checkWhois'
import mysqlPoolFactory from './lib/mysqlPoolFactory'
import MysqlStateRepository from './lib/MysqlStateRepository'
import UserManger from './lib/UserManager'
import {renderPage, warmCache, getUrls as getPageUrls} from './renderPage'
import TypoService from './TypoService'
import whoisExists from './lib/whoisExists'

let app = express();
let state = {typos: [], users: [], authTokens: {}};

let userManager = new UserManger();

//This middleware puts the user into the request if there is a current user
app.use(userManager.getMiddleware());

//Add a route for each known content page
getPageUrls().forEach((url) => {
    app.get(url, (req, res) => {
        res.send(renderPage(url, state, req.user, req.authToken, userManager));
    });
});

//Redirect homepage to this page
app.get('/', (req, res) => {
    res.redirect('/available-typo-domains/alexa/top/250');
});

//The route to mark typos as needing DNS and WHOIS rechecked
app.put('/api/typo/recheck-needed/:name', function (req, res) {
    if (!req.user) {
        res.status(401).send('Not Authorized');
        return;
    }
    let typo = state.typos.find((typo) => typo.name === req.params.name);
    if (!typo) {
        res.status(404).send('Not Found');
        return;
    }

    typo.dnsChecked = null;
    typo.whoisChecked = null;

    res.send(true);
});

//The route for hiding typos for a given user
app.put('/api/hidden-parents/_current-user_/:name', function (req, res) {
    if (!req.user) {
        res.status(401).send('Not Authorized');
        return;
    }
    if (!req.user.hiddenParents) {
        req.user.hiddenParents = [];
    }
    req.user.hiddenParents.push(req.params.name);
    res.send(true);
});

//The route for viewing the whois responses which is useful for debugging
app.get('/api/whois/:domainName', function (req, res) {
    if (!req.user || req.user.id !== 'admin') {
        res.status(401).send('Not Authorized');
        return;
    }
    whoisExists(req.params.domainName, function (whoisCheckResponse) {
        res.send(whoisCheckResponse);
    });
});

//The route for viewing the raw typo data which is useful for debugging
app.get('/typos-raw', function (req, res) {
    if (!req.user || req.user.id !== 'admin') {
        res.status(401).send('Not Authorized');
        return;
    }
    res.send(state.typos);
});

// app.put('/api/users/:userId', createUserMiddleware(userManager)); Uncomment to enable new user registration

let mysqlConnectionPool = mysqlPoolFactory(process.env.MYSQL_URL, 1);
let stateRepository = new MysqlStateRepository(mysqlConnectionPool);

stateRepository.get((savedState) => {
    //Read the previously saved state from persistent storage
    state = savedState;

    //Inform the user manager of the previously saved state
    userManager.setUsers(state.users || []);
    userManager.setAuthTokens(state.authTokens || {});

    //Somehow duplicates get in through the "loadData" process. //@TODO fix in loadData instead of here
    state.typos = TypoService.removeDuplicateTypos(state.typos);

    //Add the admin user if there is an environment var asking for it to be forced in
    if (process.env.ADMIN_USER_AUTH_TOKEN) {
        if (!userManager.getUser('admin')) {
            userManager.addUser({id: 'admin'});
        }
        userManager.addAuthToken(process.env.ADMIN_USER_AUTH_TOKEN, 'admin');
    }

    //Process a batch of DNS and WHOIS checks every second
    if (!process.env.DISABLE_ENGINE) {
        setInterval(() => {
            checkDnsBatch(state, 5);
            checkWhoisBatch(state, 1)
        }, 1000);
    }

    //Warm the page rendering cache every 60 seconds
    setInterval(() => {
        warmCache(state, null, userManager);
        // warmCache(state, userManager.getUser('admin'), userManager);
    }, 60000);

    //Save our current state to persistent storage every 60 seconds
    setInterval(() => {
        state.users = userManager.getUsers();
        state.authTokens = userManager.getAuthTokens();
        stateRepository.put(state);
    }, 60000);

    //Start the web server
    let server = app.listen(process.env.PORT || 8080, () => {
        console.log('Web server listening on port ' + server.address().port);
    });
});


