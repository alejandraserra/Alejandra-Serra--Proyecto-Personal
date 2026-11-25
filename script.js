// Scroll 02 · Encuesta, preguntas y resultados
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
  return String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
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
const relatedGenres = {
  Pop: ['indie pop', 'alternative r&b'], Indie: ['alternative', 'indie pop'],
  'R&B': ['soul', 'alternative pop'], Electrónica: ['dance', 'ambient'],
  'Hip-hop': ['alternative hip hop', 'neo soul'], Rock: ['indie rock', 'alternative'],
  Jazz: ['neo soul', 'alternative r&b'], Sorpresa: ['alternative', 'world music']
};
const comfortBreakers = {
  Pop: ['jazz', 'ambient'], Indie: ['r&b', 'electronic'], 'R&B': ['indie rock', 'folk'],
  Electrónica: ['soul', 'indie'], 'Hip-hop': ['jazz', 'indie pop'], Rock: ['neo soul', 'electronic'],
  Jazz: ['hip hop', 'indie pop'], Sorpresa: ['latin alternative', 'neo soul']
};
function genreFamily(value = '') {
  const genre = value.toLocaleLowerCase();
  if (/hip.?hop|rap/.test(genre)) return 'hiphop';
  if (/r.?&.?b|soul/.test(genre)) return 'rnb';
  if (/ambient/.test(genre)) return 'ambient';
  if (/electronic|electronica|dance|house|techno/.test(genre)) return 'electronic';
  if (/jazz|blues/.test(genre)) return 'jazz';
  if (/rock|punk|metal/.test(genre)) return 'rock';
  if (/pop/.test(genre)) return 'pop';
  if (/indie|alternative|folk|singer.?songwriter/.test(genre)) return 'indie';
  if (/latin|world|reggaeton/.test(genre)) return 'latin';
  if (/classical|orchestral/.test(genre)) return 'classical';
  if (/country/.test(genre)) return 'country';
  return '';
}

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

async function searchCatalogEntity(term, entity, limit = 18) {
  const params = new URLSearchParams({ term, entity, limit: String(limit), country: 'ES' });
  return searchMusicCatalog(params);
}

async function getCatalogRecommendations(loop) {
  const favorites = new Set(loop.artists.map(name => name.trim().toLocaleLowerCase()));
  const artistSeeds = (await Promise.all(loop.artists.map(async name => {
    try {
      const matches = await searchCatalogEntity(name, 'musicArtist', 5);
      const wanted = name.trim().toLocaleLowerCase();
      return matches.find(item => item.artistName?.toLocaleLowerCase() === wanted) || matches[0] || null;
    } catch { return null; }
  }))).filter(Boolean);
  const chosen = loop.genres.length ? loop.genres : ['Sorpresa'];
  const artistGenres = artistSeeds.map(item => item.primaryGenreName).filter(Boolean);
  const selectedFamilies = chosen.map(genre => genreFamily(genre) || genreFamily(catalogTerms[genre])).filter(Boolean);
  const seedFamilies = artistGenres.map(genreFamily).filter(Boolean);
  const adjacentFamilies = (relatedGenres[chosen[0]] || []).map(genreFamily).filter(Boolean);
  const adventurousFamilies = (comfortBreakers[chosen[0]] || []).map(genreFamily).filter(Boolean);
  const baseGenres = [...new Set([
    ...chosen.slice(0, 2).map(genre => catalogTerms[genre] || genre.toLowerCase()),
    ...artistGenres.slice(0, 2).map(genre => genre.toLowerCase())
  ])];
  let discoveryGenres = baseGenres;
  if (loop.distance === 'Crossover') {
    discoveryGenres = [...new Set([...baseGenres.slice(0, 1), ...(relatedGenres[chosen[0]] || ['alternative', 'indie'])])];
  }
  if (loop.distance === 'Out of Comfort') {
    discoveryGenres = [...new Set([...(comfortBreakers[chosen[0]] || ['alternative', 'world music']), ...artistGenres.slice(0, 1).map(genre => `alternative ${genre.toLowerCase()}`)])];
  }
  if (!discoveryGenres.length) discoveryGenres = ['alternative music'];

  const mood = [...new Set(loop.moods.map(value => moodTerms[value]).filter(Boolean))].slice(0, 2);
  const languages = [...new Set(loop.languages.map(value => languageTerms[value]).filter(Boolean))].slice(0, 2);
  const suffix = [...mood, ...languages].join(' ');
  const songSearchTerms = discoveryGenres.slice(0, 3).map(genre => [genre, suffix].filter(Boolean).join(' '));
  const albumLanguage = [...new Set(loop.languages.map(value => languageTerms[value]).filter(Boolean))].slice(0, 2);
  const albumSearchTerms = discoveryGenres.slice(0, 2).map(genre => [genre, ...albumLanguage].join(' '));
  const requestGroup = async (entity, terms) => (await Promise.all(terms.map(async term => {
    try { return await searchCatalogEntity(term, entity, 25); } catch { return []; }
  }))).flat();
  const [trackResults, albumResults] = await Promise.all([
    requestGroup('song', songSearchTerms), requestGroup('album', albumSearchTerms)
  ]);
  const unique = (items, key, limit) => [...new Map(items.filter(item => item[key]).map(item => [item[key], item])).values()].slice(0, limit);
  const allowedFamilies = new Set(loop.distance === 'Familiar Territory'
    ? [...selectedFamilies, ...seedFamilies]
    : loop.distance === 'Crossover'
      ? [...selectedFamilies, ...seedFamilies, ...adjacentFamilies]
      : adventurousFamilies);
  const inChosenMusicWorld = item => {
    const family = genreFamily(item.primaryGenreName || item.genreName);
    return Boolean(family && allowedFamilies.has(family));
  };
  const relevance = item => {
    const family = genreFamily(item.primaryGenreName || item.genreName);
    if (family && selectedFamilies.includes(family)) return 3;
    if (family && seedFamilies.includes(family)) return 2;
    if (family && allowedFamilies.has(family)) return 1;
    return 0;
  };
  const tracks = unique(trackResults.filter(item => item.trackName && item.artistName && item.trackViewUrl && inChosenMusicWorld(item))
    .filter(item => !favorites.has(item.artistName.toLocaleLowerCase()))
    .filter(item => !/karaoke|tribute|cover version/i.test(item.trackName))
    .sort((a, b) => relevance(b) - relevance(a)), 'trackId', 12);
  const albums = unique(albumResults.filter(item => item.collectionName && item.artistName && item.collectionViewUrl && inChosenMusicWorld(item))
    .filter(item => !/\bsingle\b|work music|office|energetic|music for dogs|various artists|songs from and inspired by|karaoke|tribute/i.test(item.collectionName))
    .filter(item => !/various artists|varios artistas|compilation/i.test(item.artistName))
    .filter(item => !favorites.has(item.artistName.toLocaleLowerCase())), 'collectionId', 8);
  const recommendedArtists = unique([
    ...tracks.map(item => ({
      artistName: item.artistName, artistId: item.artistId, artistLinkUrl: item.artistViewUrl,
      artworkUrl100: item.artworkUrl100, primaryGenreName: item.primaryGenreName
    })),
    ...albums.map(item => ({
      artistName: item.artistName, artistId: item.artistId, artistLinkUrl: item.artistViewUrl,
      artworkUrl100: item.artworkUrl100, primaryGenreName: item.primaryGenreName
    }))
  ].filter(item => item.artistName && item.artistLinkUrl && inChosenMusicWorld(item))
    .filter(item => !favorites.has(item.artistName.toLocaleLowerCase())), 'artistName', 8);
  const picks = tracks.slice(0, 8).map(track => ({
    artist: track.artistName, song: track.trackName, catalogUrl: track.trackViewUrl,
    artwork: track.artworkUrl100?.replace('100x100', '600x600') || track.artworkUrl100 || '',
    preview: track.previewUrl || ''
  }));
  const albumPicks = albums.map(album => ({
    artist: album.artistName, title: album.collectionName, catalogUrl: album.collectionViewUrl,
    artwork: album.artworkUrl100?.replace('100x100', '600x600') || album.artworkUrl100 || '',
    detail: album.primaryGenreName || album.releaseDate?.slice(0, 4) || 'Álbum'
  }));
  const artistPicks = recommendedArtists.map(artist => ({
    artist: artist.artistName, catalogUrl: artist.artistLinkUrl,
    artwork: artist.artworkUrl100?.replace('100x100', '600x600') || artist.artworkUrl100 || '',
    detail: artist.primaryGenreName || 'Artista para explorar'
  }));
  if (!picks.length && !albumPicks.length && !artistPicks.length) throw new Error('No encontramos recomendaciones para esta combinación. Prueba con otro artista o estilo.');
  if (!picks.length) throw new Error('Ahora mismo no encontramos canciones para reproducir. Cambia alguna respuesta e inténtalo otra vez.');
  return { picks, albums: albumPicks, artists: artistPicks, artistSeeds, discoveryGenres };
}

function renderSongCards(picks) {
  return picks.map((pick, index) => `<article class="cover-card${index === 2 ? ' cover-card-featured' : ''}">
    <a class="cover-link" href="${escapeHtml(pick.catalogUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Abrir ${escapeHtml(pick.song)} de ${escapeHtml(pick.artist)} en Apple Music">
      ${pick.artwork ? `<img src="${escapeHtml(pick.artwork)}" alt="Portada de ${escapeHtml(pick.song)}" loading="lazy">` : '<span class="cover-fallback">UN<br>LOOP</span>'}
      <span class="cover-shade"></span><span class="cover-kind">CANCIÓN · 0${index + 1}</span>
      <span class="cover-copy"><strong>${escapeHtml(pick.song)}</strong><small>${escapeHtml(pick.artist)}</small></span>
    </a>
    <button type="button" class="cover-play" data-preview-index="${index}" ${pick.preview ? '' : 'disabled'} aria-label="${pick.preview ? `Escuchar vista previa de ${escapeHtml(pick.song)}` : `Vista previa no disponible de ${escapeHtml(pick.song)}`}" title="${pick.preview ? 'Escuchar fragmento' : 'Vista previa no disponible'}">${pick.preview ? '▶' : '↗'}</button>
  </article>`).join('');
}

function renderMiniCards(items, kind) {
  return items.map((item, index) => `<a class="mini-music-card" href="${escapeHtml(item.catalogUrl)}" target="_blank" rel="noopener noreferrer">
    <span class="mini-art">${item.artwork ? `<img src="${escapeHtml(item.artwork)}" alt="" loading="lazy">` : '<i>UN<br>LOOP</i>'}</span>
    <span class="mini-copy"><small>${kind} · 0${index + 1}</small><strong>${escapeHtml(item.title || item.artist)}</strong><span>${escapeHtml(item.title ? item.artist : item.detail)}</span></span><b>↗</b>
  </a>`).join('');
}

const previewAudio = document.querySelector('#preview-audio');
let activePreviewPicks = [];
let activePreviewIndex = 0;
function selectPreview(index, autoplay = true) {
  if (!activePreviewPicks.length) return;
  activePreviewIndex = (index + activePreviewPicks.length) % activePreviewPicks.length;
  const pick = activePreviewPicks[activePreviewIndex];
  document.querySelector('#player-art').src = pick.artwork || '';
  document.querySelector('#player-art').hidden = !pick.artwork;
  document.querySelector('#player-title').textContent = pick.song;
  document.querySelector('#player-artist').textContent = pick.artist;
  document.querySelector('#player-link').href = pick.catalogUrl;
  const playButton = document.querySelector('#player-toggle');
  if (!pick.preview) {
    previewAudio.pause(); previewAudio.removeAttribute('src');
    playButton.disabled = true; playButton.textContent = '—';
    document.querySelector('#player-status').textContent = 'Sin fragmento · abre en Apple Music';
    return;
  }
  playButton.disabled = false; playButton.textContent = '▶';
  document.querySelector('#player-status').textContent = 'VISTA PREVIA · 30 S';
  previewAudio.src = pick.preview; previewAudio.currentTime = 0;
  if (autoplay) previewAudio.play().then(() => { playButton.textContent = 'Ⅱ'; }).catch(() => {});
}

document.querySelector('#player-toggle').addEventListener('click', async () => {
  const pick = activePreviewPicks[activePreviewIndex];
  if (!pick?.preview) return;
  if (previewAudio.paused) {
    try { await previewAudio.play(); document.querySelector('#player-toggle').textContent = 'Ⅱ'; }
    catch { document.querySelector('#player-status').textContent = 'No se pudo reproducir el fragmento'; }
  } else { previewAudio.pause(); document.querySelector('#player-toggle').textContent = '▶'; }
});
document.querySelector('#player-prev').addEventListener('click', () => selectPreview(activePreviewIndex - 1));
document.querySelector('#player-next').addEventListener('click', () => selectPreview(activePreviewIndex + 1));
document.querySelector('#track-recommendations').addEventListener('click', event => {
  const button = event.target.closest('[data-preview-index]');
  if (button && !button.disabled) selectPreview(Number(button.dataset.previewIndex));
});
previewAudio.addEventListener('ended', () => selectPreview(activePreviewIndex + 1));
previewAudio.addEventListener('timeupdate', () => {
  const progress = previewAudio.duration ? previewAudio.currentTime / previewAudio.duration * 100 : 0;
  document.querySelector('#player-progress').style.width = `${progress}%`;
});

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
    const catalog = await getCatalogRecommendations(loop);
    loop.picks = catalog.picks;
    loop.albums = catalog.albums;
    loop.recommendedArtists = catalog.artists;
    loop.artistSeeds = catalog.artistSeeds.map(item => item.artistName);
  } catch (cause) {
    error.textContent = cause.message || 'No hemos podido encontrar canciones ahora. Inténtalo otra vez.';
    return;
  } finally {
    nextButton.disabled = false;
    nextButton.innerHTML = originalLabel;
  }
  window.unloopPending = loop;
  const artistsText = artists.length ? escapeHtml(artists.join(', ')) : 'tus respuestas';
  const moodText = moods.length ? moods.join(' · ') : 'Curiosidad';
  const languageText = languages.length ? languages.join(' · ') : 'Cualquier idioma';
  document.querySelector('#result-details').innerHTML = `<p class="result-summary">Tu punto de partida: <strong>${artistsText}</strong> · <strong>${escapeHtml(selectedGenres.join(', '))}</strong> · <strong>${escapeHtml(moodText)}</strong> · <strong>${escapeHtml(languageText)}</strong> · <strong>${escapeHtml(distance)}</strong>.</p>`;
  document.querySelector('#track-recommendations').innerHTML = renderSongCards(loop.picks);
  document.querySelector('#album-recommendations').innerHTML = loop.albums.length ? renderMiniCards(loop.albums, 'ÁLBUM') : '<p class="catalog-empty">Prueba con otro estilo para encontrar más álbumes.</p>';
  document.querySelector('#artist-recommendations').innerHTML = loop.recommendedArtists.length ? renderMiniCards(loop.recommendedArtists, 'ARTISTA') : '<p class="catalog-empty">Prueba con otro estilo para encontrar más artistas.</p>';
  activePreviewPicks = loop.picks; selectPreview(0, false);
  document.querySelector('#player-progress').style.width = '0%';
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
  document.body.classList.toggle('menu-open', open);
  menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
});
function closeMenu() {
  menuPanel.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
  menuButton.setAttribute('aria-label', 'Abrir menú');
}
document.querySelector('#menu-close').addEventListener('click', closeMenu);
menuPanel.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

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
