const toggle = document.querySelector('#toggle');
const logo = document.querySelector('#logo');
const info = document.querySelector('#location');
const hidden = document.querySelector('#hidden');
const rippleEffect = document.querySelectorAll('[ripple]');
const reload = document.querySelector('[reload]');

const debounceClick = 3000;
let debounceClickTimer;

reload.addEventListener('click', () => {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
  });
});
rippleEffect.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    let x, y;
    x = e.clientX - btn.offsetLeft;
    y = e.clientY - btn.offsetTop;
    const innerRipple = document.createElement('div');
    innerRipple.setAttribute('rel', '')
    innerRipple.classList.add('ripple');
    innerRipple.style.top = y + 'px';
    innerRipple.style.left = x + 'px';
    btn.appendChild(innerRipple);
  });
  btn.addEventListener('mouseup', () => {
    clearTimeout(debounceClickTimer);
    debounceClickTimer = setTimeout(() => {
      const ripple = document.querySelectorAll('[rel]');
      for (let i = 0; i < ripple.length; i++) {
        ripple[i].remove();
      }
    }, debounceClick);
    console.log('up');
  });
  btn.addEventListener('mousedown', () => {
    clearTimeout(debounceClickTimer);
  })
})


function blockFbAds() {
  let intervalId = null;
  chrome.storage.sync.get('fbBlockAdsState', ({ fbBlockAdsState }) => {
    if (fbBlockAdsState === 'yes') {
      const adv = document.querySelector('.gqgwhnc0.g2fypklz.pmk7jnqg');
      const subscriber = document.querySelector('.j83agx80.rgmg9uty');
      intervalId = setInterval(() => {
        if (adv) {
          adv.remove();
          subscriber.remove();
        }
      }, 3000)
    } else {
      clearInterval(intervalId)
    }
  })
}

function hiddenActionInAppbar() {
  const actionBar = document.querySelector('.ehxjyohh.kr520xx4');
  const liveBanner = document.querySelector('.j83agx80.rgmg9uty');
  chrome.storage.sync.get('hiddenLeftActionInAppbar', ({ hiddenLeftActionInAppbar }) => {
    if (hiddenLeftActionInAppbar === 'yes') {
      actionBar.style.display = 'none';
      liveBanner.style.display = 'none';
    } else {
      actionBar.style.display = 'block';
      liveBanner.style.display = 'block';
    }
  })
}

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
    } else {
      blockFbAds();
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
    } else {
      hiddenActionInAppbar();
    }
    isHidden = hiddenLeftActionInAppbar === 'yes';
    if(isHidden) {
      checkToggleBtnStatus({state: true, btnToken: logo, text: {token: hidden, content: 'Đang ẩn.'}});
    } else {
      checkToggleBtnStatus({state: false, btnToken: logo, text: {token: hidden, content: 'Không hiện.'}});
    }
  });

})();

toggle.addEventListener("click", () => {
  isBlock = !isBlock;
  if(isBlock) {
    chrome.storage.sync.set({ fbBlockAdsState: 'yes' });
    checkToggleBtnStatus({state: true, btnToken: toggle, text: {token: info, content: 'Đang chặn.'}});
    blockFbAds();
  } else {
    chrome.storage.sync.set({ fbBlockAdsState: 'no' });
    checkToggleBtnStatus({state: false, btnToken: toggle, text: {token: info, content: 'Không chặn.'}});
  }
});

logo.addEventListener("click", () => {
  isHidden = !isHidden;
  if(isHidden) {
    chrome.storage.sync.set({ hiddenLeftActionInAppbar: 'yes' });
    checkToggleBtnStatus({state: true, btnToken: logo, text: {token: hidden, content: 'Đang ẩn.'}});
    hiddenActionInAppbar();
  } else {
    chrome.storage.sync.set({ hiddenLeftActionInAppbar: 'no' });
    checkToggleBtnStatus({state: false, btnToken: logo, text: {token: hidden, content: 'Không hiện.'}});
  }
});

