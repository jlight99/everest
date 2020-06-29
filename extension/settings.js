var defaultLimits = {
  'default_limit': 2,
}
var domainImgs = {
  'facebook': 'images/facebook.svg',
  'youtube': 'images/youtube.svg',
  'reddit': 'images/reddit.svg',
  'instagram': 'images/instagram.svg',
  'twitter': 'images/twitter.svg',
  'default': 'images/get_started32.png'
};
console.log("getting limits!");

getLimits(function(limits) {
  console.log(limits);
  // if (Object.keys(limits).length === 0 && limits.constructor === Object) {
  //   limits = defaultLimits;
  // }

  getBlackList(function(blacklist) {
    // if (!blacklist) {
    //   blacklist = ['facebook', 'youtube', 'reddit'];
    //   console.log('blacklist not found!');
    // }
    var blacklistElement = document.getElementById('blacklist');
    for (var i = 0; i < blacklist.length; i++) {
      var item = blacklist[i];
  
      var li = document.createElement('li');
      li.className = "list-group-item";
  
      var img = document.createElement('img');
      img.src = getImgSrc(item);
      img.classList.add('site-list-icon');
  
      var domainSpan = document.createElement('div');
      domainSpan.classList.add('list-item-domain-text');
      domainSpan.appendChild(document.createTextNode(item));

      var limitSpan = document.createElement('div');
      // limitSpan.contentEditable = true;
      limitSpan.classList.add('list-item-limit-text');
      limitSpan.appendChild(document.createTextNode(getLimit(limits, item)));
  
      li.appendChild(img);
      li.appendChild(domainSpan);
      li.appendChild(limitSpan);
      li.appendChild(getTrashButton());
      li.appendChild(getEditButton());
      blacklistElement.appendChild(li);
    }
  });
});

function getLimit(limits, domain) {
  if (limits[domain]) {
    return limits[domain] + ' min';
  }
  return 'None';
}

function getEditButton() {
  var editBtn = document.createElement('button');
  var editIcon = document.createElement('img');
  editIcon.src = 'images/edit.svg';
  editIcon.classList.add('edit-icon');
  editBtn.appendChild(editIcon);
  editBtn.type = "button";
  editBtn.classList.add('btn');
  editBtn.classList.add('btn-link');

  editBtn.addEventListener("click", function(evt) {
    // removeFromBlackList(evt.srcElement.offsetParent.childNodes[1].data, function() {
    //   blacklistElement.removeChild(evt.srcElement.offsetParent);
    // });
    console.log("who clicked the edit button");
    console.log(evt.srcElement.offsetParent);
    console.log(evt.srcElement.offsetParent.childNodes[2]);
    evt.srcElement.offsetParent.childNodes[2].contentEditable = true;
    evt.srcElement.offsetParent.childNodes[2].classList.add('editable');
  });
  return editBtn;
}

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
var addDomainLimit = document.getElementById('add-domain-limit');

var addToBlacklistBtn = document.getElementById('add-to-blacklist');
addToBlacklistBtn.addEventListener("click", function() {
  addToBlacklistForm.classList.remove('hidden');
  addToBlacklistBtn.classList.add('hidden');
});

var submitAddDomainBtn = document.getElementById('submit-add-domain');
submitAddDomainBtn.addEventListener("click", function(evt) {
  addToBlacklistForm.classList.add('hidden');
  addToBlacklistBtn.classList.remove('hidden');
  const curDomain = document.getElementById('add-domain-field').value;
  const curLimit = document.getElementById('add-domain-limit').value;
  getLimits(function(limits) {
    console.log(limits);
    addToBlackList(addDomainField.value, function() {
      var blacklistElement = document.getElementById('blacklist');

      var li = document.createElement('li');
      li.className = "list-group-item";

      var img = document.createElement('img');
      img.src = getImgSrc(curDomain);
      img.classList.add('site-list-icon');

      var domainSpan = document.createElement('div');
      domainSpan.classList.add('list-item-domain-text');
      domainSpan.appendChild(document.createTextNode(curDomain));

      var limitSpan = document.createElement('div');
      // limitSpan.contentEditable = true;
      limitSpan.classList.add('list-item-limit-text');
      limitSpan.appendChild(document.createTextNode(curLimit + ' min'));

      li.appendChild(img);
      li.appendChild(domainSpan);
      li.appendChild(limitSpan);
      li.appendChild(getTrashButton());
      li.appendChild(getEditButton());
      blacklistElement.appendChild(li);
      addDomainField.value = '';
    });
    addLimit(addDomainField.value, addDomainLimit.value, false, function() {
      console.log("Added limit of %d minutes to %s", curLimit, curDomain);
    });
  });
});

var cancelAddDomainBtn = document.getElementById('cancel-add-domain');
cancelAddDomainBtn.addEventListener("click", function() {
  addToBlacklistForm.classList.add('hidden');
  addToBlacklistBtn.classList.remove('hidden');
});
