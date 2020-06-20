let openGraphs = document.getElementById('openGraphs');

openGraphs.onclick = function(element) {
  chrome.tabs.create({url: chrome.extension.getURL('graphs.html')});
}

let openSettings = document.getElementById('openSettings');

openSettings.onclick = function(element) {
  chrome.tabs.create({url: chrome.extension.getURL('settings.html')});
}
