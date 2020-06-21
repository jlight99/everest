google.charts.load('current', {'packages':['bar']});
google.charts.setOnLoadCallback(todayHourTimeStacked);

function drawChart(data, options) {
  var chart = new google.charts.Bar(document.getElementById('the_big_boi'));
  chart.draw(data, google.charts.Bar.convertOptions(options));
}

data = [];

// data: map<year, map<month, map<day, map<hour, map<site, seconds>>>>>

function getBlacklist(callback) {
  var blacklistKey = "our_appname_blacklist_key";
  chrome.storage.local.get(blacklistKey, function(blacklist) {
    if (!blacklist || !blacklist[blacklistKey]) {
      blacklist = ['facebook', 'youtube', 'reddit'];
      chrome.storage.local.set({[blacklistKey]: blacklist}, function() {
        console.log('initialized empty blacklist!');
        callback(blacklist);
      });
    } else {
      blacklist = blacklist[blacklistKey];
      callback(blacklist);
    }
  });
}

function getTodayData(callback) {
  var date = new Date();
  getAnalytics(function(data) {
    console.log("boo");
    console.log(data);
    callback(data[date.getFullYear()][date.getMonth()][date.getDate()]);
  });
}

function getTodayAppData(callback) {
  var todayAppData = {};
  var todayAppTimes = {};
  getTodayData(function(data) { // expected data format: {hour: [site: seconds, site2: seconds]}
    todayAppData = mapTodayDataToAppData(data);
    todayAppTimes = getTodayAppTimeData(data);
    getTodayProductiveTimesData(data, function(todayProductiveTimes) {
      callback(todayAppData, todayAppTimes, todayProductiveTimes);
    });
  });
}

function mapTodayDataToAppData(data) {
  var todayAppData = {}; // by hours, by site, by min
  for (var i = 0; i < 24; i++) {
    todayAppData[i] = {};
  }
  for (const [hour, siteTimes] of Object.entries(data)) {
    for (const [site, time] of Object.entries(siteTimes)) {
      if (site in todayAppData[hour]) {
        todayAppData[hour][site] += time;
      } else {
        todayAppData[hour][site] = time;
      }
    }
  }
  return todayAppData;
}

function getTodayAppTimeData(data) {
  var appTimes = {};
  for (const [hour, siteTimes] of Object.entries(data)) {
    for (const [site, time] of Object.entries(siteTimes)) {
      if (site in appTimes) {
        appTimes[site] += time;
      } else {
        appTimes[site] = time;
      }
    }
  }
  return appTimes;
}

function getTodayProductiveTimesData(data, callback) {
  getBlacklist(function(blacklist) {
    var todayAppData = []; // by hours, by site, by min
    var hours = ['12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', 
                '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', 
                '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', 
                '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'];
    for (var i = 0; i < 24; i++) {
      todayAppData[i] = [hours[i], 0, 0];
    }

    for (const [hour, siteTimes] of Object.entries(data)) {
      for (const [site, time] of Object.entries(siteTimes)) {
        if (blacklist.includes(site)) {
          todayAppData[hour][2] += time;
        } else {
          todayAppData[hour][1] = time;
        }
      }
    }
    todayAppData.unshift(['App', 'Minutes (productive)', "Minutes (unproductive)"]);
    callback(todayAppData);
  });
}

function getAppTimeArrayFromMap(data) {
  var arr = [];
  arr[0] = ['App', 'Time (minutes)'];
  var idx = 1;
  for (const [site, time] of Object.entries(data)) {
    arr[idx] = [site, time / 60];
    idx++;
  }
  return arr;
}

function getAppTimeData() {
  getTodayAppData(function(todayAppData, todayAppTimes, todayProductiveAppTimes) {
    getAppTimeArrayFromMap(todayAppTimes);
  });
}

function todayAppTime() {
  getTodayAppData(function(data1, data2, data3) {
    var arrData = getAppTimeArrayFromMap(data2);
    var data = google.visualization.arrayToDataTable(arrData);
    var options = {
      chart: {
        title: "Today's app usage",
      },
      legend: { position: 'none' },
      series: {
        0: { axis: 'time' }
      },
      axes: {
        y: {
          time: {label: 'Time (minutes)'},
        }
      }
    };
    drawChart(data, options);
  });
}

function todayHourTime(stacked = false) {
  getTodayAppData(function(data1, data2, data3) {
    var data = google.visualization.arrayToDataTable(data3);
    var options = {
      chart: {
        title: "Today's hourly usage",
      },
      isStacked: stacked
    };
    drawChart(data, options);
  });
}

function todayHourTimeStacked() {
  todayHourTime(true);
}

document.addEventListener('DOMContentLoaded', function() {
  var link = document.getElementById('todayAppTime');
  link.addEventListener('click', function() {
    todayAppTime();
  });
});

document.addEventListener('DOMContentLoaded', function() {
  var link = document.getElementById('todayHourTime');
  link.addEventListener('click', function() {
    todayHourTime();
  });
});

document.addEventListener('DOMContentLoaded', function() {
  var link = document.getElementById('todayHourTimeStacked');
  link.addEventListener('click', function() {
    todayHourTimeStacked();
  });
});

document.addEventListener('DOMContentLoaded', function() {
  console.log("yassss");
  getTodayAppData(function(data1, data2, data3) {
    console.log("yassss");
    console.log(data1);
    console.log(data2);
    console.log(data3);
  });
  // var link = document.getElementById('refreshData');
  // link.addEventListener('click', function() {
  //   getTodayAppData(function(data1, data2, data3) {
  //     console.log("yassss");
  //     console.log(data1);
  //     console.log(data2);
  //     console.log(data3);
  //   });
  // });
});
