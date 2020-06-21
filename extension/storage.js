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
  // console.log("saving");
  // console.log(key);
  // console.log(val);
  // console.log(func);
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

function browsing(domain, callback) {
  var d = new Date();
  function handleUpdate() {
    newEntry(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      d.getHours(),
      domain,
      DISTRACTED_UPDATE_SECONDS
    );
    addDistracted(domain, function() {
      isInBlackList(domain, function(bool) {
        console.log("domain");
        console.log(domain);
        if (bool) {
          addDistracted(DISTRACTED_DOMAIN);
          handleNotify();
        }
      });
    });
    // TODO add blacklist_total_time
  }
  function handleNotify() {
    function wrapper(val, func) {
      if (val) {
        callback(val);
      } else {
        func();
      }
    }
    console.log('exceedsDailyLimit');
    exceedsDailyLimit(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      d.getHours(),
      domain, function(val) {
        wrapper(val, function() {
          console.log('exceedsDistractedLimit ' + domain);
          exceedsDistractedLimit(domain, function(val) {
            wrapper(val, function() {
              console.log('exceedsDistractedLimit');
              exceedsDistractedLimit(DISTRACTED_DOMAIN, function(val) {
                if (val) {
                  callback(val);
                }
              });
            });
          });
        });
      });
      // tried so hard to make this aesthetic -_-
  }
  handleUpdate();
}

function isInBlackList(domain, callback) {
  getBlackList(function(blacklist) {
    for (var i = 0; i < blacklist.length; i++) {
      if (domain.includes(blacklist[i])) {
        callback(true);
        return;
      }
    }
    callback(false);
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

function addDistracted(domain, callback) {
  var d = new Date().getTime();
  getDistractedInternal(function(distractedMap) {
    console.log("addDistracted");
    console.log(distractedMap);
    distracted = distractedMap[domain];
    if (!distracted || !distracted.elapsed || !distracted.timestamp) {
      distracted = {timestamp: 0, elapsed: 0};
    }
    if (d > distracted.timestamp + SESSION_CONTINUE_MS) {
      distracted.elapsed = 0
    }
    distracted.elapsed += DISTRACTED_UPDATE_SECONDS;
    distracted.timestamp = d;
    distractedMap[domain] = distracted;

    save(OUR_APP_DISTRACTED_KEY, distractedMap, function() {
      if (callback) {
        callback(distracted.elapsed);
      }
    });
  });
}

/**
 * @param callback seconds: number -> anything
 */
function getDistracted(callback) {
  getDistractedInternal(callback);
}

/**
 * @param {*} callback only calls this IF the usage exceeds the limit
 */
function exceedsDistractedLimit(domain, callback) {
  getDistractedInternal(function(data) {
    console.log("mushroom");
    console.log(data);
    function compareLimit(limit) {
      if (data[domain].timestamp + SESSION_CONTINUE_MS >= new Date().getTime() &&
          limit != NO_LIMIT && 
          data[domain].elapsed > limit * 60) {
        callback({limit: limit, domain: domain, type: LIMIT_EXCEEDED_TYPE_CONTINUOUS});
      } else {
        callback(null);
      }
    }
    if (domain in data) {
      getLimit(domain, true, compareLimit);
    }
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
      console.log("domaindailylimit");
      console.log(domain);
      console.log(m[domain]);
      console.log(limit);
      if (limit != NO_LIMIT && m[domain] > limit * 60) {
        callback({limit: limit, domain: domain, type: LIMIT_EXCEEDED_TYPE_OVERALL});
      } else {
        callback(null);
      }
    }
    console.log("dailylimit -> domain_map");
    console.log(domain);
    m = getNestedMap(data, [year, month, day, hour]);
    console.log(m);
    if (domain in m) {
      getLimit(domain, false, compareLimit);
    } else {
      callback(null);
    }
  });
}

// "private" functions
function getDistractedInternal(callback) {
  get(OUR_APP_DISTRACTED_KEY, function(distracted) {
    console.log("from storage:");
    console.log(distracted);
    if (!distracted || !distracted[OUR_APP_DISTRACTED_KEY]) {
      console.log("distracted not found in storage");
      callback({});
    } else {
      callback(distracted[OUR_APP_DISTRACTED_KEY]);
    }
  });
}
