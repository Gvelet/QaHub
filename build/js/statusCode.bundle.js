!function(){const t=document.getElementById("statuses__wrapper-input"),e=document.getElementById("statuses__info"),n=document.querySelector(".statuses__wrapper-submit"),s=document.getElementById("statusesSelectGroups"),a=document.getElementById("statusesSelectCodes");let o=[];const i=()=>{const t=s.value;var e;e=o.statuses.filter((e=>String(e.name).startsWith(t))),a.innerHTML='<option value="" disabled selected>Выберите статус код</option>',e.forEach((t=>{a.innerHTML+=`<option value="${t.name}">${t.name}</option>`})),r()},r=()=>{const t=a.value;if(t){const e=parseInt(t),n=o.statuses.find((t=>t.name===e));c(n)}},c=n=>{e.innerHTML=n?`<p class='statuses__info-title'>Статус код ${n.name} - ${n.title}</p>\n             <p>${n.description}</p>`:"<p>К сожалению ничего не найдено. Попробуйте ввести другой статус код</p>",e.style.opacity=1,t.value=""};(async()=>{try{const e=await fetch("../files/get_statuses.php"),p=await e.json(),d=CryptoJS.AES.decrypt(p.data,"your-secret-key",{iv:CryptoJS.enc.Utf8.parse("your-initialization-vector"),mode:CryptoJS.mode.CBC,padding:CryptoJS.pad.Pkcs7}).toString(CryptoJS.enc.Utf8);o=JSON.parse(d),i(),n.addEventListener("click",(e=>{e.preventDefault();const n=parseInt(t.value),s=o.statuses.find((t=>t.name===n));c(s)})),s.addEventListener("change",i),a.addEventListener("change",r)}catch(t){console.error(t)}})()}();