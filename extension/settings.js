var blacklistKey = "our_appname_blacklist_key";
getBlackList(function(blacklist) {
  if (!blacklist) {
    blacklist = ['facebook', 'youtube', 'fanfiction'];
    console.log('blacklist not found!');
  }
  var blacklistElement = document.getElementById('blacklist');
  for (var i = 0; i < blacklist.length; i++) {
    var item = blacklist[i];
    var li = document.createElement('li');
    li.className = "list-group-item";
    li.appendChild(document.createTextNode(item));
    blacklistElement.appendChild(li);
  }
});

var addToBlacklistForm = document.getElementById('add-input');

var addDomainField = document.getElementById('add-domain-field');

var addToBlacklistBtn = document.getElementById('add-to-blacklist');
addToBlacklistBtn.addEventListener("click", function() {
  addToBlacklistForm.classList.remove('hidden');
  addToBlacklistBtn.classList.add('hidden');
});

var submitAddDomainBtn = document.getElementById('submit-add-domain');
submitAddDomainBtn.addEventListener("click", function(evt) {
  addToBlacklistForm.classList.add('hidden');
  addToBlacklistBtn.classList.remove('hidden');
  addToBlackList(addDomainField.value, function() {
    var li = document.createElement('li');
    li.className = "list-group-item";
    li.appendChild(document.createTextNode(addDomainField.value));
    document.getElementById('blacklist').appendChild(li);
  });
});

var cancelAddDomainBtn = document.getElementById('cancel-add-domain');
cancelAddDomainBtn.addEventListener("click", function() {
  addToBlacklistForm.classList.add('hidden');
  addToBlacklistBtn.classList.remove('hidden');
});
