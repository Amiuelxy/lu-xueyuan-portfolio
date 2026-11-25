(() => {
 'use strict';
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 document.querySelectorAll('.certificate-wall').forEach(wall=>{
  const section=wall.closest('.case-section'),toggle=section.querySelector('.wall-motion'),progress=section.querySelector('.wall-progress span');
  let playing=!reduced.matches,visible=false,hover=false,drag=null,dragged=false,pauseUntil=0,direction=1,last=0,position=wall.scrollLeft;
  const setPlay=value=>{playing=value;toggle.setAttribute('aria-pressed',String(value));toggle.textContent=value?'暂停滚动':'自动滚动';toggle.setAttribute('aria-label',value?'暂停奖状自动滚动':'开始奖状自动滚动');};setPlay(playing);
  toggle.addEventListener('click',()=>setPlay(!playing));
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;},{threshold:.2}).observe(wall);
  const interact=()=>{pauseUntil=performance.now()+2500;position=wall.scrollLeft;};
  wall.addEventListener('pointerenter',()=>hover=true);wall.addEventListener('pointerleave',()=>hover=false);
  wall.addEventListener('scroll',()=>{const max=wall.scrollWidth-wall.clientWidth;if(progress)progress.style.left=(max?wall.scrollLeft/max*75:0)+'%';},{passive:true});
  wall.addEventListener('wheel',e=>{const delta=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;const max=wall.scrollWidth-wall.clientWidth;if((delta>0&&wall.scrollLeft<max-1)||(delta<0&&wall.scrollLeft>1)){e.preventDefault();wall.scrollLeft+=delta;interact();}},{passive:false});
  wall.addEventListener('pointerdown',e=>{interact();if(e.pointerType!=='mouse'||e.button!==0)return;drag={x:e.clientX,left:wall.scrollLeft,id:e.pointerId};dragged=false;});
  window.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;const dx=e.clientX-drag.x;if(Math.abs(dx)>7){dragged=true;wall.classList.add('dragging');wall.setPointerCapture(e.pointerId);wall.scrollLeft=drag.left-dx;interact();}});
  const release=()=>{if(!drag)return;drag=null;wall.classList.remove('dragging');interact();setTimeout(()=>dragged=false,0);};window.addEventListener('pointerup',release);wall.addEventListener('pointercancel',release);
  wall.addEventListener('click',e=>{if(dragged){e.preventDefault();e.stopImmediatePropagation();}},{capture:true});
  wall.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const max=wall.scrollWidth-wall.clientWidth;wall.scrollBy({left:e.key==='Home'?-max:e.key==='End'?max:e.key==='ArrowRight'?280:-280,behavior:reduced.matches?'instant':'smooth'});interact();}});
  section.querySelectorAll('[data-wall-step],[data-wall-filter]').forEach(b=>b.addEventListener('click',()=>{interact();direction=1;}));
  reduced.addEventListener('change',e=>{if(e.matches)setPlay(false);});
  function tick(now){const dt=Math.min(40,last?now-last:0);last=now;const max=wall.scrollWidth-wall.clientWidth;
   if(playing&&visible&&!document.hidden&&!hover&&!drag&&!wall.contains(document.activeElement)&&!document.querySelector('dialog[open]')&&now>pauseUntil&&max>0){position+=direction*dt*.024;if(position>=max){position=max;direction=-1;}if(position<=0){position=0;direction=1;}wall.scrollLeft=position;}else position=wall.scrollLeft;
   requestAnimationFrame(tick);
  }requestAnimationFrame(tick);
 });
})();
