const K_DATA = 'our_appname_data';
const SECONDS_IN_HOUR = 60 * 60;

/*
Example usage:
save('my_key', {ellen: "is a potatoe"});
*/
function save(key, val, func = printS(key, val)) {
  console.log("saving");
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
  chrome.storage.local.remove([key], youtube)
}

const SESSION_CONTINUE_MS = 5 * 60 * 1000;
const DISTRACTED_KEY = "our_appname_distracted_for";

function addToBlackList(domain, callback) {

}

function removeFromBlackList(domain, callback) {

}

function getBlackList(callback) {

}

function isInBlackList(domain, callback) {

}

function addLimit(domain, minutes, callback) {

}

function removeLimit(domain, callback) {

}

function getLimit(domain, callback) {
  
}

function getLimits(callback) {
  
}

function distractedFor() {
  var d = new Date().getTime();
  if (d > distracted.timestamp + SESSION_CONTINUE_MS) {
    distracted.elapsed = 0
  }
  distracted.elapsed += DISTRACTED_UPDATE_SECONDS;
  distracted.timestamp = d;
  save(DISTRACTED_KEY, distracted);
}

function getDistracted(callback) {
  if (distracted.timestamp == 0) {
    get(DISTRACTED_KEY, function(value) {
      distracted = value;
      callback(distracted.elapsed);
    })
  } else {
    callback(distracted.elapsed);
  }
}

/*
  K_DATA: {
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
*/

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
  cur_data[year][month][day][hour][site] =
      Math.min(SECONDS_IN_HOUR,
          (cur_data[year][month][day][hour][site] || 0) + seconds);
  // save({[KDATA]: {[year]: {[month]: {[day]: {[hour]: [site]}}}}}, cur_data[year][month][day][hour][site]);
  save(K_DATA, cur_data, function() {
    get();
  });
}