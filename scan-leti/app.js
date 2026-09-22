(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const screens = [...document.querySelectorAll('.screen')];
  const timers = new Set();
  function later(fn, ms) { const id = setTimeout(() => { timers.delete(id); fn(); }, ms); timers.add(id); }
  function clearTimers() { timers.forEach(clearTimeout); timers.clear(); }
  function show(id) {
    clearTimers();
    $('birthday-video').pause();
    screens.forEach(screen => { screen.hidden = screen.id !== id; });
    $('restart').hidden = id === 'home';
    window.scrollTo({top: 0, behavior: 'instant'});
    $('main').focus({preventScroll:true});
  }
  const scanMessages = ['Passione per i cavalli: fuori scala.', 'Talento per i pisolini: confermato.', 'Foto a sgamo: archivio decisamente pieno.', 'Sì. Sei proprio la mia Leti.'];
  function resetScan() {
    $('scan-button').disabled = false;
    $('scan-button').hidden = false;
    $('scan-next').hidden = true;
    $('scan-line').textContent = 'Un controllo veloce, per sicurezza.';
    $('scan-progress').style.width = '0%';
    $('scan').classList.remove('scanning');
  }
  $('start').addEventListener('click', () => { resetScan(); show('scan'); });
  $('scan-button').addEventListener('click', () => {
    $('scan-button').disabled = true;
    $('scan').classList.add('scanning');
    scanMessages.forEach((message,index) => later(() => {
      $('scan-line').textContent = message;
      $('scan-progress').style.width = `${(index+1)*25}%`;
      if(index === scanMessages.length-1) {
        $('scan').classList.remove('scanning');
        $('scan-button').hidden = true;
        $('scan-next').hidden = false;
        $('scan-next').focus({preventScroll:true});
      }
    }, (index+1)*600));
  });
  let picked = [], pairs = 0, locked = false;
  const labels = {cavalli:'Cavalli',pisolini:'Pisolini',sgamo:'Foto a sgamo'};
  function newGame() {
    picked = []; pairs = 0; locked = false;
    $('pairs-count').textContent = '0 DI 3 COPPIE';
    $('game-note').textContent = 'Nessun timer. So che potresti avere sonno.';
    $('game-next').hidden = true; $('skip-game').hidden = false;
    $('memory-grid').replaceChildren();
    const deck = ['cavalli','pisolini','sgamo','cavalli','pisolini','sgamo'];
    for(let i=deck.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]];}
    deck.forEach((type,index) => {
      const card = document.createElement('button');
      card.className = 'memory-card'; card.type = 'button';
      card.setAttribute('aria-label',`Scopri carta ${index+1}`);
      card.setAttribute('aria-pressed','false');
      const back = document.createElement('span'); back.className='back'; back.textContent='l.'; back.setAttribute('aria-hidden','true');
      const img=document.createElement('img');img.src=`assets/${type}.webp`;img.alt='';img.width=300;img.height=400;
      card.append(back,img);
      card.addEventListener('click', () => {
        if(locked || card.classList.contains('open') || card.classList.contains('matched')) return;
        card.classList.add('open'); card.setAttribute('aria-pressed','true'); card.setAttribute('aria-label',`Carta ${index+1}: ${labels[type]}`);
        picked.push({card,type,index});
        if(picked.length!==2) return;
        if(picked[0].type===picked[1].type) {
          picked.forEach(item=>{item.card.classList.add('matched');item.card.disabled=true;});
          pairs++; picked=[]; $('pairs-count').textContent=`${pairs} DI 3 COPPIE`;
          $('game-note').textContent = pairs===3 ? 'Ti riconoscerei tra mille. Anche a occhi chiusi.' : pairs===1 ? 'Una coppia trovata. Ti conosco, eh.' : 'Due su tre. Manca pochissimo.';
          if(pairs===3){$('game-next').hidden=false;$('skip-game').hidden=true;$('game-next').focus({preventScroll:true});}
        } else {
          locked=true;
          later(()=>{picked.forEach(item=>{item.card.classList.remove('open');item.card.setAttribute('aria-pressed','false');item.card.setAttribute('aria-label',`Scopri carta ${item.index+1}`);});picked=[];locked=false;},950);
        }
      });
      $('memory-grid').append(card);
    });
  }
  $('scan-next').addEventListener('click',()=>{newGame();show('game');});
  $('game-next').addEventListener('click',()=>show('film'));
  $('skip-game').addEventListener('click',()=>show('film'));
  $('to-gift').addEventListener('click',()=>show('envelope'));
  $('open-gift').addEventListener('click',()=>show('gift'));
  $('watch-again').addEventListener('click',()=>show('film'));
  $('print-gift').addEventListener('click',()=>window.print());
  $('restart').addEventListener('click',()=>show('home'));
  document.querySelector('.wordmark').addEventListener('click',event=>{event.preventDefault();show('home');});
  $('birthday-video').addEventListener('error',()=>{$('video-error').hidden=false;});
  $('birthday-video').querySelector('source').addEventListener('error',()=>{$('video-error').hidden=false;});
})();
