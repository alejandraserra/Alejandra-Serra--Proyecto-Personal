(() => {
  const config = window.UNLOOP_CONFIG || {};
  const clientId = config.spotifyClientId?.trim();
  const redirectUri = config.spotifyRedirectUri || `${location.origin}${location.pathname}`;
  const scope = 'user-read-private user-top-read playlist-read-private playlist-modify-private';
  const storage = sessionStorage;
  const loginDialog = document.querySelector('#login-dialog');
  const loginMessage = document.querySelector('#login-message');
  const accountPanel = document.querySelector('#account-panel');
  const loginLink = document.querySelector('#sign-in-link');
  const artistsById = new Map();
  let currentProfile = null;

  const spotifyButton = document.createElement('button');
  spotifyButton.type = 'button';
  spotifyButton.id = 'spotify-connect';
  spotifyButton.className = 'spotify-connect';
  spotifyButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#1ed760"/><path d="M5.1 9.2c4.4-1.3 9.9-.9 13.5 1.3.4.3.5.8.3 1.2-.3.4-.8.5-1.2.3-3.2-1.9-8.1-2.3-11.9-1.1-.5.1-.9-.1-1-.6-.2-.4.1-.9.5-1.1Zm.2 3.4c3.8-1.2 8.2-.8 11.2 1 .4.2.5.7.3 1.1-.2.4-.7.5-1.1.3-2.6-1.6-6.5-1.9-9.8-1-.4.1-.8-.1-.9-.5-.1-.4.1-.8.5-.9Zm.3 3.2c3.1-.9 6.5-.6 9 .9.3.2.4.6.2.9-.2.3-.6.4-.9.2-2.1-1.3-5-1.6-7.8-.8-.3.1-.7-.1-.8-.4-.1-.3.1-.7.4-.8Z" fill="#07120a"/></svg><span>CONECTAR CON SPOTIFY</span>';
  document.querySelector('#login-title').after(spotifyButton);

  function announce(message) {
    loginMessage.textContent = message;
  }

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
    if (!response.ok) throw new Error('Vuelve a conectar tu cuenta de Spotify.');
    storage.setItem('unloop_spotify_access', data.access_token);
    storage.setItem('unloop_spotify_expiry', String(Date.now() + data.expires_in * 1000));
    if (data.refresh_token) storage.setItem('unloop_spotify_refresh', data.refresh_token);
    return data.access_token;
  }

  async function spotify(path, options = {}) {
    const token = await getAccessToken();
    const response = await fetch(`https://api.spotify.com/v1${path}`, {
      ...options,
      headers: { Authorization: `Bearer ${token}`, ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers }
    });
    if (!response.ok) {
      if (response.status === 401) storage.removeItem('unloop_spotify_access');
      const error = new Error(response.status === 403 ? 'Spotify no ha autorizado este permiso en la app.' : `Spotify respondió con el código ${response.status}.`);
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
          if (savedLoop) await saveLoop(savedLoop);
          storage.removeItem('unloop_pending_loop');
        }
      } catch (error) {
        announce(error.message);
        loginDialog.showModal();
      }
    }
    history.replaceState({}, document.title, `${location.pathname}${location.hash}`);
  }

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
      const playlists = (data.items || []).filter(list => list.name.startsWith('UNLOOP ·'));
      loopList.replaceChildren();
      if (!playlists.length) setEmpty(loopList, 'Aún no tienes loops guardados. Completa la encuesta y guarda el primero.');
      else playlists.slice(0, 12).forEach(list => addItem(loopList, list.name.replace('UNLOOP · ', ''), `${list.tracks?.total ?? list.items?.total ?? 0} canciones · Playlist privada`, list.external_urls?.spotify));
      await loadArtistNews(playlists.slice(0, 6));
    } catch (error) {
      setEmpty(loopList, error.message);
      setEmpty(news, 'Conecta Spotify y da permiso para leer tus playlists privadas.');
    }
  }

  async function getLoopedArtists(playlists) {
    const artists = new Map();
    for (const playlist of playlists) {
      try {
        const data = await spotify(`/playlists/${encodeURIComponent(playlist.id)}/items?limit=30`);
        const rows = Array.isArray(data.items) ? data.items : data.items?.items || [];
        for (const row of rows) {
          const track = row.item || row.track;
          for (const artist of track?.artists || []) if (artist.id) artists.set(artist.id, artist);
        }
      } catch (error) {
        console.warn('No se pudieron leer las canciones de una playlist de UNLOOP.', error);
      }
    }
    artistsById.clear();
    artists.forEach((artist, id) => artistsById.set(id, artist));
    return [...artists.values()];
  }

  async function loadArtistNews(playlists) {
    const container = document.querySelector('#artist-news');
    if (!playlists.length) return setEmpty(container, 'Cuando guardes un loop, verás aquí los lanzamientos recientes de esos artistas.');
    const artists = (await getLoopedArtists(playlists)).slice(0, 8);
    if (!artists.length) return setEmpty(container, 'Añade canciones a tus loops para seguir las novedades de sus artistas.');
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

  async function findSpotifyTrack(pick) {
    const q = `track:"${pick.song}" artist:"${pick.artist}"`;
    const params = new URLSearchParams({ q, type: 'track', limit: '1' });
    const result = await spotify(`/search?${params}`);
    if (result.tracks?.items?.length) return result.tracks.items[0];
    const backup = new URLSearchParams({ q: `${pick.song} ${pick.artist}`, type: 'track', limit: '1' });
    return (await spotify(`/search?${backup}`)).tracks?.items?.[0] || null;
  }

  async function saveLoop(loop, customName) {
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
      const description = `Loop de UNLOOP · ${loop.distance || 'Crossover'} · Estilos: ${(loop.genres || []).join(', ')} · Idiomas: ${(loop.languages || []).join(', ') || 'Cualquiera'} · Punto de partida: ${(loop.artists || []).join(', ')}`.slice(0, 290);
      const playlist = await spotify('/me/playlists', { method: 'POST', body: JSON.stringify({ name, description, public: false }) });
      await spotify(`/playlists/${encodeURIComponent(playlist.id)}/items`, { method: 'POST', body: JSON.stringify({ uris: tracks.map(track => track.uri) }) });
      message.textContent = 'Loop guardado en tus playlists privadas de Spotify.';
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
      storage.setItem('unloop_after_auth', 'save');
      loginDialog.showModal();
      announce('Conecta Spotify para guardar este loop en una playlist privada.');
      return;
    }
    await saveLoop(loop);
  }

  async function createAnotherLoop() {
    const button = document.querySelector('#create-from-tops');
    button.disabled = true;
    button.textContent = 'BUSCANDO NUEVOS CAMINOS…';
    try {
      const data = await spotify('/me/top/artists?limit=10&time_range=medium_term');
      const topArtists = data.items || [];
      const seen = new Set(topArtists.map(artist => artist.name.toLowerCase()));
      const genres = [...new Set(topArtists.flatMap(artist => artist.genres || []))].slice(0, 8);
      if (!genres.length) throw new Error('Spotify no ha devuelto suficientes estilos para crear otro loop. Completa también la encuesta para añadir tus preferencias.');
      const candidates = [];
      for (const genre of genres.slice(0, 5)) {
        const query = new URLSearchParams({ q: `genre:"${genre}"`, type: 'track', limit: '10' });
        const result = await spotify(`/search?${query}`);
        for (const track of result.tracks?.items || []) {
          const primaryArtist = track.artists?.[0];
          if (!primaryArtist || seen.has(primaryArtist.name.toLowerCase()) || candidates.some(item => item.id === track.id)) continue;
          candidates.push(track);
        }
      }
      if (!candidates.length) throw new Error('Spotify no encontró canciones nuevas con los estilos de tus artistas.');
      const shuffled = candidates.sort(() => Math.random() - 0.5).slice(0, 8);
      const distanceOptions = ['Familiar Territory', 'Crossover', 'Out of Comfort'];
      const playlists = await spotify('/me/playlists?limit=50');
      const loopNumber = (playlists.items || []).filter(list => list.name.startsWith('UNLOOP ·')).length;
      const distance = distanceOptions[loopNumber % distanceOptions.length];
      const chosen = shuffled.slice(0, 4).map(track => ({ artist: track.artists[0].name, song: track.name }));
      const loop = { artists: topArtists.slice(0, 3).map(artist => artist.name), genres: genres.slice(0,3), languages: [], moods: [], distance, picks: chosen };
      const playlist = await saveLoop(loop, `UNLOOP · ${distance} · Loop ${String(loopNumber+1).padStart(2,'0')}`);
      if (playlist) accountPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
      window.alert(error.message);
    } finally {
      button.disabled = false;
      button.innerHTML = 'CREAR Y GUARDAR UN NUEVO LOOP <span>↗</span>';
    }
  }

  async function searchConcerts(city) {
    const container = document.querySelector('#concert-results');
    const apiKey = config.ticketmasterApiKey?.trim();
    if (!city) return setEmpty(container, 'Escribe una ciudad para buscar conciertos.');
    if (!apiKey) return setEmpty(container, 'Añade tu clave de Ticketmaster Discovery API a config.js para activar esta búsqueda.');
    if (!isConnected()) return setEmpty(container, 'Conecta Spotify para buscar conciertos de los artistas de tus loops.');
    setEmpty(container, 'Buscando conciertos…');
    try {
      const playlists = await spotify('/me/playlists?limit=50');
      const saved = (playlists.items || []).filter(list => list.name.startsWith('UNLOOP ·')).slice(0, 6);
      const artists = (await getLoopedArtists(saved)).slice(0, 6);
      if (!artists.length) return setEmpty(container, 'Guarda primero un loop para buscar conciertos de sus artistas.');
      const events = [];
      for (const artist of artists) {
        const params = new URLSearchParams({ apikey: apiKey, keyword: artist.name, city, classificationName: 'music', size: '5' });
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
    ['unloop_spotify_access','unloop_spotify_refresh','unloop_spotify_expiry','unloop_spotify_state','unloop_spotify_verifier'].forEach(key => storage.removeItem(key));
    currentProfile = null;
    loginLink.textContent = 'INICIA SESIÓN';
    accountPanel.hidden = true;
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

  window.UnloopSpotify = { isConnected, saveSurveyLoop, createAnotherLoop, searchConcerts, logout };
  handleCallback();
  if (isConnected() && !new URLSearchParams(location.search).has('code')) loadAccount().catch(error => announce(error.message));
})();
