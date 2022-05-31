chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  const [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: currentTab.id },
    files: ['./feature.js']
  });
});
