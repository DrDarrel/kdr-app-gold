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

  ['A','S','P'].forEach(series => {
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
    const label = m.series === 'A' ? 'A-Series' : (m.series === 'S' ? 'S-Series' : 'P-Series');
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
  const crossrefs = card.crossrefs ? `<p><span class="subheading">Cross-References:</span><br>${card.crossrefs.replace(/\n/g, '<br>')}</p>` : '';

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

fetch('kdr.json')
  .then(r=>r.json())
  .then(data=>{
    kdrData = data;
    loadCards('A-list', data.A || [], 'A-Series');
    loadCards('S-list', data.S || [], 'S-Series');
    loadCards('P-list', data.P || [], 'P-Series');
  })
  .catch(err=>console.error('Error loading KDR data', err));

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
