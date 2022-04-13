const toggle = document.querySelector('#toggle');
const logo = document.querySelector('#logo');
const info = document.querySelector('#location');
const hidden = document.querySelector('#hidden');



let isBlock;
let isHidden;
function checkToggleBtnStatus({state, btnToken, text = {token, content}}) {
  if(state) {
    btnToken.classList.add('active');
    text.token.textContent = text.content;
    text.token.style.color = 'var(--btn-toggle-color)';
  } else {
    btnToken.classList.remove('active');
    text.token.textContent = text.content;
    text.token.style.color = 'var(--danger-text)';
  }
}

(async function () {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['./feature.js']
  });
  chrome.storage.sync.get("fbBlockAdsState", ({ fbBlockAdsState }) => {
    if(!fbBlockAdsState) {
      chrome.storage.sync.set({ fbBlockAdsState: 'yes' });
    }
    isBlock = fbBlockAdsState === 'yes';
    if(isBlock) {
      checkToggleBtnStatus({state: true, btnToken: toggle, text: {token: info, content: 'Đang chặn.'}});
    } else {
      checkToggleBtnStatus({state: false, btnToken: toggle, text: {token: info, content: 'Không chặn.'}});
    }
  });
  chrome.storage.sync.get("hiddenLeftActionInAppbar", ({ hiddenLeftActionInAppbar }) => {
    if(!hiddenLeftActionInAppbar) {
      chrome.storage.sync.set({ hiddenLeftActionInAppbar: 'yes' });
    }
    isHidden = hiddenLeftActionInAppbar === 'yes';
    if(isHidden) {
      checkToggleBtnStatus({state: true, btnToken: logo, text: {token: hidden, content: 'Đang ẩn.'}});
    } else {
      checkToggleBtnStatus({state: false, btnToken: logo, text: {token: hidden, content: 'Không hiện.'}});
    }
  });

})();

logo.addEventListener("click", () => {
  isHidden = !isHidden;
  if(isBlisHiddenock) {
    chrome.storage.sync.set({ hiddenLeftActionInAppbar: 'yes' });
    checkToggleBtnStatus({state: true, btnToken: logo, text: {token: hidden, content: 'Đang ẩn.'}});
  } else {
    chrome.storage.sync.set({ hiddenLeftActionInAppbar: 'no' });
    checkToggleBtnStatus({state: false, btnToken: logo, text: {token: hidden, content: 'Không hiện.'}});
  }
});

toggle.addEventListener("click", () => {
  isBlock = !isBlock;
  if(isBlock) {
    chrome.storage.sync.set({ fbBlockAdsState: 'yes' });
    checkToggleBtnStatus({state: true, btnToken: toggle, text: {token: info, content: 'Đang chặn.'}});
  } else {
    chrome.storage.sync.set({ fbBlockAdsState: 'no' });
    checkToggleBtnStatus({state: false, btnToken: toggle, text: {token: info, content: 'Không chặn.'}});
  }
});
