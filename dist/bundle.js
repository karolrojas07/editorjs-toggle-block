!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.Toggle=e():t.Toggle=e()}(self,(function(){return(()=>{var t={424:(t,e,s)=>{"use strict";s.d(e,{Z:()=>l});var i=s(81),o=s.n(i),r=s(645),n=s.n(r)()(o());n.push([t.id,".toggle-block__selector > div {\n  vertical-align: middle;\n  display: inline-block;\n  padding: 1% 0 1% 0;\n  outline: none;\n  border: none;\n  width: 90%;\n}\n\n.toggle-block__selector br {\n  display: none;\n}\n\n.toggle-block__icon > svg {\n  vertical-align: middle;\n  width: 15px;\n  height: auto;\n}\n\n.toggle-block__icon:hover {\n  color: #388ae5;\n  cursor: pointer;\n}\n\n.bi-play-fill {\n  width: 34px;\n  height: 34px;\n}\n\n.toggle-block__input {\n  margin-left: 5px;\n}\n\n.toggle-block__input:empty:before {\n  content: attr(placeholder);\n  position: absolute;\n  color: gray;\n  background-color: transparent;\n}\n\n.toggle-block__content-default {\n  margin-left: 20px;\n}\n\n.toggle-block__item {\n  margin-left: 39px;\n}\n\n.toggle-block__content-default {\n  color: gray;\n  border-radius: 5px;\n}\n\n.toggle-block__content-default:hover {\n  cursor: pointer;\n  background: rgba(55, 53, 47, 0.08);\n}\n\ndiv.toggle-block__hidden {\n  display: none;\n}\n",""]);const l=n},645:t=>{"use strict";t.exports=function(t){var e=[];return e.toString=function(){return this.map((function(e){var s="",i=void 0!==e[5];return e[4]&&(s+="@supports (".concat(e[4],") {")),e[2]&&(s+="@media ".concat(e[2]," {")),i&&(s+="@layer".concat(e[5].length>0?" ".concat(e[5]):""," {")),s+=t(e),i&&(s+="}"),e[2]&&(s+="}"),e[4]&&(s+="}"),s})).join("")},e.i=function(t,s,i,o,r){"string"==typeof t&&(t=[[null,t,void 0]]);var n={};if(i)for(var l=0;l<this.length;l++){var c=this[l][0];null!=c&&(n[c]=!0)}for(var a=0;a<t.length;a++){var d=[].concat(t[a]);i&&n[d[0]]||(void 0!==r&&(void 0===d[5]||(d[1]="@layer".concat(d[5].length>0?" ".concat(d[5]):""," {").concat(d[1],"}")),d[5]=r),s&&(d[2]?(d[1]="@media ".concat(d[2]," {").concat(d[1],"}"),d[2]=s):d[2]=s),o&&(d[4]?(d[1]="@supports (".concat(d[4],") {").concat(d[1],"}"),d[4]=o):d[4]="".concat(o)),e.push(d))}},e}},81:t=>{"use strict";t.exports=function(t){return t[1]}},379:t=>{"use strict";var e=[];function s(t){for(var s=-1,i=0;i<e.length;i++)if(e[i].identifier===t){s=i;break}return s}function i(t,i){for(var r={},n=[],l=0;l<t.length;l++){var c=t[l],a=i.base?c[0]+i.base:c[0],d=r[a]||0,h="".concat(a," ").concat(d);r[a]=d+1;var u=s(h),g={css:c[1],media:c[2],sourceMap:c[3],supports:c[4],layer:c[5]};if(-1!==u)e[u].references++,e[u].updater(g);else{var p=o(g,i);i.byIndex=l,e.splice(l,0,{identifier:h,updater:p,references:1})}n.push(h)}return n}function o(t,e){var s=e.domAPI(e);return s.update(t),function(e){if(e){if(e.css===t.css&&e.media===t.media&&e.sourceMap===t.sourceMap&&e.supports===t.supports&&e.layer===t.layer)return;s.update(t=e)}else s.remove()}}t.exports=function(t,o){var r=i(t=t||[],o=o||{});return function(t){t=t||[];for(var n=0;n<r.length;n++){var l=s(r[n]);e[l].references--}for(var c=i(t,o),a=0;a<r.length;a++){var d=s(r[a]);0===e[d].references&&(e[d].updater(),e.splice(d,1))}r=c}}},569:t=>{"use strict";var e={};t.exports=function(t,s){var i=function(t){if(void 0===e[t]){var s=document.querySelector(t);if(window.HTMLIFrameElement&&s instanceof window.HTMLIFrameElement)try{s=s.contentDocument.head}catch(t){s=null}e[t]=s}return e[t]}(t);if(!i)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");i.appendChild(s)}},216:t=>{"use strict";t.exports=function(t){var e=document.createElement("style");return t.setAttributes(e,t.attributes),t.insert(e,t.options),e}},565:(t,e,s)=>{"use strict";t.exports=function(t){var e=s.nc;e&&t.setAttribute("nonce",e)}},795:t=>{"use strict";t.exports=function(t){var e=t.insertStyleElement(t);return{update:function(s){!function(t,e,s){var i="";s.supports&&(i+="@supports (".concat(s.supports,") {")),s.media&&(i+="@media ".concat(s.media," {"));var o=void 0!==s.layer;o&&(i+="@layer".concat(s.layer.length>0?" ".concat(s.layer):""," {")),i+=s.css,o&&(i+="}"),s.media&&(i+="}"),s.supports&&(i+="}");var r=s.sourceMap;r&&"undefined"!=typeof btoa&&(i+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(r))))," */")),e.styleTagTransform(i,t,e.options)}(e,t,s)},remove:function(){!function(t){if(null===t.parentNode)return!1;t.parentNode.removeChild(t)}(e)}}}},589:t=>{"use strict";t.exports=function(t,e){if(e.styleSheet)e.styleSheet.cssText=t;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(t))}}},370:t=>{t.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path></svg>'}},e={};function s(i){var o=e[i];if(void 0!==o)return o.exports;var r=e[i]={id:i,exports:{}};return t[i](r,r.exports,s),r.exports}s.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return s.d(e,{a:e}),e},s.d=(t,e)=>{for(var i in e)s.o(e,i)&&!s.o(t,i)&&Object.defineProperty(t,i,{enumerable:!0,get:e[i]})},s.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e);var i={};return(()=>{"use strict";s.d(i,{default:()=>m});var t=s(379),e=s.n(t),o=s(795),r=s.n(o),n=s(569),l=s.n(n),c=s(565),a=s.n(c),d=s(216),h=s.n(d),u=s(589),g=s.n(u),p=s(424),f={};f.styleTagTransform=g(),f.setAttributes=a(),f.insert=l().bind(null,"head"),f.domAPI=r(),f.insertStyleElement=h(),e()(p.Z,f),p.Z&&p.Z.locals&&p.Z.locals;var b=s(370),k=s.n(b);class m{static get toolbox(){return{title:"Toggle",icon:k()}}static get enableLineBreaks(){return!0}static get isReadOnlySupported(){return!0}constructor({data:t,api:e,readOnly:s}){this.data={text:t.text||"",status:t.status||"open",fk:t.fk||`fk-${crypto.randomUUID()}`,items:t.items||0},this.itemsId=[],this.api=e,this.wrapper=void 0,this.readOnly=s||!1,this.addListeners(),this.addSupportForUndoAndRedoActions(),this.addSupportForDragAndDropActions()}createParagraphFromToggleRoot(t){if("Enter"===t.code){const t=document.getSelection().focusOffset,e=this.api.blocks.getCurrentBlockIndex(),s=this.api.blocks.getBlockByIndex(e),{holder:i}=s,o=i.firstChild.firstChild,r=o.children[1].innerHTML,n=r.indexOf("<br>"),l=-1===n?r.length:n;"closed"===this.data.status&&(this.resolveToggleAction(),this.hideAndShowBlocks());const c=r.slice(l+4,t.focusOffset);o.children[1].innerHTML=r.slice(t.focusOffset,l),this.api.blocks.insert("paragraph",{text:c},{},e+1,1),this.setAttributesToNewBlock()}}createParagraphFromIt(){this.setAttributesToNewBlock()}setAttributesToNewBlock(t=null,e=this.wrapper.id){const s=null===t?this.api.blocks.getCurrentBlockIndex():t,i=crypto.randomUUID(),o=this.api.blocks.getBlockByIndex(s);this.itemsId.includes(o.id)||this.itemsId.splice(s-1,0,o.id);const{holder:r}=o,n=r.firstChild.firstChild;r.setAttribute("foreignKey",e),r.setAttribute("id",i),r.classList.add("toggle-block__item"),this.readOnly||(r.onkeydown=this.setEventsToNestedBlock.bind(this),n.focus())}setEventsToNestedBlock(t){if("Enter"===t.code)this.createParagraphFromIt();else{const e=this.api.blocks.getCurrentBlockIndex(),s=this.api.blocks.getBlockByIndex(e),{holder:i}=s;if("Tab"===t.code&&t.shiftKey&&this.extractBlock(e),"Backspace"===t.code){const t=document.getSelection().focusOffset;this.removeBlock(i,s.id,t)}}}removeBlock(t,e,s){if(0===s){const s=t.nextSibling.firstChild.firstChild.innerHTML;t.firstChild.firstChild.children[1].innerHTML+=s;const i=this.itemsId.indexOf(e);this.itemsId.splice(i,1);const o=this.api.blocks.getCurrentBlockIndex();this.api.blocks.delete(o+1)}}removeAttributesFromNewBlock(t){const e=this.api.blocks.getBlockByIndex(t),{holder:s}=e;if(!this.itemsId.includes(e.id)){const t=this.itemsId.indexOf(e.id);this.itemsId.splice(t,1)}s.removeAttribute("foreignKey"),s.removeAttribute("id"),s.onkeydown={},s.onkeyup={},s.classList.remove("toggle-block__item")}createToggle(){this.wrapper=document.createElement("div"),this.wrapper.classList.add("toggle-block__selector"),this.wrapper.id=this.data.fk;const t=document.createElement("span"),e=document.createElement("div"),s=document.createElement("div");t.classList.add("toggle-block__icon"),t.innerHTML=k(),e.classList.add("toggle-block__input"),e.setAttribute("contentEditable",!this.readOnly),e.innerHTML=this.data.text||"",this.readOnly||(e.addEventListener("keyup",this.createParagraphFromToggleRoot.bind(this)),e.addEventListener("keydown",this.removeToggle.bind(this)),e.addEventListener("focusin",(()=>this.setFocusToggleRootAtTheEnd())),e.addEventListener("keyup",this.setPlaceHolder.bind(this)),e.setAttribute("placeholder","Toggle"),e.addEventListener("focus",this.setDefaultContent.bind(this)),e.addEventListener("focusout",this.setDefaultContent.bind(this)),s.addEventListener("click",this.clickInDefaultContent.bind(this)),e.addEventListener("focus",this.setNestedBlockAttributes.bind(this))),s.classList.add("toggle-block__content-default","toggle-block__hidden"),s.innerHTML="Empty toggle. Click or drop blocks inside.",this.wrapper.appendChild(t),this.wrapper.appendChild(e),this.wrapper.appendChild(s)}setFocusToggleRootAtTheEnd(){const t=document.activeElement,e=window.getSelection(),s=document.createRange();e.removeAllRanges(),s.selectNodeContents(t),s.collapse(!1),e.addRange(s),t.focus()}clickInDefaultContent(){this.api.blocks.insert(),this.setAttributesToNewBlock(),this.setDefaultContent()}setDefaultContent(){const t=document.querySelectorAll(`div[foreignKey="${this.wrapper.id}"]`),{firstChild:e,lastChild:s}=this.wrapper,{status:i}=this.data,o=t.length>0||"closed"===i;s.classList.toggle("toggle-block__hidden",o),e.style.color=0===t.length?"gray":"black"}removeToggle(t){if("Backspace"===t.code){const{children:t}=this.wrapper,e=t[1].innerHTML;if(0===document.getSelection().focusOffset){const t=this.api.blocks.getCurrentBlockIndex(),s=e.indexOf("<br>"),i=-1===s?e.length:s,o=document.querySelectorAll(`div[foreignKey="${this.wrapper.id}"]`);for(let e=1;e<o.length+1;e+=1)this.removeAttributesFromNewBlock(t+e);this.api.blocks.delete(t),this.api.blocks.insert("paragraph",{text:e.slice(0,i)},{},t,1),this.api.caret.setToBlock(t)}}}extractBlock(t){const e=this.wrapper.children[1];let s,i={};for(;i[1]!==e;){this.api.caret.setToPreviousBlock("end",0),s=this.api.blocks.getCurrentBlockIndex();const t=this.api.blocks.getBlockByIndex(s),{holder:e}=t;i=e.firstChild.firstChild.children}const o=document.querySelectorAll(`div[foreignKey="${this.wrapper.id}"]`),r=s+o.length;this.api.caret.setToBlock(t),o.length>1&&this.api.blocks.move(r),setTimeout((()=>this.removeAttributesFromNewBlock(r)),200),this.api.toolbar.close()}setPlaceHolder(t){if("Backspace"===t.code||"Enter"===t.code){const{children:t}=this.wrapper,{length:e}=t[1].textContent;0===e&&(t[1].textContent="")}}render(){return this.createToggle(),setTimeout((()=>this.renderItems())),setTimeout((()=>this.setInitialTransition())),this.wrapper}setInitialTransition(){const{status:t}=this.data,e=this.wrapper.firstChild.firstChild;e.style.transition="0.1s",e.style.transform=`rotate(${"closed"===t?0:90}deg)`}renderItems(){const t=this.api.blocks.getBlocksCount(),e=this.wrapper.firstChild;let s;if(this.readOnly){const t=document.getElementsByClassName("codex-editor__redactor")[0],{children:e}=t,{length:i}=e;for(let t=0;t<i;t+=1){const i=e[t].firstChild.firstChild,{id:o}=i;if(o===this.wrapper.id){s=t;break}}}else{const t=this.wrapper.children[1];let e={};for(;e[1]!==t;){s=this.api.blocks.getCurrentBlockIndex();const t=this.api.blocks.getBlockByIndex(s),{holder:i}=t;e=i.firstChild.firstChild.children,this.api.caret.setToNextBlock("end",0)}}if(s+this.data.items<t)for(let t=s+1,e=0;t<=s+this.data.items;t+=1){const s=this.api.blocks.getBlockByIndex(t),{holder:i}=s,o=i.firstChild.firstChild;if(this.isPartOfAToggle(o)){this.data.items=e;break}this.setAttributesToNewBlock(t),e+=1}else this.data.items=0;e.addEventListener("click",(()=>{this.resolveToggleAction(),setTimeout((()=>{this.hideAndShowBlocks()}))})),this.hideAndShowBlocks()}resolveToggleAction(){const t=this.wrapper.firstChild.firstChild;"closed"===this.data.status?(this.data.status="open",t.style.transform="rotate(90deg)"):(this.data.status="closed",t.style.transform="rotate(0deg)"),this.api.blocks.getBlockByIndex(this.api.blocks.getCurrentBlockIndex()).holder.setAttribute("status",this.data.status)}hideAndShowBlocks(t=this.wrapper.id,e=this.data.status){const s=document.querySelectorAll(`div[foreignKey="${t}"]`),{length:i}=s;if(i>0)s.forEach((t=>{t.hidden="closed"===e;const s=t.querySelectorAll(".toggle-block__selector");if(s.length>0){const i="closed"===e?e:t.getAttribute("status");this.hideAndShowBlocks(s[0].getAttribute("id"),i)}}));else if(t===this.wrapper.id){const{lastChild:t}=this.wrapper;t.classList.toggle("toggle-block__hidden",e)}}save(t){const{children:e}=t,s=e[1].innerHTML,i=document.querySelectorAll(`div[foreignKey="${this.wrapper.id}"]`);return Object.assign(this.data,{text:s,items:i.length})}renderSettings(){const t=document.getElementsByClassName("ce-settings--opened")[0].lastChild,e=this.api.blocks.getCurrentBlockIndex(),s=document.querySelectorAll(`div[foreignKey="${this.wrapper.id}"]`);for(let t=0;t<s.length;t+=1)s[t].classList.add("ce-block--selected");setTimeout((()=>{const s=t.getElementsByClassName("ce-settings__button--delete")[0];s.addEventListener("click",(()=>{const t=s.classList;-1===Object.values(t).indexOf("clicked-to-destroy-toggle")?s.classList.add("clicked-to-destroy-toggle"):this.removeFullToggle(e)}))}))}removeFullToggle(t){const e=document.querySelectorAll(`div[foreignKey="${this.wrapper.id}"]`),{length:s}=e;for(let e=t;e<t+s;e+=1)this.api.blocks.delete(t)}addListeners(){this.readOnly||document.activeElement.addEventListener("keyup",(t=>{const e=document.activeElement,s=this.api.blocks.getCurrentBlockIndex(),i=e.parentElement.parentElement;"Space"===t.code?this.createToggleWithShortcut(e):s>0&&!this.isPartOfAToggle(e)&&!this.isPartOfAToggle(i)&&"Tab"===t.code&&this.nestBlock(e)}))}addSupportForUndoAndRedoActions(){if(!this.readOnly){const t=document.querySelector("div.codex-editor__redactor"),e={attributes:!0,childList:!0,characterData:!0};new MutationObserver((t=>{t.forEach((t=>{"childList"===t.type&&setTimeout(this.restoreItemAttributes.bind(this,t))}))})).observe(t,e)}}getIndex=t=>Array.from(t.parentNode.children).indexOf(t);addSupportForDragAndDropActions(){if(!this.readOnly){if(void 0===this.wrapper)return void setTimeout((()=>this.addSupportForDragAndDropActions()),250);document.querySelector(`#${this.wrapper.id}`).parentNode.parentNode.setAttribute("status",this.data.status);const t=document.querySelector(".ce-toolbar__settings-btn");t.setAttribute("draggable","true"),t.addEventListener("dragstart",(()=>{this.startBlock=this.api.blocks.getCurrentBlockIndex(),this.nameDragged=this.api.blocks.getBlockByIndex(this.startBlock).name,this.holderDragged=this.api.blocks.getBlockByIndex(this.startBlock).holder})),document.addEventListener("drop",(t=>{if("toggle"===this.nameDragged&&null!==this.holderDragged.querySelector(`#${this.wrapper.id}`)){const{target:e}=t;if(document.contains(e)){const t=e.classList.contains("ce-block")?e:e.closest(".ce-block");if(t&&t!==this.holderDragged){let e=this.getIndex(t);e=this.startBlock<e?e+1:e;const s=t.querySelectorAll(".toggle-block__selector").length>0||null!==t.getAttribute("foreignKey");if(s){const e=null!==t.getAttribute("foreignKey")?t.getAttribute("foreignKey"):t.querySelector(".toggle-block__selector").getAttribute("id"),s=this.getIndex(this.holderDragged);this.setAttributesToNewBlock(s,e)}setTimeout((()=>{if(this.moveChildren(t,e),!s){const t=this.getIndex(this.holderDragged);this.removeAttributesFromNewBlock(t)}}))}}}}))}}moveChildren(t,e,s=this.wrapper.id){let i=document.querySelectorAll(`div[foreignKey="${s}"]`);i=this.startBlock>=e?[...i].reverse():i,i.forEach((t=>{const s=this.getIndex(t);this.api.blocks.move(e,s);const i=t.querySelectorAll(".toggle-block__selector");if(i.length>0){const s=this.getIndex(t),o=this.startBlock<e?0:1;i.forEach((e=>this.moveChildren(t,s+o,e.getAttribute("id"))));const r=Math.abs(e-s);e=this.startBlock<e?e+r:e-r}}))}restoreItemAttributes(t){if(void 0!==this.wrapper){const e=this.api.blocks.getCurrentBlockIndex(),s=this.api.blocks.getBlockByIndex(e),{holder:i}=s,o=!this.isPartOfAToggle(i),r=t.removedNodes[0];if(this.itemsId.includes(s.id)&&o)this.setAttributesToNewBlock(e);else if(r&&this.isPartOfAToggle(r)&&o){const t=i.firstChild.firstChild;this.isPartOfAToggle(t)||(this.setAttributesToNewBlock(e),this.itemsId[e]=s.id)}}}createToggleWithShortcut(t){const e=t.textContent;if(">"===e[0]&&!this.isPartOfAToggle(t)){const t=this.api.blocks.getCurrentBlockIndex();this.api.blocks.insert("toggle",{text:e.slice(2)},this.api,t,!0),this.api.blocks.delete(t+1),this.api.caret.setToBlock(t)}}nestBlock(t){const e=t.parentElement.parentElement,s=e.previousElementSibling,i=s.firstChild.firstChild;if(this.isPartOfAToggle(i)||this.isPartOfAToggle(s)){const t=s.getAttribute("foreignKey"),o=i.getAttribute("id"),r=t||o;e.setAttribute("will-be-a-nested-block",!0),document.getElementById(r).children[1].focus()}}setNestedBlockAttributes(){const t=this.api.blocks.getCurrentBlockIndex(),e=this.api.blocks.getBlockByIndex(t),{holder:s}=e;s.getAttribute("will-be-a-nested-block")&&(s.removeAttribute("will-be-a-nested-block"),this.setAttributesToNewBlock(t),this.api.toolbar.close())}isPartOfAToggle(t){const e=Array.from(t.classList);return e.includes("toggle-block__item")||e.includes("toggle-block__input")||e.includes("toggle-block__selector")}}})(),i.default})()}));