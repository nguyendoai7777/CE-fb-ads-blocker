const toggle = document.querySelector('#toggle');
let getItem = localStorage['fbBlockAdsState'] || 'yes';
let isBlock;
(function () {
  isBlock = getItem === 'yes';
  if(isBlock) {
    toggle.classList.add('active');
  } else {
    toggle.classList.remove('active');
  }
})()
toggle.addEventListener("click",  () => {
  let clear;
  isBlock = !isBlock;
  if(isBlock) {
    localStorage.setItem('fbBlockAdsState', 'yes');
    toggle.classList.add('active');
    const adv = document.querySelector('.gqgwhnc0.g2fypklz.pmk7jnqg');
    clear = setInterval(() => {
      if(adv) {
        adv.remove();
      }
    }, 3000)
  } else {
    localStorage.setItem('fbBlockAdsState', 'no');
    toggle.classList.remove('active');
    clearInterval(clear);
  }
});
