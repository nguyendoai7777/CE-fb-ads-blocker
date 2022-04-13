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
chrome.storage.sync.get('hiddenLeftActionInAppbar', ({ hiddenLeftActionInAppbar }) => {
  if (!hiddenLeftActionInAppbar) {
    chrome.storage.sync.set({ hiddenLeftActionInAppbar: 'yes' })
  } else {
    hiddenLeftActionInAppbar();
  }
});
chrome.storage.sync.get('fbBlockAdsState', ({ fbBlockAdsState }) => {
  if (!fbBlockAdsState) {
    chrome.storage.sync.set({ fbBlockAdsState: 'yes' })
  } else {
    blockFbAds();
  }
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

function hiddenLeftActionInAppbar() {
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
function main() {
  
  chrome.storage.sync.get('hiddenLeftActionInAppbar', ({ hiddenLeftActionInAppbar }) => {
    if (hiddenLeftActionInAppbar === 'yes') {
      hiddenLeftActionInAppbar();
    }
  });
  chrome.storage.sync.get('fbBlockAdsState', ({ fbBlockAdsState }) => {
    if (fbBlockAdsState === 'yes') {
      blockFbAds();
    }
  });
}

main();