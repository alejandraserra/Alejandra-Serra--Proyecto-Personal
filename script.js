// Scroll 05 · Encuesta, preguntas y resultados
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

const catalogTerms = {
  Pop: 'alternative pop', Indie: 'indie', 'R&B': 'alternative r&b',
  Electrónica: 'electronic', 'Hip-hop': 'alternative hip hop', Rock: 'indie rock',
  Jazz: 'modern jazz', Sorpresa: 'alternative music'
};
const moodTerms = {
  Desconectar: 'calm', Energía: 'energetic', Acompañamiento: 'intimate',
  Inspiración: 'uplifting', Movimiento: 'dance', Todo: ''
};
const languageTerms = { Español: 'Spanish', Inglés: 'English', 'Otros idiomas': 'international' };

function searchMusicCatalog(params) {
  return new Promise((resolve, reject) => {
    const callback = `unloopCatalog_${crypto.getRandomValues(new Uint32Array(1))[0].toString(36)}`;
    const script = document.createElement('script');
    const cleanUp = () => {
      delete window[callback];
      script.remove();
      clearTimeout(timeout);
    };
    const timeout = setTimeout(() => { cleanUp(); reject(new Error('El catálogo musical está tardando demasiado. Inténtalo de nuevo.')); }, 12000);
    window[callback] = data => { cleanUp(); resolve(data.results || []); };
    script.onerror = () => { cleanUp(); reject(new Error('No hemos podido consultar el catálogo musical. Comprueba tu conexión e inténtalo otra vez.')); };
    params.set('callback', callback);
    script.src = `https://itunes.apple.com/search?${params}`;
    document.head.append(script);
  });
}

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

async function getCatalogRecommendations(loop) {
  const terms = loop.genres.map(genre => catalogTerms[genre] || genre.toLowerCase());
  const mood = loop.moods.map(value => moodTerms[value]).filter(Boolean).slice(0, 1)[0] || '';
  const language = loop.languages.length === 1 && languageTerms[loop.languages[0]] ? languageTerms[loop.languages[0]] : '';
  const favorites = new Set(loop.artists.map(name => name.toLocaleLowerCase()));
  const requests = (terms.length ? terms : ['alternative music']).slice(0, 3).map(async term => {
    const query = [term, language, mood].filter(Boolean).join(' ');
    const params = new URLSearchParams({ term: query, entity: 'song', limit: '20', country: 'ES' });
    return searchMusicCatalog(params);
  });
  const results = (await Promise.all(requests)).flat();
  const candidates = results
    .filter(track => track.trackName && track.artistName && track.trackViewUrl)
    .filter(track => !favorites.has(track.artistName.toLocaleLowerCase()))
    .filter(track => !/karaoke|tribute|cover version/i.test(track.trackName));
  const unique = [...new Map(candidates.map(track => [track.trackId, track])).values()];
  const picks = unique.slice(0, 4).map(track => ({
    artist: track.artistName,
    song: track.trackName,
    catalogUrl: track.trackViewUrl,
    artwork: track.artworkUrl100
  }));
  if (!picks.length) throw new Error('No encontramos pistas con estas respuestas. Prueba con otro artista o estilo.');
  return picks;
}

async function showRecommendations() {
  const artists = document.querySelector('#artists').value.split(',').map(value => value.trim()).filter(Boolean).slice(0, 3);
  const genres = [...document.querySelectorAll('input[name="genre"]:checked')].map(input => input.value);
  const languages = [...document.querySelectorAll('input[name="language"]:checked')].map(input => input.value);
  const moods = [...document.querySelectorAll('input[name="mood"]:checked')].map(input => input.value);
  const distance = document.querySelector('input[name="distance"]:checked')?.value || 'Familiar Territory';
  const selectedGenres = genres.length ? genres : ['Sorpresa'];
  const loop = { artists, genres: selectedGenres, languages, moods, distance, picks: [] };
  const originalLabel = nextButton.innerHTML;
  nextButton.disabled = true;
  nextButton.textContent = 'BUSCANDO TU PRÓXIMO LOOP…';
  error.textContent = '';
  try {
    loop.picks = window.UnloopSpotify?.isConnected()
      ? await window.UnloopSpotify.getSurveyRecommendations(loop)
      : await getCatalogRecommendations(loop);
  } catch (cause) {
    error.textContent = cause.message || 'No hemos podido encontrar canciones ahora. Inténtalo otra vez.';
    return;
  } finally {
    nextButton.disabled = false;
    nextButton.innerHTML = originalLabel;
  }
  window.unloopPending = loop;
  const artistsText = artists.length ? escapeHtml(artists.join(', ')) : 'Tus respuestas';
  const moodText = moods.length ? moods.join(' · ') : 'Curiosidad';
  const picks = loop.picks.map((pick, index) => `<a class="recommendation" href="${escapeHtml(pick.spotifyUrl || pick.catalogUrl || '#')}" target="_blank" rel="noopener noreferrer"><span class="pick-index">0${index + 1}</span>${pick.artwork ? `<img class="recommendation-art" src="${escapeHtml(pick.artwork)}" alt="" loading="lazy">` : ''}<span class="recommendation-copy"><strong>${escapeHtml(pick.artist)}</strong><small>${escapeHtml(pick.song)}</small></span><span class="pick-note">↗</span></a>`).join('');
  const languageText = languages.length ? languages.join(' · ') : 'Cualquier idioma';
  const catalogLabel = window.UnloopSpotify?.isConnected() ? 'PISTAS DE SPOTIFY' : 'PISTAS DEL CATÁLOGO MUSICAL';
  document.querySelector('#result-details').innerHTML = `<p class="result-summary">Partimos de <strong>${artistsText}</strong>, los sonidos <strong>${selectedGenres.join(', ')}</strong> y el mood <strong>${moodText}</strong>. Idiomas: <strong>${languageText}</strong>. Camino: <strong>${distance}</strong>.</p><p class="result-kicker">${catalogLabel} · ${selectedGenres.join(' / ').toUpperCase()}</p><div class="recommendation-list">${picks}</div>`;
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

// Navegación global y scroll 03 · Despliegue exclusivo de niveles
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

// Acceso y entrada al espacio personal
const loginDialog = document.querySelector('#login-dialog');
const loginMessage = document.querySelector('#login-message');
document.querySelector('#sign-in-link').addEventListener('click', event => {
  event.preventDefault();
  if (window.UnloopSpotify?.isConnected() || window.UnloopAuth?.isConnected()) {
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
document.querySelector('#save-loop-button').addEventListener('click', () => window.UnloopSpotify?.saveSurveyLoop());
