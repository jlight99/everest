OUR_APP_BLACKLIST_KEY = "our_appname_blacklist_key";
chrome.storage.local.get(OUR_APP_BLACKLIST_KEY, function(blacklist) {
  if (!blacklist || !blacklist[OUR_APP_BLACKLIST_KEY]) {
    blacklist = ['facebook', 'youtube', 'fanfiction'];
    chrome.storage.local.set({[OUR_APP_BLACKLIST_KEY]: blacklist}, function() {
      console.log('initialized empty blacklist!');
    });
  } else {
    blacklist = blacklist[OUR_APP_BLACKLIST_KEY];
  }
  var blacklistElement = document.getElementById('blacklist');
  for (var i = 0; i < blacklist.length; i++) {
    var item = blacklist[i];
    var li = document.createElement('li');
    li.appendChild(document.createTextNode(item));
    blacklistElement.appendChild(li);
  }
});
