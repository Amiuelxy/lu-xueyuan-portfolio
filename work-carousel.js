(() => {
 'use strict';
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const groups=window.workCategories,stage=document.getElementById('work-stage');if(!stage)return;
 let group='commercial',index=0;
 try{const saved=JSON.parse(sessionStorage.getItem('portfolio-work-position'));if(saved&&groups.some(g=>g.id===saved.group)){group=saved.group;index=Number.isInteger(saved.index)?saved.index:0;}}catch{}
 const items=()=>window.portfolio.projects.filter(p=>p.workGroup===group);
 function render(){const list=items(),g=groups.find(g=>g.id===group);index=Math.max(0,Math.min(index,list.length-1));const p=list[index];
  document.querySelectorAll('[data-work-group]').forEach(tab=>{const on=tab.dataset.workGroup===group;tab.classList.toggle('active',on);tab.setAttribute('aria-selected',String(on));tab.tabIndex=on?0:-1;tab.querySelector('.work-group-count').textContent=String(window.portfolio.projects.filter(p=>p.workGroup===tab.dataset.workGroup).length);});
  stage.setAttribute('aria-labelledby','work-tab-'+group);document.getElementById('work-category-caption').textContent=g.description;
  const cover=p.coverType==='audit'?`<div class="audit-preview"><span class="audit-document-label">企业服务 · 脱敏工作材料</span><h4>采购与合同异常核验</h4><div><span>核验环节</span><span>具体工作</span></div><div><strong>凭证号拆解</strong><span>从合同文本提取采购凭证</span></div><div><strong>跨表匹配</strong><span>区分部分匹配与未匹配</span></div><div><strong>重复行处理</strong><span>按凭证抬头层级核对</span></div><p>保留工作步骤，隐去客户与业务数据</p></div>`:`<img src="assets/${esc(p.image)}" alt="${esc(p.alt)}" decoding="async">`;
  stage.innerHTML=`<article class="work-slide"><a class="work-media ${esc(p.imageClass||'screen')} ${p.coverType==='audit'?'audit-cover':''}" href="detail.html?id=${esc(p.detail)}" aria-label="查看${esc(p.title)}详情">${cover}<span class="work-media-label">${esc(p.mediaLabel||'真实作品与过程记录')}</span></a><div class="work-copy"><p class="work-meta">${esc(p.tag)}</p><h3 id="work-slide-title"><a href="detail.html?id=${esc(p.detail)}">${esc(p.title)}</a></h3><p class="work-description">${esc(p.intro)}</p><p class="work-time">${esc(p.time)}</p><div class="work-actions"><a class="button" href="detail.html?id=${esc(p.detail)}">${esc(p.button)}</a>${p.publishedUrl?`<a class="text-link published-reviews-link" href="${esc(p.publishedUrl)}" target="_blank" rel="noopener noreferrer">全部已发布测评</a>`:''}</div></div></article>`;
  document.getElementById('work-prev').disabled=index===0;document.getElementById('work-next').disabled=index===list.length-1;
  document.getElementById('work-page-counter').textContent=String(index+1).padStart(2,'0')+' / '+String(list.length).padStart(2,'0');
  document.getElementById('work-dots').innerHTML=list.map((p,i)=>`<button class="work-dot ${i===index?'active':''}" data-work-page="${i}" aria-label="查看第${i+1}项：${esc(p.title)}" ${i===index?'aria-current="true"':''}><span></span></button>`).join('');
  document.getElementById('work-live-status').textContent=g.label+'，第'+(index+1)+'项，共'+list.length+'项：'+p.title;
  try{sessionStorage.setItem('portfolio-work-position',JSON.stringify({group,index}));}catch{}
 }
 const move=n=>{const next=index+n;if(next>=0&&next<items().length){index=next;render();}};
 const select=id=>{group=id;index=0;render();};
 document.querySelectorAll('[data-work-group]').forEach(tab=>{tab.addEventListener('click',()=>select(tab.dataset.workGroup));tab.addEventListener('keydown',e=>{const tabs=[...document.querySelectorAll('[data-work-group]')],pos=tabs.indexOf(tab);let target;if(e.key==='ArrowRight')target=tabs[(pos+1)%tabs.length];if(e.key==='ArrowLeft')target=tabs[(pos+tabs.length-1)%tabs.length];if(e.key==='Home')target=tabs[0];if(e.key==='End')target=tabs[tabs.length-1];if(target){e.preventDefault();target.focus();select(target.dataset.workGroup);}});});
 document.getElementById('work-prev').addEventListener('click',()=>move(-1));document.getElementById('work-next').addEventListener('click',()=>move(1));
 document.getElementById('work-dots').addEventListener('click',e=>{const b=e.target.closest('[data-work-page]');if(b){index=Number(b.dataset.workPage);render();}});
 document.querySelector('.work-carousel').addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();move(e.key==='ArrowLeft'?-1:1);}});
 let start=null,suppressClickUntil=0;
 stage.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')start={x:e.clientX,y:e.clientY};});
 stage.addEventListener('pointercancel',()=>{start=null;});stage.addEventListener('pointerup',e=>{if(!start)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;start=null;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.35){suppressClickUntil=Date.now()+500;move(dx<0?1:-1);}});
 stage.addEventListener('click',e=>{if(Date.now()<suppressClickUntil){e.preventDefault();e.stopPropagation();}},true);
 render();
})();
