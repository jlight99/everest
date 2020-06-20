chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({color: '#3aa757'}, function() {
    console.log("The colour is green.");
  });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {hostContains: 'youtube.com'},
        }),
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {hostContains: 'facebook.com'},
        }),
      ],
          actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
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