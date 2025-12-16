let kdrData = null;

function showSection(id){
  const sections = document.querySelectorAll('section');
  sections.forEach(sec => {
    if(sec.id === id){
      sec.classList.add('active');
    } else {
      sec.classList.remove('active');
    }
  });
}

function openBook(which){
  if(which === 'deepdive'){
    window.open('https://www.amazon.com/dp/B0FSF3R8JN','_blank');
  } else if(which === 'ofitk'){
    window.open('https://www.amazon.com/dp/B0FJ1H3WJS','_blank');
  }
}

function runSearch(){
  const input = document.getElementById('searchInput').value.trim().toLowerCase();
  const resultsDiv = document.getElementById('searchResults');
  const infoDiv = document.getElementById('searchResultsInfo');
  resultsDiv.innerHTML = '';
  infoDiv.textContent = '';

  if(!input){
    infoDiv.textContent = 'Type a word or phrase to search all cards.';
    return;
  }

  let matches = [];

  ['A','S','P','C'].forEach(series => {
    (kdrData[series] || []).forEach(card => {
      const hay = [
        card.code,
        card.title,
        card.narrative || '',
        card.anchor_ref,
        card.anchor_text || '',
        card.align,
        card.act,
        card.pray,
        card.evening,
        card.supports,
        card.crossrefs || '',
        (card.tags || []).join(' ')
      ].join(' ').toLowerCase();

      if(hay.includes(input)){
        matches.push({ series, card });
      }
    });
  });

  if(matches.length === 0){
    infoDiv.textContent = 'No matching cards found yet.';
    return;
  }

  infoDiv.textContent = 'Showing ' + matches.length + ' matching card(s).';

  matches.forEach(m => {
    const div = document.createElement('div');
    div.className = 'card';
    const label = m.series === 'A' ? 'A-Series' : (m.series === 'S' ? 'S-Series' : (m.series === 'P' ? 'P-Series' : 'Crisis Care'));
    const card = m.card;

    div.innerHTML = renderCardHtml(label, card);
    resultsDiv.appendChild(div);
  });
}

function renderCardHtml(seriesLabel, card){
  const anchorRef = card.anchor_ref ? `<p><span class="subheading">Anchor Scriptures:</span> ${card.anchor_ref}</p>` : '';
  const anchorText = card.anchor_text ? `<p>${card.anchor_text}</p>` : '';
  const narrative = card.narrative ? `<p class="narrative">${card.narrative}</p>` : '';
  const align = card.align ? `<p><span class="subheading">Align (Heart):</span><br>${card.align.replace(/\n/g, '<br>')}</p>` : '';
  const act = card.act ? `<p><span class="subheading">Act (Steps):</span><br>${card.act.replace(/\n/g, '<br>')}</p>` : '';
  const pray = card.pray ? `<p><span class="subheading">Pray:</span> ${card.pray}</p>` : '';
  const evening = card.evening ? `<p><span class="subheading">Evening Check-In:</span><br>${card.evening.replace(/\n/g, '<br>')}</p>` : '';
  const supports = card.supports ? `<p><span class="subheading">Wise Supports:</span><br>${card.supports.replace(/\n/g, '<br>')}</p>` : '';
  const crossrefsVal = Array.isArray(card.crossrefs)
  ? card.crossrefs.join('<br>')
  : (card.crossrefs ? String(card.crossrefs).replace(/\n/g, '<br>') : '');

const crossrefs = crossrefsVal
  ? `<p><span class="subheading">Cross-References:</span><br>${crossrefsVal}</p>`
  : '';

  
  return `
    <h3>${seriesLabel}: ${card.code ? card.code + ' — ' : ''}${card.title || ''}</h3>
    ${narrative}
    ${anchorRef}
    ${anchorText}
    ${align}
    ${act}
    ${pray}
    ${evening}
    ${supports}
    ${crossrefs}
  `;
}

fetch('kdr.json?v=' + Date.now(), { cache: 'no-store' })
  .then(r => {
    if(!r.ok) throw new Error('kdr.json HTTP ' + r.status);
    return r.json();
  })
  .then(data => {
    kdrData = data;

    loadCards('A-list', data.A || [], 'A-Series');
    loadCards('S-list', data.S || [], 'S-Series');
    loadCards('P-list', data.P || [], 'S-Series');
    loadCards('P-list', data.P || [], 'P-Series');

    console.log('✅ KDR loaded:', {
      A: (data.A||[]).length,
      S: (data.S||[]).length,
      P: (data.P||[]).length,
      C: (data.C||[]).length
    });
  })
  .catch(err => {
    console.error('Error loading KDR data', err);
    alert('KDR did not load. Error: ' + err.message);
  });


function loadCards(containerId, cards, seriesLabel){
  const c = document.getElementById(containerId);
  c.innerHTML = '';

  cards.forEach(card => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = renderCardHtml(seriesLabel, card);
    c.appendChild(div);
  });
}

// ---------------------------
// HELP ME (Crisis Care) Modal
// ---------------------------
function openHelp(retries = 10){
  if(!kdrData){
    if(retries > 0){
      setTimeout(()=>openHelp(retries - 1), 500);
    } else {
      alert('Cards still loading. Please refresh the page once.');
    }
    return;
  }

  const modal = document.getElementById('helpModal');
  if(!modal) return;
  modal.classList.add('show');
  modal.setAttribute('aria-hidden','false');
  showHelpList();
  renderCrisisList();
}


function closeHelp(){
  const modal = document.getElementById('helpModal');
  if(!modal) return;
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden','true');
}

function showHelpList(){
  const intro = document.getElementById('helpViewIntro');
  const detail = document.getElementById('helpViewDetail');
  if(intro) intro.style.display = 'block';
  if(detail) detail.style.display = 'none';
}

function showHelpDetail(card){
  const intro = document.getElementById('helpViewIntro');
  const detail = document.getElementById('helpViewDetail');
  const box = document.getElementById('helpCardDetail');
  if(intro) intro.style.display = 'none';
  if(detail) detail.style.display = 'block';
  if(box){
    box.innerHTML = renderCardHtml('Crisis Care', card);
  }
  // ensure modal scrolls to top for readability
  const modalContent = document.querySelector('#helpModal .modal-content');
  if(modalContent) modalContent.scrollTop = 0;
}

function renderCrisisList(){
  const list = document.getElementById('helpCardList');
  if(!list) return;
  list.innerHTML = '';
  const cards = (kdrData && kdrData.C) ? kdrData.C : [];

  if(!cards.length){
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = '<p><strong>Immediate Help</strong><br><a href="#C1">Open C1 — When I Want to Hurt Myself</a></p>';

    list.appendChild(div);
    return;
  }

  // sort by code (C1, C2, ...)
  cards.sort((a,b)=>{
    const na = parseInt((a.code||'').replace(/\D/g,'')) || 0;
    const nb = parseInt((b.code||'').replace(/\D/g,'')) || 0;
    return na-nb;
  });

  cards.forEach(card=>{
    const btn = document.createElement('button');
    btn.className = 'helpCardBtn';
    const code = card.code ? card.code + ' — ' : '';
    btn.textContent = code + (card.title || 'Crisis Care');
    btn.onclick = ()=>showHelpDetail(card);
    list.appendChild(btn);
  });
}

// Close modal on ESC
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape'){
    const modal = document.getElementById('helpModal');
    if(modal && modal.classList.contains('show')){
      closeHelp();
    }
  }
});
