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
      const hay = (card.title + ' ' + card.content).toLowerCase();
      if(hay.includes(input)){
        matches.push({
          series,
          title: card.title,
          content: card.content
        });
      }
    });
  });

  if(matches.length === 0){
    infoDiv.textContent = 'No matching cards found yet in this demo.';
    return;
  }

  infoDiv.textContent = 'Showing ' + matches.length + ' matching card(s).';

  matches.forEach(m => {
    const div = document.createElement('div');
    div.className = 'card';
    const label = m.series === 'A' ? 'A-Series' : (m.series === 'S' ? 'S-Series' : 'P-Series');
    div.innerHTML = '<h3>' + label + ': ' + m.title + '</h3><p>' + m.content + '</p>';
    resultsDiv.appendChild(div);
  });
}

fetch('kdr.json')
  .then(r=>r.json())
  .then(data=>{
    kdrData = data;
    loadCards('A-list', data.A);
    loadCards('S-list', data.S);
    loadCards('P-list', data.P);
  })
  .catch(err=>console.error('Error loading KDR data', err));

function loadCards(containerId, cards){
  const c = document.getElementById(containerId);
  c.innerHTML = '';
  cards.forEach(card => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = '<h3>'+card.title+'</h3><p>'+card.content+'</p>';
    c.appendChild(div);
  });
}
