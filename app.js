const toggle = document.querySelector('#toggle');
const logo = document.querySelector('#logo');
const info = document.querySelector('#location');
const hidden = document.querySelector('#hidden');
const rippleEffect = document.querySelectorAll('[ripple]');
const reload = document.querySelector('[reload]');
const mainTab = document.querySelector('#checkIsFacebook');
const falseTab = document.querySelector('#falseTab');
const header = document.querySelector('.header');
const body = document.querySelector('.body');
const debounceClick = 3000;
let debounceClickTimer;

let chromeCurrentTabId;

(async function () {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const isFacebook = tab.url.includes('facebook.com');
  if(isFacebook) {
    mainTab.style.display = 'block';
    header.style.backgroundColor = '#0054db';
    falseTab.style.display = 'none';
    body.style.borderColor = '#0054db';
  } else {
    mainTab.style.display = 'none';
    header.style.backgroundColor = '#7b7b7b';
    falseTab.style.display = 'block';
    body.style.borderColor = '#7b7b7b';
  }

  chromeCurrentTabId = tab.id;
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['./feature.js']
  });
  chrome.storage.sync.get("fbBlockAdsState", ({ fbBlockAdsState }) => {
    if(!fbBlockAdsState) {
      chrome.storage.sync.set({ fbBlockAdsState: 'yes' });
    } else {
      hostBlockFbAds();
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
      hostHiddenActionInAppbar();
    }
    isHidden = hiddenLeftActionInAppbar === 'yes';
    if(isHidden) {
      checkToggleBtnStatus({state: true, btnToken: logo, text: {token: hidden, content: 'Đang ẩn.'}});
    } else {
      checkToggleBtnStatus({state: false, btnToken: logo, text: {token: hidden, content: 'Không hiện.'}});
    }
  });

})();

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

function hostBlockFbAds() {
  let intervalId = null;
  chrome.storage.sync.get('fbBlockAdsState', ({ fbBlockAdsState }) => {
    if (fbBlockAdsState === 'yes') {
      const adv = document.querySelector('.gqgwhnc0.g2fypklz.pmk7jnqg.mio9le5o');
      const subscriber = document.querySelector('.j83agx80.rgmg9uty');
      intervalId = setInterval(() => {
        if (adv) {
          adv.remove();
          subscriber.remove();
        }
      }, 3000)
    } else {
      clearInterval(intervalId);
    }
  });

}

function hostHiddenActionInAppbar() {
  const actionBar = document.querySelector('.ehxjyohh.kr520xx4.j9ispegn.poy2od1o.dhix69tm.byvelhso.buofh1pr.j83agx80.rq0escxv.bp9cbjyn');
  const liveBanner = document.querySelector('.j83agx80.rgmg9uty.pmk7jnqg.rnx8an3s.fcg2cn6m');
  chrome.storage.sync.get('hiddenLeftActionInAppbar', async ({ hiddenLeftActionInAppbar }) => {
    if (hiddenLeftActionInAppbar === 'yes') {
      if(actionBar) {
        actionBar.classList.add('e-hidden');
        actionBar.classList.remove('e-show');
      }
      if(liveBanner) {
        liveBanner.classList.add('e-hidden');
        liveBanner.classList.remove('e-show');
      }
    } else {
      if(actionBar) {
        actionBar.classList.remove('e-hidden');
        actionBar.classList.add('e-show');
      }
      if(liveBanner) {
        liveBanner.classList.remove('e-hidden');
        liveBanner.classList.add('e-show');
      }
    }
  });
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

toggle.addEventListener("click", () => {
  isBlock = !isBlock;
  if(isBlock) {
    chrome.storage.sync.set({ fbBlockAdsState: 'yes' });
    checkToggleBtnStatus({state: true, btnToken: toggle, text: {token: info, content: 'Đang chặn.'}});

  } else {
    chrome.storage.sync.set({ fbBlockAdsState: 'no' });
    checkToggleBtnStatus({state: false, btnToken: toggle, text: {token: info, content: 'Không chặn.'}});
  }
  chrome.scripting.executeScript({
    target: { tabId: chromeCurrentTabId },
    function: hostBlockFbAds,
  });
});

logo.addEventListener("click", () => {
  isHidden = !isHidden;
  if(isHidden) {
    chrome.storage.sync.set({ hiddenLeftActionInAppbar: 'yes' });
    checkToggleBtnStatus({state: true, btnToken: logo, text: {token: hidden, content: 'Đang ẩn.'}});
  } else {
    chrome.storage.sync.set({ hiddenLeftActionInAppbar: 'no' });
    checkToggleBtnStatus({state: false, btnToken: logo, text: {token: hidden, content: 'Không hiện.'}});
  }
  chrome.scripting.executeScript({
    target: { tabId: chromeCurrentTabId },
    function: hostHiddenActionInAppbar,
  });
});


