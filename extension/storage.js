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
  chrome.storage.local.set({ [key]: val }, func);
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

const K_DATA = 'our_appname_data';
const SECONDS_IN_HOUR = 60 * 60;
const EMPTY = {};
const SESSION_CONTINUE_MS = 5 * 60 * 1000;
const OUR_APP_ANALYTICS_DATA = 'our_appname_analytics_data';
const OUR_APP_DISTRACTED_KEY = "our_appname_distracted_for";
const OUR_APP_BLACKLIST_KEY = "our_appname_blacklist_key";
const OUR_APP_LIMITS_KEY = "our_appname_limits_key";
const DISTRACTED_DOMAIN = "distracted";

function addToBlackList(domain, callback) {
  getBlackList(function (blacklist) {
    if (!blacklist.includes(domain)) {
      blacklist.push(domain);
    }
    save(OUR_APP_BLACKLIST_KEY, blacklist, callback);
  });
}

function removeFromBlackList(domain, callback) {
  getBlackList(function (blacklist) {
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
  get(OUR_APP_BLACKLIST_KEY, function (blacklist) {
    console.log("blacklist from storage:");
    console.log(blacklist);
    if (!blacklist || !blacklist[OUR_APP_BLACKLIST_KEY]) {
      console.log("blacklist not found in storage");
      // callback([]);
      callback(['youtube', 'facebook', 'fanfiction']);
    } else {
      callback(blacklist[OUR_APP_BLACKLIST_KEY]);
    }
  });
}

function isInBlackList(domain, callback) {
  getBlackList(function (blacklist) {
    // alert('got blacklist');
    // alert(blacklist);
    // alert(domain.substring(OUR_APP_SINGLE_SESSION_PREFIX.length));
    callback(blacklist.includes(domain) || blacklist.includes(domain.substring(OUR_APP_SINGLE_SESSION_PREFIX.length)));
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
      callback(limits[domain]);
    } else {
      isInBlackList(domain, function (isBlacklisted) {
        if (isBlacklisted) {
          callback(DEFAULT_BLACKLIST_LIMIT_SECONDS);
        } else {
          callback(NO_LIMIT);
        }
      });
    }
  });
}

function getLimits(callback) {
  get(OUR_APP_LIMITS_KEY, function (limits) {
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

// function newEntry(year, month, day, hour, site, seconds) {
function browsing(domain, callback) {
  var d = new Date();
  newEntry(
    d.getFullYear(),
    d.getMonth(),
    d.getDay(),
    d.getHours(),
    domain,
    DISTRACTED_UPDATE_SECONDS,
    function () {
      distractedFor(domain, function () {
        callback("yay!");
      });
    }
  );
}

// the amount of time a user has spent in a single session on the domain (domain could be individual app or being distracted in general)
function distractedFor(domain, callback) {
  var d = new Date().getTime();
  getDistractedInternal(domain, function (distractedMap) {
    let distracted = {timestamp: 0, elapsed: 0};
    if (distractedMap && distractedMap[OUR_APP_DISTRACTED_KEY]) {
      distracted = distractedMap[OUR_APP_DISTRACTED_KEY][domain];
    } else {
      distractedMap = {[OUR_APP_DISTRACTED_KEY]: {}};
    }
    console.log(distractedMap);
    if (d > distracted.timestamp + SESSION_CONTINUE_MS) {
      distracted.elapsed = 0;
    }
    distracted.elapsed += DISTRACTED_UPDATE_SECONDS;
    distracted.timestamp = d;
    distractedMap[OUR_APP_DISTRACTED_KEY][domain] = distracted;
    console.log('hello');
    save(OUR_APP_DISTRACTED_KEY, distractedMap, function (distractedMap) {
      isInBlackList(domain, function (isBlacklisted) {
        if (isBlacklisted) {
          domain = DISTRACTED_DOMAIN;
          getDistractedInternal(domain, function (distractedMap2) {
            let distracted = {timestamp: 0, elapsed: 0};
            if (distractedMap2 && distractedMap2[OUR_APP_DISTRACTED_KEY]) {
              distracted = distractedMap2[OUR_APP_DISTRACTED_KEY][domain];
            } else {
              distractedMap2 = {[OUR_APP_DISTRACTED_KEY]: {}};
            }
            console.log(distractedMap2);
            if (d > distracted.timestamp + SESSION_CONTINUE_MS) {
              distracted.elapsed = 0;
            }
            distracted.elapsed += DISTRACTED_UPDATE_SECONDS;
            distracted.timestamp = d;
            distractedMap2[OUR_APP_DISTRACTED_KEY][domain] = distracted;
            save(OUR_APP_DISTRACTED_KEY, distractedMap2, function (distractedMap2) {
              if (!distractedMap2) {
                // TODO
                callback(0);
              } else {
                if (distractedMap2[OUR_APP_DISTRACTED_KEY] && distractedMap[OUR_APP_DISTRACTED_KEY][domain]) {
                  callback(distractedMap[OUR_APP_DISTRACTED_KEY][domain].elapsed);
                } else {
                  callback(0);
                }
              }
            });
          });
        } else {
          callback(0);
        }
      });
    });
  });
}

/**
 * @param callback seconds: number -> anything
 */
function getDistracted(domain, callback) {
  getDistractedInternal(domain, function (distracted) {
    console.log('hello1');
    console.log(distracted);
    if (distracted && distracted[OUR_APP_DISTRACTED_KEY] && distracted[OUR_APP_DISTRACTED_KEY][DISTRACTED_DOMAIN]) {
      callback(distracted[OUR_APP_DISTRACTED_KEY][DISTRACTED_DOMAIN].elapsed);
    } else {
      callback(0);
    }
  });
}

function getAnalytics(callback) {
  get(OUR_APP_ANALYTICS_DATA, function (data) {
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

function getNestedMap(map, keys, def = function () { return {}; }) {
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

// "private" functions
function getDistractedInternal(domain, callback) {
  get(OUR_APP_DISTRACTED_KEY, function (distractedMap) {
    console.log(distractedMap);
    let distracted = { timestamp: 0, elapsed: 0 };
    if (distractedMap && distractedMap[OUR_APP_DISTRACTED_KEY]) {
      distracted = distractedMap[OUR_APP_DISTRACTED_KEY][domain];
    } else {
      distractedMap = {[OUR_APP_DISTRACTED_KEY]: {}};
    }
    distractedMap[OUR_APP_DISTRACTED_KEY][domain] = distracted;
    console.log("from storage:");
    console.log(distracted);
    if (!distracted ||
      !distracted.timestamp ||
      !distracted.elapsed) {
      console.log("distracted not found in storage");
      callback({});
    } else {
      callback(distractedMap);
    }
  });
}

// get distracted time and limit for domain
function shouldNotify(domain, callback) {
  // 2 cases where we should notify
  // either app session time exceeds app limit
  // or distracted session time exceeds distracted limit
  getDistracted(domain, function (distractedTime) {
    console.log("got:");
    console.log(distractedTime);
    getLimit(domain, true, function (limit) {
      if (distractedTime > limit) {
        callback(domain, limit);
        return;
      }
      isInBlackList(domain, function (isBlacklisted) {
        if (isBlacklisted) {
          getDistracted(DISTRACTED_DOMAIN, function (distractedTime) {
            getLimit(DISTRACTED_DOMAIN, true, function (limit) {
              // alert('distractedTime');
              // alert(distractedTime);
              // alert('limit');
              // alert(limit);
              if (limit == Infinity) {
                limit = DEFAULT_BLACKLIST_LIMIT_SECONDS;
              }
              // alert('distractedTime');
              // alert(distractedTime);
              // alert('limit');
              // alert(limit);
              if (distractedTime > limit) {
                // alert('yup!');
                callback(DISTRACTED_DOMAIN, limit);
              } else {
                // alert('hmm');
                callback(null, null);
              }
            });
          });
        }
      });
    });
  });
}
