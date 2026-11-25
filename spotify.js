(() => {
  const config = window.UNLOOP_CONFIG || {};
  const clientId = config.spotifyClientId?.trim();
  const redirectUri = config.spotifyRedirectUri || `${location.origin}${location.pathname}`;
  const scope = 'user-read-private playlist-read-private playlist-modify-private playlist-modify-public';
  // Persistir la sesión local del navegador permite volver a Mi espacio.
  let storage;
  try { storage = window.localStorage; } catch { storage = window.sessionStorage; }
  const loginDialog = document.querySelector('#login-dialog');
  const loginMessage = document.querySelector('#login-message');
  const accountPanel = document.querySelector('#account-panel');
  const loginLink = document.querySelector('#sign-in-link');
  const loopMemoryKey = 'unloop_saved_loop_data';
  let currentProfile = null;

  const spotifyButton = document.createElement('button');
  spotifyButton.type = 'button';
  spotifyButton.id = 'spotify-connect';
  spotifyButton.className = 'spotify-connect';
  spotifyButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="#1ed760"/><path d="M5.35 8.65c4.15-1.2 9.55-.9 13.15 1.25M6.05 12.05c3.45-1 7.85-.7 10.85 1.05M6.75 15.25c2.65-.7 5.8-.45 8.15.8" fill="none" stroke="#07120a" stroke-width="1.45" stroke-linecap="round"/></svg><span>CONECTAR CON SPOTIFY</span>';
  document.querySelector('#login-title').after(spotifyButton);

  function announce(message) {
    loginMessage.textContent = message;
  }

  // Acceso opcional con Spotify (OAuth PKCE).
  function randomString(length) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const bytes = crypto.getRandomValues(new Uint8Array(length));
    return [...bytes].map(byte => alphabet[byte % alphabet.length]).join('');
  }

  async function challengeFor(verifier) {
    const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
    return btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  }

  async function beginAuthorization() {
    if (!clientId) {
      announce('Para activar Spotify, añade el Client ID de tu app en config.js.');
      return;
    }
    if (location.protocol === 'file:') {
      announce('Abre UNLOOP desde su dirección web para conectar Spotify.');
      return;
    }
    const verifier = randomString(96);
    const state = randomString(32);
    storage.setItem('unloop_spotify_verifier', verifier);
    storage.setItem('unloop_spotify_state', state);
    const params = new URLSearchParams({
      client_id: clientId,
      response_type: 'code',
      redirect_uri: redirectUri,
      scope,
      state,
      code_challenge_method: 'S256',
      code_challenge: await challengeFor(verifier)
    });
    location.assign(`https://accounts.spotify.com/authorize?${params}`);
  }

  async function exchangeCode(code) {
    const verifier = storage.getItem('unloop_spotify_verifier');
    if (!verifier) throw new Error('No se encontró la clave temporal de acceso. Vuelve a conectar Spotify.');
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        code_verifier: verifier
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error_description || 'Spotify no ha podido completar la conexión.');
    storage.setItem('unloop_spotify_access', data.access_token);
    storage.setItem('unloop_spotify_expiry', String(Date.now() + data.expires_in * 1000));
    if (data.refresh_token) storage.setItem('unloop_spotify_refresh', data.refresh_token);
    storage.removeItem('unloop_spotify_verifier');
    storage.removeItem('unloop_spotify_state');
  }

  async function getAccessToken() {
    const token = storage.getItem('unloop_spotify_access');
    const expiry = Number(storage.getItem('unloop_spotify_expiry') || 0);
    if (token && expiry - Date.now() > 60000) return token;
    const refresh = storage.getItem('unloop_spotify_refresh');
    if (!refresh || !clientId) throw new Error('Tu sesión de Spotify ha caducado. Vuelve a conectarla.');
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ client_id: clientId, grant_type: 'refresh_token', refresh_token: refresh })
    });
    const data = await response.json();
    if (!response.ok) throw new Error('Tu sesión de Spotify ha caducado. Vuelve a conectarla.');
    storage.setItem('unloop_spotify_access', data.access_token);
    storage.setItem('unloop_spotify_expiry', String(Date.now() + data.expires_in * 1000));
    if (data.refresh_token) storage.setItem('unloop_spotify_refresh', data.refresh_token);
    return data.access_token;
  }

  async function spotify(path, options = {}) {
    const request = token => fetch(`https://api.spotify.com/v1${path}`, {
      ...options,
      headers: { Authorization: `Bearer ${token}`, ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers }
    });
    let response = await request(await getAccessToken());
    if (response.status === 401 && storage.getItem('unloop_spotify_refresh')) {
      storage.removeItem('unloop_spotify_access');
      response = await request(await getAccessToken());
    }
    if (!response.ok) {
      if (response.status === 401) storage.removeItem('unloop_spotify_access');
      const message = response.status === 403
        ? 'Spotify ha rechazado el permiso. Revisa los permisos de la app y vuelve a conectar tu cuenta.'
        : response.status === 429
          ? 'Spotify está recibiendo muchas peticiones. Espera un momento e inténtalo de nuevo.'
          : `Spotify respondió con el código ${response.status}.`;
      const error = new Error(message);
      error.status = response.status;
      throw error;
    }
    return response.status === 204 ? null : response.json();
  }

  async function connectAccount() {
    try {
      await beginAuthorization();
    } catch (error) {
      announce(error.message);
    }
  }

  async function handleCallback() {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    if (!code && !params.has('error')) return;
    const state = params.get('state');
    if (params.has('error')) announce('Has cancelado la conexión con Spotify.');
    else if (!state || state !== storage.getItem('unloop_spotify_state')) announce('No se pudo validar la conexión. Vuelve a intentarlo.');
    else {
      try {
        await exchangeCode(code);
        await loadAccount();
        loginDialog.close();
        const action = storage.getItem('unloop_after_auth');
        storage.removeItem('unloop_after_auth');
        if (action === 'save') {
          const savedLoop = JSON.parse(storage.getItem('unloop_pending_loop') || 'null');
          const targetPlaylist = storage.getItem('unloop_pending_playlist') || '';
          if (savedLoop) await saveLoop(savedLoop, '', targetPlaylist);
          storage.removeItem('unloop_pending_loop');
          storage.removeItem('unloop_pending_playlist');
        }
      } catch (error) {
        announce(error.message);
        loginDialog.showModal();
      }
    }
    history.replaceState({}, document.title, `${location.pathname}${location.hash}`);
  }

  // Scroll 04 · Mi espacio, loops guardados y novedades.
  function addItem(container, title, subtitle, url, label = 'ABRIR EN SPOTIFY') {
    const item = document.createElement('article');
    item.className = 'account-item';
    const text = document.createElement('div');
    text.className = 'account-item-copy';
    const heading = document.createElement('strong');
    heading.textContent = title;
    const detail = document.createElement('small');
    detail.textContent = subtitle || '';
    text.append(heading, detail);
    const link = document.createElement('a');
    link.href = url || '#';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = label;
    item.append(text, link);
    container.append(item);
    return item;
  }

  function setEmpty(container, message) {
    container.replaceChildren();
    const note = document.createElement('p');
    note.className = 'empty-account';
    note.textContent = message;
    container.append(note);
  }

  async function loadAccount() {
    const profile = await spotify('/me');
    currentProfile = profile;
    document.querySelector('#account-name').textContent = profile.display_name || 'melómana';
    loginLink.textContent = 'MI CUENTA';
    accountPanel.hidden = false;
    document.querySelector('#spotify-link-status').textContent = 'Spotify conectado. Tus loops y playlists se guardan en esta cuenta.';
    document.querySelector('#connect-spotify-from-account').hidden = true;
    document.querySelector('#create-from-tops').hidden = false;
    if (loginDialog.open) loginDialog.close();
    document.querySelector('#save-loop-button').textContent = 'GUARDAR ESTE LOOP EN SPOTIFY ↗';
    await loadSavedLoops();
  }

  async function loadSavedLoops() {
    const loopList = document.querySelector('#saved-loop-list');
    const news = document.querySelector('#artist-news');
    setEmpty(loopList, 'Buscando tus loops guardados…');
    setEmpty(news, 'Buscando novedades de tus artistas…');
    try {
      const data = await spotify('/me/playlists?limit=50');
      const allPlaylists = data.items || [];
      const targetSelect = document.querySelector('#save-target-playlist');
      const selectedTarget = targetSelect.value;
      targetSelect.replaceChildren(new Option('Crear una playlist privada nueva', ''));
      allPlaylists.forEach(list => targetSelect.add(new Option(list.name, list.id)));
      if (allPlaylists.some(list => list.id === selectedTarget)) targetSelect.value = selectedTarget;
      const playlists = allPlaylists.filter(list => list.name.startsWith('UNLOOP ·'));
      loopList.replaceChildren();
      if (!playlists.length) setEmpty(loopList, 'Aún no tienes loops guardados. Completa la encuesta y guarda el primero.');
      else playlists.slice(0, 12).forEach(list => addItem(loopList, list.name.replace('UNLOOP · ', ''), `${list.tracks?.total ?? list.items?.total ?? 0} canciones · Playlist privada`, list.external_urls?.spotify));
      await loadArtistNews();
    } catch (error) {
      setEmpty(loopList, error.message);
      setEmpty(news, 'Conecta Spotify y da permiso para leer tus playlists privadas.');
    }
  }

  function readLoopMemory() {
    try { return JSON.parse(storage.getItem(loopMemoryKey) || '[]'); } catch { return []; }
  }

  function rememberLoop(loop, playlist) {
    const entries = readLoopMemory().filter(item => item.playlistId !== playlist.id);
    entries.unshift({ playlistId: playlist.id, name: playlist.name, artists: loop.artists || [], genres: loop.genres || [], languages: loop.languages || [], moods: loop.moods || [], distance: loop.distance || '' });
    storage.setItem(loopMemoryKey, JSON.stringify(entries.slice(0, 50)));
  }

  async function lookupArtists(names) {
    const lookups = await Promise.all([...new Set(names)].slice(0, 8).map(async name => {
      const params = new URLSearchParams({ q: `artist:"${name}"`, type: 'artist', limit: '1' });
      return (await spotify(`/search?${params}`)).artists?.items?.[0] || null;
    }));
    return lookups.filter(Boolean);
  }

  async function loadArtistNews() {
    const container = document.querySelector('#artist-news');
    const names = [...new Set(readLoopMemory().flatMap(loop => loop.artists || []))];
    if (!names.length) return setEmpty(container, 'Cuando guardes una encuesta con tus artistas favoritos, podrás consultar aquí sus lanzamientos recientes.');
    const artists = await lookupArtists(names);
    if (!artists.length) return setEmpty(container, 'No encontramos los artistas guardados en el catálogo de Spotify.');
    const releases = [];
    for (const artist of artists) {
      try {
        const data = await spotify(`/artists/${encodeURIComponent(artist.id)}/albums?include_groups=album,single&limit=5&market=ES`);
        for (const album of data.items || []) releases.push({ ...album, loopArtist: artist.name });
      } catch (error) {
        console.warn(`No se pudieron consultar los lanzamientos de ${artist.name}.`, error);
      }
    }
    const unique = [...new Map(releases.map(album => [album.id, album])).values()].sort((a,b) => String(b.release_date).localeCompare(String(a.release_date))).slice(0,10);
    container.replaceChildren();
    if (!unique.length) return setEmpty(container, 'Spotify no ha devuelto lanzamientos recientes para estos artistas.');
    unique.forEach(album => addItem(container, album.name, `${album.artists.map(a => a.name).join(', ')} · ${album.release_date}`, album.external_urls?.spotify, 'ESCUCHAR'));
  }

  // Encuesta · Guardar y crear loops en playlists privadas.
  async function findSpotifyTrack(pick) {
    if (pick.uri && pick.uri.startsWith('spotify:track:')) {
      return { id: pick.id || pick.uri.split(':').pop(), uri: pick.uri };
    }
    const q = `track:"${pick.song}" artist:"${pick.artist}"`;
    const params = new URLSearchParams({ q, type: 'track', limit: '1' });
    const result = await spotify(`/search?${params}`);
    if (result.tracks?.items?.length) return result.tracks.items[0];
    const backup = new URLSearchParams({ q: `${pick.song} ${pick.artist}`, type: 'track', limit: '1' });
    return (await spotify(`/search?${backup}`)).tracks?.items?.[0] || null;
  }

  // Encuesta · pistas reales de Spotify filtradas por las respuestas.
  async function getSurveyRecommendations(loop) {
    const names = [...new Set((loop.artists || []).map(name => name.trim()).filter(Boolean))].slice(0, 3);
    const artistLookups = await Promise.all(names.map(async name => {
      const query = new URLSearchParams({ q: `artist:"${name}"`, type: 'artist', limit: '1' });
      return (await spotify(`/search?${query}`)).artists?.items?.[0] || null;
    }));
    const matchedNames = artistLookups.filter(Boolean).map(artist => artist.name.toLocaleLowerCase());
    if (names.length && !matchedNames.length) throw new Error('No encontramos esos artistas en Spotify. Comprueba cómo se escriben e inténtalo otra vez.');
    const genreTerms = { Pop: 'pop', Indie: 'indie', 'R&B': 'r-n-b', Electrónica: 'electronic', 'Hip-hop': 'hip-hop', Rock: 'rock', Jazz: 'jazz', Sorpresa: 'alternative' };
    const nearby = { Pop: ['indie', 'r-n-b'], Indie: ['alt-rock', 'indie-pop'], 'R&B': ['soul', 'pop'], Electrónica: ['dance', 'ambient'], 'Hip-hop': ['r-n-b', 'alternative'], Rock: ['indie', 'punk'], Jazz: ['soul', 'blues'], Sorpresa: ['indie', 'alternative'] };
    const selected = (loop.genres || []).map(genre => genreTerms[genre]).filter(Boolean);
    const available = [...new Set(Object.values(genreTerms).filter(genre => !selected.includes(genre)))];
    let queryGenres = selected.length ? selected.slice(0, 3) : ['alternative'];
    if (loop.distance === 'Familiar Territory') queryGenres = queryGenres.slice(0, 1);
    if (loop.distance === 'Crossover') queryGenres = [...new Set([
      ...queryGenres.slice(0, 1), ...(nearby[loop.genres?.[0]] || ['indie', 'alternative']).slice(0, 2)
    ])];
    if (loop.distance === 'Out of Comfort') {
      queryGenres = [...available].sort(() => Math.random() - 0.5).slice(0, 2);
    }
    const moodWords = { Desconectar: 'calm', Energía: 'energetic', Acompañamiento: 'soft', Inspiración: 'uplifting', Movimiento: 'dance', Todo: '' };
    const languageWords = { Español: 'Spanish', Inglés: 'English', 'Otros idiomas': 'international' };
    const mood = (loop.moods || []).map(answer => moodWords[answer]).find(Boolean) || '';
    const language = (loop.languages || []).map(answer => languageWords[answer]).find(Boolean) || '';
    const querySuffix = [mood, language].filter(Boolean).join(' ');
    const favoriteNames = new Set([...names.map(name => name.toLocaleLowerCase()), ...matchedNames]);
    const searches = await Promise.all(queryGenres.map(async genre => {
      const queryText = [`genre:"${genre}"`, querySuffix].filter(Boolean).join(' ');
      const query = new URLSearchParams({ q: queryText, type: 'track', limit: '10', market: 'ES' });
      const response = await spotify(`/search?${query}`);
      return response.tracks?.items || [];
    }));
    let tracks = searches.flat().filter(track =>
      track.artists?.every(person => !favoriteNames.has(person.name.toLocaleLowerCase()))
    );
    tracks = [...new Map(tracks.map(track => [track.id, track])).values()];
    if (loop.distance === 'Out of Comfort') tracks.sort(() => Math.random() - 0.5);
    tracks = tracks.slice(0, 4);
    if (!tracks.length) throw new Error('Spotify no ha devuelto canciones nuevas para este loop. Cambia de artista o inténtalo de nuevo.');
    return tracks.map(track => ({
      id: track.id,
      uri: track.uri,
      artist: track.artists?.map(artist => artist.name).join(', ') || 'Artista',
      song: track.name,
      spotifyUrl: track.external_urls?.spotify,
      artwork: track.album?.images?.[2]?.url || track.album?.images?.[0]?.url || ''
    }));
  }

  async function saveLoop(loop, customName, targetPlaylistId = '') {
    const message = document.querySelector('#save-loop-message');
    message.textContent = 'Buscando las canciones en Spotify…';
    try {
      const tracks = [];
      for (const pick of loop.picks || []) {
        const track = await findSpotifyTrack(pick);
        if (track && !tracks.some(item => item.id === track.id)) tracks.push(track);
      }
      if (!tracks.length) throw new Error('No encontramos estas canciones en Spotify. Prueba a crear otro loop.');
      const date = new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short' }).format(new Date());
      const name = customName || `UNLOOP · ${loop.distance || 'Crossover'} · ${date}`;
      const description = `Loop de UNLOOP · ${loop.distance || 'Crossover'} · Estilos: ${(loop.genres || []).join(', ')} · Mood: ${(loop.moods || []).join(', ') || 'Curiosidad'} · Idiomas: ${(loop.languages || []).join(', ') || 'Cualquiera'} · Punto de partida: ${(loop.artists || []).join(', ')}`.slice(0, 290);
      const playlist = targetPlaylistId
        ? { id: targetPlaylistId, external_urls: { spotify: `https://open.spotify.com/playlist/${encodeURIComponent(targetPlaylistId)}` } }
        : await spotify('/me/playlists', { method: 'POST', body: JSON.stringify({ name, description, public: false }) });
      if (!playlist) throw new Error('No hemos podido preparar la playlist de Spotify.');
      await spotify(`/playlists/${encodeURIComponent(playlist.id)}/items`, { method: 'POST', body: JSON.stringify({ uris: tracks.map(track => track.uri) }) });
      rememberLoop(loop, { ...playlist, name });
      message.textContent = targetPlaylistId ? 'Pistas añadidas a tu playlist de Spotify.' : 'Loop guardado en una nueva playlist privada de Spotify.';
      const link = document.createElement('a');
      link.href = playlist.external_urls.spotify;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.className = 'saved-playlist-link';
      link.textContent = 'ABRIR PLAYLIST EN SPOTIFY ↗';
      message.append(' ', link);
      await loadSavedLoops();
      return playlist;
    } catch (error) {
      message.textContent = error.message;
      return null;
    }
  }

  async function saveSurveyLoop() {
    const loop = window.unloopPending;
    if (!loop) return;
    if (!isConnected()) {
      storage.setItem('unloop_pending_loop', JSON.stringify(loop));
      storage.setItem('unloop_pending_playlist', document.querySelector('#save-target-playlist').value);
      storage.setItem('unloop_after_auth', 'save');
      loginDialog.showModal();
      announce('Conecta Spotify para guardar este loop en una playlist privada.');
      return;
    }
    await saveLoop(loop, '', document.querySelector('#save-target-playlist').value);
  }

  async function createAnotherLoop() {
    const button = document.querySelector('#create-from-tops');
    button.disabled = true;
    button.textContent = 'BUSCANDO NUEVOS CAMINOS…';
    try {
      const history = readLoopMemory();
      const distanceOptions = ['Familiar Territory', 'Crossover', 'Out of Comfort'];
      const loopNumber = history.length;
      const distance = distanceOptions[loopNumber % distanceOptions.length];
      const previous = history[0];
      if (!previous) throw new Error('Completa la encuesta y guarda un loop para crear nuevas propuestas a partir de tus respuestas.');
      const loop = { artists: previous.artists, genres: previous.genres, languages: previous.languages, moods: previous.moods, distance, picks: await getSurveyRecommendations({ ...previous, distance }) };
      const playlist = await saveLoop(loop, `UNLOOP · ${distance} · Loop ${String(loopNumber+1).padStart(2,'0')}`);
      if (playlist) accountPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
      window.alert(error.message);
    } finally {
      button.disabled = false;
      button.innerHTML = 'CREAR Y GUARDAR UN NUEVO LOOP <span>↗</span>';
    }
  }

  // Mi espacio · Buscar conciertos por ciudad.
  async function searchConcerts(city) {
    const container = document.querySelector('#concert-results');
    const apiKey = config.ticketmasterApiKey?.trim();
    if (!city) return setEmpty(container, 'Escribe una ciudad para buscar conciertos.');
    if (!apiKey) return setEmpty(container, 'Añade tu clave de Ticketmaster Discovery API a config.js para activar esta búsqueda.');
    if (!isConnected()) return setEmpty(container, 'Conecta Spotify para buscar conciertos de los artistas de tus loops.');
    setEmpty(container, 'Buscando conciertos…');
    try {
      const artistNames = [...new Set(readLoopMemory().flatMap(loop => loop.artists || []))].slice(0, 6);
      if (!artistNames.length) return setEmpty(container, 'Guarda primero una encuesta con tus artistas para buscar conciertos.');
      const events = [];
      for (const artistName of artistNames) {
        const params = new URLSearchParams({ apikey: apiKey, keyword: artistName, city, classificationName: 'music', size: '5' });
        const response = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?${params}`);
        if (!response.ok) continue;
        const data = await response.json();
        for (const event of data._embedded?.events || []) events.push(event);
      }
      const unique = [...new Map(events.map(event => [event.id, event])).values()].sort((a,b) => String(a.dates?.start?.dateTime || a.dates?.start?.localDate).localeCompare(String(b.dates?.start?.dateTime || b.dates?.start?.localDate)));
      container.replaceChildren();
      if (!unique.length) return setEmpty(container, `No hemos encontrado eventos de tus artistas en ${city}.`);
      unique.slice(0,12).forEach(event => {
        const venue = event._embedded?.venues?.[0];
        const date = event.dates?.start?.localDate || 'Fecha por confirmar';
        addItem(container, event.name, `${date} · ${venue?.name || city}`, event.url, 'ENTRADAS ↗');
      });
    } catch (error) {
      setEmpty(container, `No se pudieron cargar los conciertos: ${error.message}`);
    }
  }

  function isConnected() { return Boolean(storage.getItem('unloop_spotify_access') || storage.getItem('unloop_spotify_refresh')); }

  async function logout() {
    try { await window.UnloopAuth?.logout(); } catch { /* La conexión musical puede cerrarse aunque falle el otro proveedor. */ }
    ['unloop_spotify_access','unloop_spotify_refresh','unloop_spotify_expiry','unloop_spotify_state','unloop_spotify_verifier'].forEach(key => storage.removeItem(key));
    currentProfile = null;
    loginLink.textContent = 'INICIA SESIÓN';
    accountPanel.hidden = true;
    document.querySelector('#spotify-link-status').textContent = 'Conecta Spotify para guardar y ver tus loops personales.';
    document.querySelector('#connect-spotify-from-account').hidden = false;
    document.querySelector('#create-from-tops').hidden = true;
    document.querySelector('#login-dialog').showModal();
    announce('Has cerrado tu sesión de UNLOOP en este navegador. Tus playlists siguen en Spotify.');
  }

  spotifyButton.addEventListener('click', connectAccount);
  document.querySelector('#create-from-tops').addEventListener('click', createAnotherLoop);
  document.querySelector('#logout-button').addEventListener('click', logout);
  document.querySelector('#concert-form').addEventListener('submit', event => {
    event.preventDefault();
    searchConcerts(document.querySelector('#concert-city').value.trim());
  });

  window.UnloopSpotify = { isConnected, saveSurveyLoop, createAnotherLoop, searchConcerts, logout, getSurveyRecommendations };
  handleCallback();
  if (isConnected() && !new URLSearchParams(location.search).has('code')) loadAccount().catch(error => announce(error.message));
})();
