OUR_APP_BLACKLIST_KEY = "our_appname_blacklist_key";
getBlackList(function(blacklist) {
  if (!blacklist) {
    blacklist = ['facebook', 'youtube', 'fanfiction'];
    console.log('blacklist not found!');
  } else {
    blacklist = blacklist[blacklistKey];
  }
  var blacklistElement = document.getElementById('blacklist');
  for (var i = 0; i < blacklist.length; i++) {
    var item = blacklist[i];
    var li = document.createElement('li');
    li.appendChild(document.createTextNode(item));
    blacklistElement.appendChild(li);
  }
});
