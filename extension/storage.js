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
  chrome.storage.local.get([key], func);
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