const form = document.querySelector('#taste-form');
const steps = [...document.querySelectorAll('.question')];
const nextButton = document.querySelector('#next-button');
const backButton = document.querySelector('#back-button');
const progressFill = document.querySelector('#progress-fill');
const stepLabel = document.querySelector('#step-label');
const percentLabel = document.querySelector('#percent-label');
const dots = [...document.querySelectorAll('.step-dots i')];
const error = document.querySelector('#form-error');
const results = document.querySelector('#results');
let step = 0;

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

const discoverySeeds = {
  Pop: [{ artist: 'Caroline Polachek', song: 'Bunny Is a Rider' }, { artist: 'Rina Sawayama', song: 'XS' }],
  Indie: [{ artist: 'Men I Trust', song: 'Show Me How' }, { artist: 'Japanese Breakfast', song: 'Be Sweet' }],
  'R&B': [{ artist: 'Cleo Sol', song: "Why Don't You" }, { artist: 'The Internet', song: 'Come Over' }],
  Electrónica: [{ artist: 'Jamie xx', song: 'Gosh' }, { artist: 'Fred again..', song: 'Delilah (pull me out of this)' }],
  'Hip-hop': [{ artist: 'Little Simz', song: 'Introvert' }, { artist: 'Noname', song: 'Diddy Bop' }],
  Rock: [{ artist: 'Fontaines D.C.', song: 'Starburster' }, { artist: 'Wet Leg', song: 'Chaise Longue' }],
  Jazz: [{ artist: 'BADBADNOTGOOD', song: 'Time Moves Slow' }, { artist: 'Nubya Garcia', song: 'Pace' }],
  Sorpresa: [{ artist: 'Yaeji', song: 'For Granted' }, { artist: 'Khruangbin', song: 'Time (You and I)' }]
};

function setStep(index) {
  step = index;
  steps.forEach((item, i) => { item.hidden = i !== step; });
  const percent = Math.round(((step + 1) / steps.length) * 100);
  progressFill.style.width = `${percent}%`;
  stepLabel.textContent = `PASO 0${step + 1} / 0${steps.length}`;
  percentLabel.textContent = `${percent}%`;
  dots.forEach((dot, i) => dot.classList.toggle('on', i === step));
  backButton.hidden = step === 0;
  nextButton.innerHTML = step === steps.length - 1 ? 'VER DESCUBRIMIENTOS <span>↗</span>' : 'SIGUIENTE <span>→</span>';
  error.textContent = '';
}

setStep(0);

function showRecommendations() {
  const artists = document.querySelector('#artists').value.split(',').map(value => value.trim()).filter(Boolean).slice(0, 3);
  const genres = [...document.querySelectorAll('input[name="genre"]:checked')].map(input => input.value);
  const languages = [...document.querySelectorAll('input[name="language"]:checked')].map(input => input.value);
  const moods = [...document.querySelectorAll('input[name="mood"]:checked')].map(input => input.value);
  const distance = document.querySelector('input[name="distance"]:checked')?.value || 'Familiar Territory';
  const selectedGenres = genres.length ? genres : ['Sorpresa'];
  const chosen = selectedGenres.flatMap(genre => discoverySeeds[genre] || []).slice(0, 4);
  window.unloopPending = { artists, genres: selectedGenres, languages, moods, distance, picks: chosen };
  const artistsText = artists.length ? escapeHtml(artists.join(', ')) : 'Tus respuestas';
  const moodText = moods.length ? moods.join(' · ') : 'Curiosidad';
  const picks = chosen.map((pick, index) => `<div class="recommendation"><span class="pick-index">0${index + 1}</span><div><strong>${pick.artist}</strong><small>${pick.song}</small></div><span class="pick-note">↗</span></div>`).join('');
  const languageText = languages.length ? languages.join(' · ') : 'Cualquier idioma';
  document.querySelector('#result-details').innerHTML = `<p class="result-summary">Partimos de <strong>${artistsText}</strong>, los sonidos <strong>${selectedGenres.join(', ')}</strong> y el mood <strong>${moodText}</strong>. Idiomas: <strong>${languageText}</strong>. Camino: <strong>${distance}</strong>.</p><p class="result-kicker">PRIMERAS PISTAS · ${selectedGenres.join(' / ').toUpperCase()}</p><div class="recommendation-list">${picks}</div>`;
  form.hidden = true;
  results.hidden = false;
  progressFill.style.width = '100%';
  stepLabel.textContent = 'MAPA COMPLETADO';
  percentLabel.textContent = '100%';
  document.querySelector('.survey-card').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

nextButton.addEventListener('click', () => {
  if (step === 0 && !document.querySelector('#artists').value.trim()) {
    error.textContent = 'Escribe al menos un artista para empezar.';
    document.querySelector('#artists').focus();
    return;
  }
  if (step === 2 && !document.querySelector('input[name="language"]:checked')) {
    error.textContent = 'Elige al menos una opción de idioma para orientar tu loop.';
    return;
  }
  if (step < steps.length - 1) setStep(step + 1);
  else showRecommendations();
});
backButton.addEventListener('click', () => setStep(Math.max(0, step - 1)));
document.querySelector('#restart-button').addEventListener('click', () => {
  form.reset(); form.hidden = false; results.hidden = true; setStep(0);
  document.querySelector('#artists').focus({ preventScroll: true });
});
form.addEventListener('submit', event => event.preventDefault());

const menuButton = document.querySelector('#menu-button');
const menuPanel = document.querySelector('#menu-panel');
const pathCards = [...document.querySelectorAll('.path-card')];
pathCards.forEach(card => card.addEventListener('toggle', () => {
  if (card.open) pathCards.forEach(other => { if (other !== card) other.open = false; });
}));
menuButton.addEventListener('click', () => {
  const open = menuPanel.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
menuPanel.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menuPanel.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false');
}));

const loginDialog = document.querySelector('#login-dialog');
const loginMessage = document.querySelector('#login-message');
document.querySelector('#sign-in-link').addEventListener('click', event => {
  event.preventDefault();
  if (window.UnloopSpotify?.isConnected()) {
    document.querySelector('#account-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  loginMessage.textContent = '';
  loginDialog.showModal();
});
document.querySelector('#login-close').addEventListener('click', () => loginDialog.close());
loginDialog.addEventListener('click', event => {
  if (event.target === loginDialog) loginDialog.close();
});
document.querySelector('#login-form').addEventListener('submit', event => {
  event.preventDefault();
  loginMessage.textContent = 'El acceso aún no está conectado en esta primera versión.';
});
document.querySelectorAll('.social-login button').forEach(button => button.addEventListener('click', () => {
  loginMessage.textContent = `El acceso con ${button.dataset.provider} aún no está conectado.`;
}));
document.querySelector('#signup-button').addEventListener('click', () => {
  loginMessage.textContent = 'La creación de cuentas estará disponible más adelante.';
});
document.querySelector('#save-loop-button').addEventListener('click', () => window.UnloopSpotify?.saveSurveyLoop());
