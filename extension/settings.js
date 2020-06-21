var blacklistKey = "our_appname_blacklist_key";
var domainImgs = {
  'facebook': 'images/facebook.svg',
  'youtube': 'images/youtube.svg',
  'reddit': 'images/reddit.svg',
  'instagram': 'images/instagram.svg',
  'twitter': 'images/twitter.svg',
  'default': 'images/get_started32.png'
};
getBlackList(function(blacklist) {
  if (!blacklist) {
    blacklist = ['facebook', 'youtube', 'reddit'];
    console.log('blacklist not found!');
  }
  var blacklistElement = document.getElementById('blacklist');
  for (var i = 0; i < blacklist.length; i++) {
    var item = blacklist[i];

    var li = document.createElement('li');
    li.className = "list-group-item";

    var img = document.createElement('img');
    img.src = getImgSrc(item);
    img.classList.add('site-list-icon');

    li.appendChild(img);
    li.appendChild(document.createTextNode(item));
    li.appendChild(getTrashButton());
    blacklistElement.appendChild(li);
  }
});

function getTrashButton() {
  var trashBtn = document.createElement('button');
  var trashIcon = document.createElement('img');
  trashIcon.src = 'images/trash.svg';
  trashIcon.classList.add('trash-icon');
  trashBtn.appendChild(trashIcon);
  trashBtn.type = "button";
  trashBtn.classList.add('btn');
  trashBtn.classList.add('btn-link');

  var blacklistElement = document.getElementById('blacklist');
  trashBtn.addEventListener("click", function(evt) {
    removeFromBlackList(evt.srcElement.offsetParent.childNodes[1].data, function() {
      blacklistElement.removeChild(evt.srcElement.offsetParent);
    });
  });
  return trashBtn;
}

function getImgSrc(domain) {
  for (const [site, img] of Object.entries(domainImgs)) {
    if (domain.includes(site)) {
      return img;
    }
  }
  return domainImgs['default'];
}

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

    var img = document.createElement('img');
    img.src = getImgSrc(addDomainField.value);
    img.classList.add('site-list-icon');

    li.appendChild(img);
    li.appendChild(document.createTextNode(addDomainField.value));
    var trashBtn = getTrashButton();

    li.appendChild(trashBtn);
    document.getElementById('blacklist').appendChild(li);
    addDomainField.value = '';
  });
});

var cancelAddDomainBtn = document.getElementById('cancel-add-domain');
cancelAddDomainBtn.addEventListener("click", function() {
  addToBlacklistForm.classList.add('hidden');
  addToBlacklistBtn.classList.remove('hidden');
});
