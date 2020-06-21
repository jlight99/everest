chrome.runtime.onInstalled.addListener(function () {
  chrome.tabs.onUpdated.addListener(function () {
    chrome.tabs.query({ active: true, currentWindow: true, status: 'complete' }, tabs => {
      if (tabs.length == 0) return;
      let url = tabs[0].url;
      let blacklist = ['facebook', 'youtube'];
      let isBlacklisted = false;
      for (var i = 0; i < blacklist.length; i++) {
        if (url.includes(blacklist[i])) {
          isBlacklisted = true;
          break;
        }
      }
      if (isBlacklisted) {
        // chrome.alarms.create("myAlarm", { delayInMinutes: 0, periodInMinutes: 0.3 });
        // chrome.alarms.onAlarm.addListener(function () {
        //   alert("why are you distracted smh");
        // });
        var opt = {
          iconUrl: "images/get_started48.png",
          type: 'basic',
          title: 'stop being distracted!',
          message: 'smh get back to work',
          priority: 1,
          requireInteraction: true
        };
        chrome.notifications.create('notify1', opt, function() { console.log("Last error:", chrome.runtime.lastError); });

        // chrome.tabs.executeScript({
        //   file: "insert.js"
        // });
      } else {
        chrome.alarms.clearAll();
      }
    });
  });
});


/**
 * Testing distracted time
 */
// function great() {
//   console.log("great");
//   getDistracted(function(value) {
//     console.log("got:");
//     console.log(value);
//   })
// }
// // chrome.storage.local.clear();
// distractedFor(function() {
//   console.log("done saving");
// });
// setTimeout(distractedFor, 5000);
// distractedFor();
// distractedFor();
// great();


/**
 * Testing limits
 */
// getLimits(function(limits) {
//   console.log("limits:");
//   console.log(limits);
// });
// addLimit("instagram.com", 60, function(v) {
//   addLimit("twitter.com", 60, function(v) {
//     addLimit("bimesh.dev", 15, function(v) {
//       getLimits(function(limits) {
//         console.log("add x3 limits:");
//         console.log(limits);
//         removeLimit("instagram.com", function() {
//           getLimits(function(limits) {
//             console.log("add x3, r x1 limits:");
//             console.log(limits);
//           });
//           getLimit("bimesh.dev", function(limit) {
//             console.log("bimesh limit:");
//             console.log(limit);
//           });
//         });
//       });
//     });
//   });
// });

/**
 * Testing blacklist
 */
// getBlackList(function(bl) {
//   console.log("blacklist:");
//   console.log(bl);
// });
// addToBlackList("instagram.com", function(v) {
//   addToBlackList("twitter.com", function(v) {
//     addToBlackList("bimesh.dev", function(v) {
//       isInBlackList("bimesh.dev", function(t) {
//         console.log("bimesh in blacklist:");
//         console.log(t);
//       });
//       getBlackList(function(bl) {
//         console.log("add x3 blacklist:");
//         console.log(bl);
//         removeFromBlackList("instagram.com", function() {
//           getBlackList(function(bl) {
//             console.log("add x3, r x1 limits:");
//             console.log(bl);
//           });
//           isInBlackList("instagram.com", function(t) {
//             console.log("instagram in blacklist:");
//             console.log(t);
//           });
//         });
//       });
//     });
//   });
// });

/**
 * Testing analytics
 */

// newEntry(2012, 5, 30, 12, "youtube.com", 1263, function(data) {
//   console.log("put");
//   console.log(data);
//   getAnalytics(function(data) {
//     console.log("get");
//     console.log(data);
//   });
//   newEntry(2020, 12, 2, 17, "youtube.com", 5, function() {
//     getAnalytics(function(data) {
//       console.log(data);
//     });
//     newEntry(2020, 12, 2, 17, "feacbook.com", 5, function() {
//       getAnalytics(function(data) {
//         console.log(data);
//       });
//       newEntry(2020, 12, 2, 17, "feacbook.com", 5, function() {
//         getAnalytics(function(data) {
//           console.log(data);
//         });
//       });
//     });
//   });
// });
