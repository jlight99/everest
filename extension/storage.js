// public api

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

const K_DATA = 'our_appname_data';
const SECONDS_IN_HOUR = 60 * 60;
const EMPTY = {};
const SESSION_CONTINUE_MS = 5 * 60 * 1000;
const OUR_APP_DISTRACTED_KEY = "our_appname_distracted_for";
const OUR_APP_BLACKLIST_KEY = "our_appname_blacklist_key";
const OUR_APP_LIMITS_KEY = "our_appname_limits_key";

function addToBlackList(domain, callback) {
  getBlackList(function(blacklist) {
    if (!blacklist.includes(domain)) {
      blacklist.push(domain);
    }
    save(OUR_APP_BLACKLIST_KEY, blacklist, domain);
  });
}

function removeFromBlackList(domain, callback) {
  getBlackList(function(blacklist) {
    idx = blacklist.indexOf(domain);
    if (idx != -1) {
      blacklist = blacklist.splice(idx, 1);
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

function addLimit(domain, minutes, callback) {
  getLimits(function(limits) {
    limits[domain] = minutes;
    save(OUR_APP_LIMITS_KEY, limits, callback);
  });
}

function removeLimit(domain, callback) {
  getLimits(function(limits) {
    if (domain in limits) {
      delete limits[domain];
      save(OUR_APP_LIMITS_KEY, limits, callback);
    } else {
      callback(limits);
    }
  });
}

function getLimit(domain, callback) {
  getLimits(function(limits) {
    if (domain in limits) {
      callback(limits[domain]);
    } else {
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
    save(OUR_APP_DISTRACTED_KEY, distracted, callback);
  });
}

function getDistracted(callback) {
  getDistractedInternal(function(distracted) {
    callback(distracted.elapsed);
  });
}

var cur_data = {
  "2019": {
    "12": {
      "31": {
        "23": {
          "facebook.com": 59
        }
      }
    }
  }
}

function printS(key, val) {
  function printInternal() {
    print("Set " + key + " to: ");
    print(val)
  }
  return printInternal;
}

function newEntry(year, month, day, hour, site, seconds) {
  // FIX: default init prob
  cur_data[year][month][day][hour][site] =
      Math.min(SECONDS_IN_HOUR,
          (cur_data[year][month][day][hour][site] || 0) + seconds);
  // save({[KDATA]: {[year]: {[month]: {[day]: {[hour]: [site]}}}}}, cur_data[year][month][day][hour][site]);
  save(K_DATA, cur_data, function() {
    get();
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