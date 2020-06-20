google.charts.load('current', {'packages':['bar']});
google.charts.setOnLoadCallback(todayHourTimeStacked);

function drawChart(data, options) {
  var chart = new google.charts.Bar(document.getElementById('the_big_boi'));
  chart.draw(data, google.charts.Bar.convertOptions(options));
}

data = []

function todayAppTime() {
  var data = google.visualization.arrayToDataTable([
    ['App', 'Time (hours)'],
    ['Youtube', 1.5],
    ['Facebook', 0.75],
    ['Instagram', 2],
    ['Amazon', 0.5]
  ]);
  var options = {
    chart: {
      title: "Today's app usage",
      subtitle: "I'm a subtitle :)",
    },
    legend: { position: 'none' },
    series: {
      0: { axis: 'time' }
    },
    axes: {
      y: {
        time: {label: 'Time (hours)'},
      }
    }
  };
  drawChart(data, options);
}

function todayHourTime(stacked = false) {
  var data = google.visualization.arrayToDataTable([
    ['App', 'Minutes (productive)', "Minutes (unproductive)"],
    ['12 AM', 0, 15],
    ['1 AM', 0, 0],
    ['2 AM', 0, 0],
    ['3 AM', 0, 60],
    ['4 AM', 0, 15],
    ['5 AM', 0, 0],
    ['6 AM', 0, 0],
    ['7 AM', 30, 5],
    ['8 AM', 15, 0],
    ['9 AM', 60, 0],
    ['10 AM', 59, 0],
    ['11 AM', 50, 2],
    ['12 PM', 15, 30],
    ['1 PM', 5, 20],
    ['2 PM', 55, 1],
    ['3 PM', 60, 0],
    ['4 PM', 15, 20],
    ['5 PM', 0, 12],
    ['6 PM', 0, 5],
    ['7 PM', 30, 30],
    ['8 PM', 15, 32],
    ['9 PM', 60, 0],
    ['10 PM', 9, 17],
    ['11 PM', 50, 1]
  ]);
  var options = {
    chart: {
      title: "Today's hourly usage",
      subtitle: "I'm a subtitle :)",
    },
    isStacked: stacked
  };
  drawChart(data, options);
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
