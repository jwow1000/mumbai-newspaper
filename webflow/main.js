(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))c(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const i of t.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&c(i)}).observe(document,{childList:!0,subtree:!0});function r(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function c(e){if(e.ep)return;e.ep=!0;const t=r(e);fetch(e.href,t)}})();function g(s,n){let r=0,c=0,e=!1;function t(o){if(e)return;let u={vertical:o.deltaY>0?"down":o.deltaY<0?"up":null,horizontal:o.deltaX>0?"right":o.deltaX<0?"left":null};(u.vertical||u.horizontal)&&(s(u),d())}function i(o){r=o.touches[0].clientX,c=o.touches[0].clientY}function f(o){if(e)return;const u=o.touches[0].clientX,y=o.touches[0].clientY,m=r-u,w=c-y;let l;Math.abs(m)>Math.abs(w)?l=m>0?"left":"right":l=w>0?"up":"down",s({vertical:l==="up"||l==="down"?l:null,horizontal:l==="left"||l==="right"?l:null}),d()}function d(){e=!0,setTimeout(()=>{e=!1},n)}return window.addEventListener("wheel",t,{passive:!0}),window.addEventListener("touchstart",i,{passive:!0}),window.addEventListener("touchmove",f,{passive:!0}),function(){window.removeEventListener("wheel",t),window.removeEventListener("touchstart",i),window.removeEventListener("touchmove",f)}}let h=0,a=0;function Y(s){const n=s.vertical,r=s.horizontal;n==="down"?(a+=10,a<0&&(a=100)):n==="up"&&(a-=10,a>100&&(a=0)),r==="left"?h+=-.1:r==="right"&&(h+=.1),v()}g(Y,1800);document.querySelector(".newspaper-articles-container");const p=document.querySelectorAll(".newspaper-article-item");console.log("newspaperItems",p);p.length;function v(){p.forEach((s,n)=>{s.style.opacity=1;const r=n%10/10;console.log("yAxis control: ",r);const c=Math.sin((r+h)*(Math.PI*2)),e=Math.cos((r+h)*(Math.PI*2)),t=c/2+.5,i=e/2+.5;let f=Math.floor(n/10)*10;const d=n%2,o=(a+f+d*4)%100;console.log("wtfff",o),s.style.transform=`
      translate( 
        ${t*300-100+50}%,
        ${o/100*2e3-200}%
      )
      scale(${i/2})
    `})}v();
