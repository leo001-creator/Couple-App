// Registruojame Service Worker (offline palaikymui)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(reg => {
    console.log('SW užregistruotas', reg);
  }).catch(err => {
    console.log('SW registracija nepavyko:', err);
  });
}

// Funkcija skaičiuoti dienas nuo datos
function updateDaysCount() {
  const storedDate = localStorage.getItem('startDate');
  if (!storedDate) return;
  const start = new Date(storedDate);
  const now = new Date();
  const diffTime = now - start;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  document.getElementById('days-count').textContent = diffDays;
}

// Įvykis mygtuko paspaudimui: išsaugoti datą ir atnaujinti skaitiklį
document.getElementById('save-button').addEventListener('click', () => {
  const dateValue = document.getElementById('start-date').value;
  if (dateValue) {
    localStorage.setItem('startDate', dateValue);
    updateDaysCount();
  }
});

// Atnaujiname dienų skaitiklį puslapio užkrovimo metu
window.addEventListener('load', () => {
  updateDaysCount();
});
