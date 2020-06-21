// public api

/**
 * known problems:
 * if you call an adding api multiple times in a row quickly, it will only save
 * the last one -> need some form of locking / different approach
 */

/*
Example usage:
save('my_key', {ellen: "is a potatoe"});
*/
function save(key, val, func) {
  console.log("saving");
  console.log(key);
  console.log(val);
  console.log(func);
  chrome.storage.local.set({[key]: val}, func);
}

/*
Example usage:
get('my_key', function(result) {
  console.log("value is: ");
  console.log(result);
});
*/
function get(key, callback) {
  chrome.storage.local.get([key], callback);
}

function del(key, callback) {
  chrome.storage.local.remove([key], callback)
}

const SECONDS_IN_HOUR = 60 * 60;
const EMPTY = {};
const SESSION_CONTINUE_MS = 5 * 60 * 1000;

// chrome.storage keys
const OUR_APP_ANALYTICS_DATA = 'our_appname_analytics_data';
const OUR_APP_DISTRACTED_KEY = "our_appname_distracted_for";
const OUR_APP_BLACKLIST_KEY = "our_appname_blacklist_key";
const OUR_APP_LIMITS_KEY = "our_appname_limits_key";

function addToBlackList(domain, callback) {
  getBlackList(function(blacklist) {
    if (!blacklist.includes(domain)) {
      blacklist.push(domain);
    }
    save(OUR_APP_BLACKLIST_KEY, blacklist, callback);
  });
}

function removeFromBlackList(domain, callback) {
  getBlackList(function(blacklist) {
    idx = blacklist.indexOf(domain);
    if (idx != -1) {
      blacklist.splice(idx, 1);
      save(OUR_APP_BLACKLIST_KEY, blacklist, callback);
    } else {
      callback(blacklist);
    }
  });
}

function getBlackList(callback) {
  get(OUR_APP_BLACKLIST_KEY, function(blacklist) {
    console.log("blacklist from storage:");
    console.log(blacklist);
    if (!blacklist || !blacklist[OUR_APP_BLACKLIST_KEY]) {
      console.log("blacklist not found in storage");
      callback([]);
    } else {
      callback(blacklist[OUR_APP_BLACKLIST_KEY]);
    }
  });
}

function isInBlackList(domain, callback) {
  getBlackList(function(blacklist) {
    callback(blacklist.includes(domain));
  });
}

function addLimit(domain, minutes, singleSession, callback) {
  getLimits(function(limits) {
    if (singleSession) {
      domain = OUR_APP_SINGLE_SESSION_PREFIX + domain;
    }
    limits[domain] = minutes;
    save(OUR_APP_LIMITS_KEY, limits, callback);
  });
}

function removeLimit(domain, singleSession, callback) {
  getLimits(function(limits) {
    if (singleSession) {
      domain = OUR_APP_SINGLE_SESSION_PREFIX + domain;
    }
    if (domain in limits) {
      delete limits[domain];
      save(OUR_APP_LIMITS_KEY, limits, callback);
    } else {
      callback(limits);
    }
  });
}

function getLimit(domain, singleSession, callback) {
  getLimits(function(limits) {
    if (singleSession) {
      domain = OUR_APP_SINGLE_SESSION_PREFIX + domain;
    }
    if (domain in limits) {
      console.log("found limit for " + domain);
      callback(limits[domain]);
    } else {
      console.log("no limit for " + domain);
      callback(NO_LIMIT);
    }
  });
}

function getLimits(callback) {
  get(OUR_APP_LIMITS_KEY, function(limits) {
    console.log("limits from storage:");
    console.log(limits);
    if (!limits || !limits[OUR_APP_LIMITS_KEY]) {
      console.log("limits not found in storage");
      callback({});
    } else {
      callback(limits[OUR_APP_LIMITS_KEY]);
    }
  });
}

function distractedFor(callback) {
  var d = new Date().getTime();
  getDistractedInternal(function(distracted) {
    console.log(distracted);
    if (d > distracted.timestamp + SESSION_CONTINUE_MS) {
      distracted.elapsed = 0
    }
    distracted.elapsed += DISTRACTED_UPDATE_SECONDS;
    distracted.timestamp = d;
    save(OUR_APP_DISTRACTED_KEY, distracted, function(distracted) {
      callback(distracted.elapsed);
    });
  });
}

/**
 * @param callback seconds: number -> anything
 */
function getDistracted(callback) {
  getDistractedInternal(function(distracted) {
    callback(distracted.elapsed);
  });
}

function getAnalytics(callback) {
  get(OUR_APP_ANALYTICS_DATA, function(data) {
    console.log("analytics from storage:");
    console.log(data);
    if (!data || !data[OUR_APP_ANALYTICS_DATA]) {
      console.log("analytics not found in storage");
      callback({});
    } else {
      callback(data[OUR_APP_ANALYTICS_DATA]);
    }
  });
}

function getNestedMap(map, keys, def = function() {return {};}) {
  var temp = map;
  for (k in keys) {
    key = keys[k];
    if (!(key in temp)) {
      temp[key] = def();
    }
    temp = temp[key];
  }
  return temp;
}

function newEntry(year, month, day, hour, site, seconds, callback) {
  getAnalytics(function(data) {
    hourMap = getNestedMap(data, [year, month, day, hour]);
    hourMap[site] = Math.min(SECONDS_IN_HOUR, (hourMap[site] || 0) + seconds);
    save(OUR_APP_ANALYTICS_DATA, data, callback);
  });
  // TODO make newEntry faster
  // this is trying to save just the updated key
  // save({[KDATA]: {[year]: {[month]: {[day]: {[hour]: [site]}}}}}, hourMap[site]);
}

function exceedsDailyLimit(year, month, day, hour, domain, callback) {
  getAnalytics(function(data) {
    function compareLimit(limit) {
      if (limit != NO_LIMIT && m[domain] > limit * 60) {
        callback(domain);
      }
    }
    m = getNestedMap(data, [year, month, day, hour]);
    if (domain in m) {
      getLimit(domain, false, compareLimit);
    }
  });
}

// "private" functions
function getDistractedInternal(callback) {
  get(OUR_APP_DISTRACTED_KEY, function(distracted) {
    console.log("from storage:");
    console.log(distracted);
    if (!distracted || !distracted[OUR_APP_DISTRACTED_KEY] ||
        !distracted[OUR_APP_DISTRACTED_KEY].timestamp ||
        !distracted[OUR_APP_DISTRACTED_KEY].elapsed) {
      console.log("distracted not found in storage");
      callback({timestamp: 0, elapsed: 0});
    } else {
      callback(distracted[OUR_APP_DISTRACTED_KEY]);
    }
  });
}
