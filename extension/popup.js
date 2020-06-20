let changeColour = document.getElementById('changeColour');

chrome.storage.sync.get('color', function(data) {
  changeColour.style.backgroundColor = data.color;
  changeColour.setAttribute('value', data.color);
});

changeColour.onclick = function(element) {
  alert('clicked');
  let colour = element.target.value;
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
      tabs[0].id,
      {code: 'document.body.style.backgroundColor = "' + colour + '";'});
  });
};
