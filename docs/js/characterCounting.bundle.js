!function(){const t=document.getElementById("input-counting"),e=document.getElementById("totalChars"),n=document.getElementById("noSpaces"),c=document.getElementById("wordCount"),o=document.getElementById("cyrillicChars"),l=document.getElementById("latinChars"),d=document.getElementById("digitCount"),g=document.getElementById("specialChars"),i=document.getElementById("copyIcon");t.addEventListener("input",(()=>{const a=t.value;!function(t){const c=t.replace(/[\r\n]+/g,"");e.textContent=c.length,n.textContent=c.replace(/\s/g,"").length}(a),function(t){const e=t.match(/[\wа-яё'-]+/gi);c.textContent=e?e.length:0}(a),function(t){o.textContent=t.match(/[а-яё]/gi)?t.match(/[а-яё]/gi).length:0,l.textContent=t.match(/[a-z]/gi)?t.match(/[a-z]/gi).length:0,d.textContent=t.match(/\d/g)?t.match(/\d/g).length:0,g.textContent=t.replace(/[a-zа-яё\d\s]/gi,"").length}(a),function(t){t.length>0?(i.style.display="inline",i.addEventListener("click",(()=>{navigator.clipboard.writeText(t)}))):i.style.display="none"}(a)}))}();