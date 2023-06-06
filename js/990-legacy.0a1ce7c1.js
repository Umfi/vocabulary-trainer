"use strict";(self["webpackChunkvocabulary_trainer"]=self["webpackChunkvocabulary_trainer"]||[]).push([[990],{8990:(e,t,r)=>{r.r(t),r.d(t,{createSwipeBackGesture:()=>i});var n=r(6587),a=r(545),c=r(6515);
/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
const i=(e,t,r,i,o)=>{const s=e.ownerDocument.defaultView,u=(0,a.i)(e),l=e=>{const t=50,{startX:r}=e;return u?r>=s.innerWidth-t:r<=t},h=e=>u?-e.deltaX:e.deltaX,d=e=>u?-e.velocityX:e.velocityX,b=e=>l(e)&&t(),k=e=>{const t=h(e),r=t/s.innerWidth;i(r)},v=e=>{const t=h(e),r=s.innerWidth,a=t/r,c=d(e),i=r/2,u=c>=0&&(c>.2||t>i),l=u?1-a:a,b=l*r;let k=0;if(b>5){const e=b/Math.abs(c);k=Math.min(e,540)}o(u,a<=0?.01:(0,n.h)(0,a,.9999),k)};return(0,c.createGesture)({el:e,gestureName:"goback-swipe",gesturePriority:40,threshold:10,canStart:b,onStart:r,onMove:k,onEnd:v})}}}]);
//# sourceMappingURL=990-legacy.0a1ce7c1.js.map