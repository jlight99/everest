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
        chrome.alarms.create("myAlarm", { delayInMinutes: 0, periodInMinutes: 0.2 });
        chrome.alarms.onAlarm.addListener(function () {
          alert("why are you distracted smh");
        });
      } else {
        chrome.alarms.clearAll();
      }
    });
  });
});
