function ourAppUpdate(tabs) {
  console.log("hi");
  console.log(tabs);
  if (!tabs || !tabs.length) return;
  let domain = tabs[0].url; // TODO parse url nicely into domain
  console.log(domain);

  function createNotification(props) {
    function formatMessage() {
      let notif_domain = props.domain;
      if (notif_domain == DISTRACTED_DOMAIN) {
        notif_domain = "distrating websites";
      }
      return 'you have exceeded your limit of ' + props.limit + ' minutes for ' + notif_domain;
    }
    if (!props || !props.domain || !props.limit || !props.type) return;

    var opt = {
      iconUrl: "images/get_started48.png",
      type: 'basic',
      title: 'stop being distracted!',
      message: formatMessage(),
      priority: 1,
      requireInteraction: true // cool :P
    };
    chrome.notifications.create('notify1', opt, function() {
        console.log("notify1 failed, last error: ", chrome.runtime.lastError); 
      });
  }

  function alarmListener() {
    console.log("calling browsing");
    browsing(domain, createNotification);
  }

  function createAlarm() {
    // TODO replace alarm before publishing since alarms only fire once a minute in prod chrome
    // ref: https://developer.chrome.com/apps/app_codelab_alarms
    chrome.alarms.clearAll();
    if (chrome.alarms.onAlarm.hasListener(alarmListener)) {
      chrome.alarms.onAlarm.removeListener(alarmListener);
    }
    chrome.alarms.create("myAlarm", { delayInMinutes: 0, periodInMinutes: DISTRACTED_UPDATE_SECONDS / 60 });
    chrome.alarms.onAlarm.addListener(alarmListener);
  }
  createAlarm();
}

chrome.runtime.onInstalled.addListener(function () {
  // chrome.tabs.onUpdated.addListener(function () {
  //   chrome.tabs.query({ active: true, currentWindow: true, status: 'complete' }, tabs => ourAppUpdate(tabs));
  // });
  chrome.tabs.onActivated.addListener(function () {
    chrome.tabs.query({ active: true, currentWindow: true, status: 'complete' }, tabs => ourAppUpdate(tabs));
  });
});

console.log("let's get started");

/**
 * Testing background updating
 */
// addToBlackList("https://www.facebook.com/", function() {
//   addToBlackList("https://www.google.ca/", function() {
//     getBlackList(function(bl) {
//       console.log(bl);
//     });
//   });
// });
// 


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
// addLimit("https://www.facebook.com/", 100, true, function(v) {
//   addLimit("https://www.facebook.com/", 200, false, function(v) {
//     addLimit(DISTRACTED_DOMAIN, 1, false, function(v) {
//       getLimits(function(limits) {
//         console.log("add x3 limits:");
//         console.log(limits);
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

/**
 * Testing app overall limit
 */

// newEntry(2012, 5, 30, 12, "youtube.com", 1263, function(data) {
//   newEntry(2020, 12, 2, 17, "facebook.com", 500, function() {
//     addLimit("facebook.com", 2, false, function() {
//       exceedsDailyLimit(2020, 12, 2, 17, "facebook.com", function(domain) {
//         console.log("exceeds limit?");
//         console.log(domain);
//       });
//     });
//   });
// });
