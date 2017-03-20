import React from 'react';
import {renderToString} from 'react-dom/server';
import {App as PublicClientApp, template as publicClientTemplate} from './public-client/src';
import MemoryCache from './lib/MemoryCache'

let cache = new MemoryCache(60 * 60);//Keep cache entries for 1 hour.

export default function (title, initialState) {
    cache.removeExpiredCacheEntries();

    let cacheKey = cache.objectToKey({title: title, initialState: initialState});

    let html = cache.get(cacheKey);

    if (html) {
        return html
    }

    html = publicClientTemplate({
        body: renderToString(<PublicClientApp {...initialState}/>),
        title: title
    });

    cache.put(cacheKey, html);

    return html;
};
