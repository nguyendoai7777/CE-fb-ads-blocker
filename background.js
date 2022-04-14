chrome.storage.sync.get('hiddenLeftActionInAppbar', ({ hiddenLeftActionInAppbar }) => {
  console.log(hiddenLeftActionInAppbar);
})








chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  let [tab1] = await chrome.tabs.query({ active: true, currentWindow: true });
  console.log(tab1);
  chrome.scripting.executeScript({
    target: { tabId: tab1.id },
    files: ['./feature.js']
    // func: blockFbAds
  });
});
