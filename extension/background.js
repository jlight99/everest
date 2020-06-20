chrome.runtime.onInstalled.addListener(function () {
  chrome.tabs.onUpdated.addListener(function () {
    chrome.tabs.query({ active: true }, tabs => {
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
        chrome.alarms.create("myAlarm", { delayInMinutes: 0, periodInMinutes: 0.2 });
        chrome.alarms.onAlarm.addListener(function () {
          alert("why are you distracted smh");
        });
      }
    });
  });
});

function updateStorage() {
  save();
}

function great() {
  console.log("hi");
  console.log(getDistracted());
}

distractedFor(5, great);
distractedFor(20, great);
distractedFor(5, great);
distractedFor(20, great);



// updateStorage();
// newEntry(2012, 5, 30, 12, "youtube.com", 1263);