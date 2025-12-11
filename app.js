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
        card.anchor_ref,
        card.anchor_text,
        card.align,
        card.act,
        card.pray,
        card.evening,
        card.supports,
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

    const anchorRef = card.anchor_ref ? `<p><strong>Anchor:</strong> ${card.anchor_ref}</p>` : '';
    const anchorText = card.anchor_text ? `<p>${card.anchor_text}</p>` : '';
    const align = card.align ? `<p><strong>Align:</strong> ${card.align}</p>` : '';
    const act = card.act ? `<p><strong>Act:</strong><br>${card.act.replace(/\n/g, '<br>')}</p>` : '';
    const pray = card.pray ? `<p><strong>Pray:</strong> ${card.pray}</p>` : '';
    const evening = card.evening ? `<p><strong>Evening Check-In:</strong> ${card.evening}</p>` : '';
    const supports = card.supports ? `<p><strong>Wise Supports:</strong> ${card.supports}</p>` : '';

    div.innerHTML = `
      <h3>${label}: ${card.code ? card.code + ' — ' : ''}${card.title || ''}</h3>
      ${anchorRef}
      ${anchorText}
      ${align}
      ${act}
      ${pray}
      ${evening}
      ${supports}
    `;

    resultsDiv.appendChild(div);
  });
}

fetch('kdr.json')
  .then(r=>r.json())
  .then(data=>{
    kdrData = data;
    loadCards('A-list', data.A || []);
    loadCards('S-list', data.S || []);
    loadCards('P-list', data.P || []);
  })
  .catch(err=>console.error('Error loading KDR data', err));

function loadCards(containerId, cards){
  const c = document.getElementById(containerId);
  c.innerHTML = '';

  cards.forEach(card => {
    const div = document.createElement('div');
    div.className = 'card';

    const anchorRef = card.anchor_ref ? `<p><strong>Anchor:</strong> ${card.anchor_ref}</p>` : '';
    const anchorText = card.anchor_text ? `<p>${card.anchor_text}</p>` : '';
    const align = card.align ? `<p><strong>Align:</strong> ${card.align}</p>` : '';
    const act = card.act ? `<p><strong>Act:</strong><br>${card.act.replace(/\n/g, '<br>')}</p>` : '';
    const pray = card.pray ? `<p><strong>Pray:</strong> ${card.pray}</p>` : '';
    const evening = card.evening ? `<p><strong>Evening Check-In:</strong> ${card.evening}</p>` : '';
    const supports = card.supports ? `<p><strong>Wise Supports:</strong> ${card.supports}</p>` : '';

    div.innerHTML = `
      <h3>${card.code ? card.code + ' — ' : ''}${card.title || ''}</h3>
      ${anchorRef}
      ${anchorText}
      ${align}
      ${act}
      ${pray}
      ${evening}
      ${supports}
    `;

    c.appendChild(div);
  });
}
