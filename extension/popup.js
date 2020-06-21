let openGraphs = document.getElementById('openGraphs');

openGraphs.addEventListener("click", function(element) {
  chrome.tabs.create({url: chrome.extension.getURL('graphs.html')});
});

let openSettings = document.getElementById('openSettings');

openSettings.addEventListener("click", function(element) {
  chrome.tabs.create({url: chrome.extension.getURL('settings.html')});
});
