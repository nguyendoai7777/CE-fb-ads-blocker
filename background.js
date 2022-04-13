chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  let [tab1] = await chrome.tabs.query({ active: true, currentWindow: true })
  chrome.scripting.executeScript({
    target: { tabId: tab1.id },
    files: ['./feature.js']
    // func: blockFbAds
  });
});
