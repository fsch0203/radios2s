chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.windows.create({
      url: chrome.runtime.getURL("index.html"),
      type: "popup",
      left: 5000,
      top: 50,
      width: 450,
      height: 700
    }, function(win) {
      // win represents the Window object from windows API
      // Do something after opening
    });
  });