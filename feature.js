(async function (){
    const styleSheet = `
      .e-hidden {
        display: none;
      }
      .e-show {
        
      }
    `;
    const cssLink = document.createElement('style');
    cssLink.setAttribute('contribution', 'dxd');
    cssLink.innerHTML = styleSheet;

    const url = location.href;
    const isFacebook = url.includes('facebook.com');
    if(isFacebook) {
        document.head.appendChild(cssLink);
        chrome.storage.sync.get('fbBlockAdsState', ({fbBlockAdsState}) => {
            if (!fbBlockAdsState) {
                chrome.storage.sync.set({fbBlockAdsState: 'yes'})
            } else {
                blockFbAds();
            }
        })

        chrome.storage.sync.get('hiddenLeftActionInAppbar', ({hiddenLeftActionInAppbar}) => {
            if (!hiddenLeftActionInAppbar) {
                chrome.storage.sync.set({hiddenLeftActionInAppbar: 'yes'})
            } else {
                hiddenActionInAppbar();
            }
        });

    }
})()




function blockFbAds() {
    let intervalId = null;
    chrome.storage.sync.get('fbBlockAdsState', ({fbBlockAdsState}) => {
        if (fbBlockAdsState === 'yes') {
            const adv = document.querySelector('.gqgwhnc0.g2fypklz.pmk7jnqg.mio9le5o');
            const ads = document.querySelector('.i09qtzwb.rq0escxv.n7fi1qx3.pmk7jnqg.j9ispegn.kr520xx4');

            const subscriber = document.querySelector('.j83agx80.rgmg9uty');
            intervalId = setInterval(() => {
                if (adv) {
                    adv.remove();
                    subscriber.remove();
                    ads.remove();
                }
            }, 3000)
        } else {
            clearInterval(intervalId);
        }
    });
}

function hiddenActionInAppbar() {
    const actionBar = document.querySelector('.ehxjyohh.kr520xx4.j9ispegn.poy2od1o.dhix69tm.byvelhso.buofh1pr.j83agx80.rq0escxv.bp9cbjyn');
    const liveBanner = document.querySelector('.j83agx80.rgmg9uty.pmk7jnqg.b12hlsfb.fgv6swy9');
    const liveBanner2 = document.querySelector('.j83agx80.rgmg9uty.pmk7jnqg.rnx8an3s.fcg2cn6m');
    chrome.storage.sync.get('hiddenLeftActionInAppbar', async ({hiddenLeftActionInAppbar}) => {
        if (hiddenLeftActionInAppbar === 'yes') {
            if(actionBar) {
                actionBar.classList.add('e-hidden');
                actionBar.classList.remove('e-show');
            }
            if(liveBanner) {
                liveBanner.classList.add('e-hidden');
                liveBanner.classList.remove('e-show');
            }
            if(liveBanner2) {
                liveBanner2.classList.add('e-hidden');
                liveBanner2.classList.remove('e-show');
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
            if(liveBanner2) {
                liveBanner2.classList.remove('e-hidden');
                liveBanner2.classList.add('e-show');
            }
        }
    });
}
