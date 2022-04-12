const toggle = document.querySelector('#toggle');
let isBlock = true;
toggle.addEventListener("click",  () => {
  isBlock = !isBlock;
  if(isBlock) {
    toggle.classList.add(['active'])
  } else {
    toggle.classList.remove(['active'])
  }
});