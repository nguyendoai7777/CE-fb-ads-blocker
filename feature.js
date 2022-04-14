const styleSheet = `
  .e-hidden {
    display: none;
  }
  .e-show {
    display: block;
  }
`;
const cssLink = document.createElement('style');
cssLink.setAttribute('contribution', 'dxd');
cssLink.innerHTML = styleSheet;
document.head.appendChild(cssLink);


function setBlockAdsState({blockState, btnToken, infoToken}) {
  if(blockState) {
    btnToken.classList.add('active');
    infoToken.textContent = 'Đang chặn.';
    infoToken.style.color = 'var(--btn-toggle-color)';
  } else {
    btnToken.classList.remove('active');
    infoToken.textContent = 'Không chặn.';
    infoToken.style.color = 'var(--danger-text)';
  }
}

chrome.storage.sync.get('fbBlockAdsState', ({ fbBlockAdsState }) => {
  if (!fbBlockAdsState) {
    chrome.storage.sync.set({ fbBlockAdsState: 'yes' })
  } else {
    blockFbAds();
  }
})

chrome.storage.sync.get('hiddenLeftActionInAppbar', ({ hiddenLeftActionInAppbar }) => {
  if (!hiddenLeftActionInAppbar) {
    chrome.storage.sync.set({ hiddenLeftActionInAppbar: 'yes' })
  } else {
    hiddenActionInAppbar();
  }
});


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
  });
}

function hiddenActionInAppbar() {
  const actionBar = document.querySelector('.ehxjyohh.kr520xx4.j9ispegn.poy2od1o.dhix69tm.byvelhso.buofh1pr.j83agx80.rq0escxv.bp9cbjyn');
  const liveBanner = document.querySelector('.j83agx80.rgmg9uty');
  chrome.storage.sync.get('hiddenLeftActionInAppbar', async ({ hiddenLeftActionInAppbar }) => {
    if (hiddenLeftActionInAppbar === 'yes') {
      console.log('vao day', actionBar);
      actionBar.classList.add('e-hidden');
      actionBar.classList.remove('e-show');
      // actionBar.style.display = 'none';
    } else {
      console.log('hoac else');
      actionBar.classList.remove('e-hidden');
      actionBar.classList.add('e-show');
    }
  });
}
