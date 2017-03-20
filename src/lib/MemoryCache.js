import md5 from 'md5';

function getCurrentUnixTimeStamp() {
    return Math.round(+new Date() / 1000);
}

export default class MemoryCache {
    constructor(expireAfterThisManySeconds) {
        this.expireAfterThisManySeconds = expireAfterThisManySeconds;
        this.cache = [];
    }

    get(key) {

        let cacheEntry = this.cache.find((cacheEntry) => cacheEntry.key == key);

        if (cacheEntry) {
            return cacheEntry.output
        }

    }

    put(key, output) {
        this.cache.push({key: key, output: output, created: getCurrentUnixTimeStamp()});
    }

    objectToKey(object) {
        return md5(JSON.stringify(object))
    }

    removeExpiredCacheEntries() {
        let oldestAcceptableCreatedDate = getCurrentUnixTimeStamp() - this.expireAfterThisManySeconds; //24 hours
        this.cache = this.cache.filter((cacheEntry) => cacheEntry.created >= oldestAcceptableCreatedDate);
    }
}
