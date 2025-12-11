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

fetch('kdr.json')
  .then(r=>r.json())
  .then(data=>{
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
