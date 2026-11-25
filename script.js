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
let pageLanguage = 'es';
try { pageLanguage = localStorage.getItem('unloop_language') || 'es'; } catch { /* El idioma también funciona sin almacenamiento local. */ }
const languagePairs = {
  'UNLOOP PRESENTA · TU MAPA MUSICAL':'UNLOOP PRESENTS · YOUR MUSIC MAP',
  '¿POR QUÉ TENIENDO ACCESO A':'WITH SO MUCH MUSIC AT OUR FINGERTIPS,',
  'TANTA DIVERSIDAD MUSICAL,':'WHY DO WE KEEP',
  'SEGUIMOS ESCUCHANDO LO QUE':'LISTENING TO THE SAME',
  'YA CONOCEMOS?':'THINGS WE ALREADY KNOW?',
  'ENCUENTRA TU PRÓXIMO LOOP':'FIND YOUR NEXT LOOP',
  'ESCUCHA · EXPLORA · REPITE DIFERENTE':'LISTEN · EXPLORE · REPEAT DIFFERENTLY',
  'INICIA SESIÓN':'SIGN IN','MI CUENTA':'MY ACCOUNT','Abrir menú':'Open menu','Cerrar menú':'Close menu',
  'Inicio':'Home','Encuesta':'Survey','Descubre a tu manera':'Discover your way','Nosotros':'About us',
  'EMPIEZA POR TU OÍDO.':'START WITH YOUR EARS.','Tu próximo descubrimiento empieza aquí.':'Your next discovery starts here.',
  'Cuéntanos qué escuchas y qué te apetece probar. Te proponemos un loop a tu medida.':'Tell us what you listen to and what you feel like trying. We’ll find a loop for you.',
  'Tú eliges el punto de partida.':'You choose where to start.','Conecta Spotify solo si quieres guardar tus loops en playlists privadas.':'Connect Spotify only if you want to save your loops to private playlists.',
  '5 PREGUNTAS · 2 MINUTOS':'5 QUESTIONS · 2 MINUTES','¿Qué artistas tienes':'Which artists are on your','Escribe hasta tres de tus favoritos.':'Add up to three favorites.',
  'ARTISTAS':'ARTISTS','Sepáralos con comas.':'Separate them with commas.','¿Qué sonidos':'What sounds','te':'are calling to you','Elige todos los que te apetezcan.':'Choose all that appeal to you.',
  '¿En qué idioma':'Which language','te apetece':'would you like to','explorar?':'explore?','Marca todos los que te gustaría escuchar.':'Choose all the languages you’d like to hear.',
  'Español':'Spanish','Inglés':'English','Otros idiomas':'Other languages','Me da igual ✳':'Any language ✳',
  '¿Qué buscas':'What are you looking for','cuando':'when you','escuchas?':'listen?','Puedes elegir más de uno.':'Choose more than one.',
  'Desconectar':'Unwind','Subidón':'Energy','Acompañamiento':'Company','Inspiración':'Inspiration','Moverme':'Movement','Un poco de todo':'A bit of everything',
  '¿Hasta dónde':'How far','quieres':'do you want to','llegar?':'go?','Marca la distancia que te apetece hoy.':'Choose how far you feel like exploring today.',
  'Algo familiar':'Something familiar','Quiero sentirme en casa.':'Keep me in my comfort zone.','Un paso al lado':'One step aside','Sorpréndeme un poco.':'Surprise me a little.','Sin mapa':'No map','Hoy me atrevo con todo.':'I’m up for anything today.',
  '← ATRÁS':'← BACK','SIGUIENTE':'NEXT','VER DESCUBRIMIENTOS':'SHOW MY DISCOVERIES','BUSCANDO TU PRÓXIMO LOOP…':'FINDING YOUR NEXT LOOP…',
  'Sal de repeat.':'Break the loop.','Entra en play.':'Hit play.','TU PRÓXIMO LOOP':'YOUR NEXT LOOP','SELECCIÓN PERSONALIZADA':'MADE FOR YOU','SEGÚN TUS RESPUESTAS':'BASED ON YOUR ANSWERS',
  'Empieza por aquí':'Start here','CANCIONES PARA TI':'SONGS FOR YOU','Escucha un álbum':'Explore an album','ÁLBUMES':'ALBUMS','Conoce otra voz':'Meet a new voice','ARTISTAS':'ARTISTS',
  'Las recomendaciones salen de tus artistas, estilos, idioma, mood y distancia de descubrimiento. Abre cada tarjeta para escucharla en Apple Music; si conectas Spotify, puedes guardar las canciones en una playlist.':'Recommendations use your favorite artists, genres, language, mood and discovery distance. Open a card to listen on Apple Music; connect Spotify to save songs to a playlist.',
  'DESTINO EN SPOTIFY':'SPOTIFY PLAYLIST','Crear una playlist privada nueva':'Create a new private playlist','AÑADIR A MI PLAYLIST DE SPOTIFY':'ADD TO MY SPOTIFY PLAYLIST','EMPEZAR DE NUEVO ↺':'START OVER ↺',
  'Tres niveles, tres mini encuestas y nuevos resultados para explorar a tu ritmo.':'Three paths, three quick surveys and fresh music to explore at your pace.',
  'DESCUBRE A TU MANERA':'DISCOVER YOUR WAY','FAMILIAR':'FAMILIAR','TERRITORY':'TERRITORY','CROSS':'CROSS','OVER':'OVER','OUT OF':'OUT OF','COMFORT':'COMFORT',
  'Artistas nuevos con algo de ese sonido que ya te encanta.':'New artists with something of the sound you already love.',
  'Conexiones inesperadas entre tus gustos y otros mundos.':'Unexpected connections between your tastes and new worlds.',
  'Una invitación a escuchar más allá de lo de siempre.':'An invitation to listen beyond the familiar.',
  'ABRIR ESTE CAMINO':'OPEN THIS PATH','Partimos de artistas y canciones que ya están en tu zona conocida. Buscamos propuestas nuevas que compartan algún rasgo contigo: el género, la energía, la voz o el ambiente.':'We start with artists and songs in your comfort zone, then find new sounds that share a genre, energy, voice or atmosphere.',
  'Conectamos tus gustos con otro estilo, escena o forma de producir. La idea es encontrar el puente entre dos mundos, no saltar a ciegas.':'We connect your tastes to another style, scene or production approach, finding a bridge between two worlds.',
  'Dejamos que tus gustos sean el punto de partida, pero nos permitimos llegar más lejos: sonidos, escenas y artistas que quizá aún no forman parte de tu rutina.':'Your tastes are the starting point, then we venture toward sounds, scenes and artists outside your routine.',
  'HACER ENCUESTA EXPRESS':'TAKE THE QUICK SURVEY','NOSOTROS':'ABOUT US','UNLOOP nace de una pregunta: ¿por qué, teniendo acceso a tanta diversidad musical, seguimos escuchando lo que ya conocemos? Para explorarla, analicé mi propio historial de Spotify entre 2018 y 2026: 1.873 horas de escucha, 53.385 reproducciones, 7.466 canciones y 2.249 artistas.':'UNLOOP began with a question: with so much music available, why do we keep listening to what we already know? To explore it, I analysed my Spotify history from 2018 to 2026: 1,873 listening hours, 53,385 plays, 7,466 songs and 2,249 artists.',
  'Al mirar esos datos descubrí que, aunque había escuchado a miles de artistas, gran parte de mi tiempo se concentraba en un grupo mucho más pequeño. De ahí sale UNLOOP: una invitación a usar lo que ya nos gusta como punto de partida para descubrir artistas y canciones nuevas, sin juzgar nuestros gustos.':'The data showed me that even after listening to thousands of artists, much of my time went to a much smaller group. UNLOOP turns what we love into a starting point for finding new artists and songs, without judging our taste.',
  'MI ESPACIO':'MY SPACE','TU MÚSICA, A TU MANERA':'YOUR MUSIC, YOUR WAY','CERRAR SESIÓN':'SIGN OUT','CONECTAR SPOTIFY':'CONNECT SPOTIFY','CREAR Y GUARDAR UN NUEVO LOOP':'CREATE AND SAVE A NEW LOOP',
  'LOOPS GUARDADOS':'SAVED LOOPS','NOVEDADES DE TUS ARTISTAS':'ARTIST UPDATES','PRÓXIMOS CONCIERTOS':'UPCOMING CONCERTS','BUSCAR':'SEARCH','VOLVER ARRIBA ↑':'BACK TO TOP ↑',
  '¡HOLA DE NUEVO!':'WELCOME BACK!','CORREO ELECTRÓNICO':'EMAIL ADDRESS','CONTINUAR':'CONTINUE','CONTINUAR CON GOOGLE':'CONTINUE WITH GOOGLE','CONTINUAR CON APPLE':'CONTINUE WITH APPLE','CONTINUAR CON INSTAGRAM':'CONTINUE WITH INSTAGRAM','¿NO TIENES CUENTA?':'NEW TO UNLOOP?'
  ,'UNIVERSOS MUSICALES':'MUSIC WORLDS','ALT-R&B':'ALT-R&B','ELECTRÓNICA':'ELECTRONIC','¡Sorpréndeme!':'Surprise me!','¿Qué sonido te apetece explorar?':'What sound would you like to explore?','¿Qué quieres sentir al escuchar?':'What do you want to feel while listening?','Calma':'Calm','Energía':'Energy','IDIOMA':'LANGUAGE','Me da igual':'Any language','Otros idiomas':'Other languages','ENCUESTA EXPRESS · 2 PREGUNTAS':'QUICK SURVEY · 2 QUESTIONS','Encuentra otro ángulo.':'Find another angle.','Dos decisiones rápidas y una selección musical nueva.':'Two quick choices and a fresh music selection.','ENCUENTRA MI SIGUIENTE LOOP':'FIND MY NEXT LOOP','BUSCANDO TU LOOP…':'FINDING YOUR LOOP…','Tus descubrimientos':'Your discoveries','ÁLBUMES':'ALBUMS','ARTISTAS':'ARTISTS','VISTA PREVIA · 30 S':'30-SECOND PREVIEW','PROBAR OTRA VEZ ↺':'TRY AGAIN ↺','Nuevos sonidos familiares':'New familiar sounds','Un puente hacia otro sonido':'A bridge to a new sound','Fuera de tu loop habitual':'Outside your usual loop','AÑADIR A MI PLAYLIST DE SPOTIFY':'ADD TO MY SPOTIFY PLAYLIST','Inicio':'Home','Nosotros':'About us','DESCUBRE A TU MANERA':'DISCOVER YOUR WAY','POP':'POP','INDIE':'INDIE','HIP-HOP':'HIP-HOP','JAZZ':'JAZZ','ROCK':'ROCK','Lo que ya conoces':'What you already know','Lo que te mueve':'What moves you','Lo que aún no conoces':'What you don’t know yet','UNIVERSOS MUSICALES':'MUSIC WORLDS','ABRIR ESTE CAMINO':'OPEN THIS PATH','Ideal si:':'Best for:','quieres descubrir sin alejarte demasiado de lo que ya disfrutas.':'you want discovery that stays close to what you enjoy.','te apetece una sorpresa que todavía se sienta cercana.':'you want a surprise that still feels familiar.','hoy te apetece explorar sin saber exactamente qué vas a encontrar.':'you want to explore without knowing exactly what you’ll find.','Busca fechas en una ciudad para los artistas que ya loopeaste.':'Find dates in a city for artists in your loops.','Añade tu clave de Ticketmaster a config.js para activar la búsqueda de conciertos.':'Add your Ticketmaster key to config.js to enable concert search.','Conecta Spotify para guardar y ver tus loops personales.':'Connect Spotify to save and see your personal loops.','Conecta Spotify para ver tus loops guardados.':'Connect Spotify to see your saved loops.','Ciudad · ej. Barcelona':'City · e.g. Barcelona','Ej. Rosalía, Frank Ocean…':'E.g. Rosalía, Frank Ocean…','Tu próxima canción':'Your next song','Prueba otro sonido para encontrar álbumes.':'Try another sound to find albums.','Prueba otro sonido para encontrar artistas.':'Try another sound to find artists.'
  ,'UNIVERSOS MUSICALES':'MUSIC WORLDS','ALT-R&B':'ALT-R&B','ELECTRÓNICA':'ELECTRONIC','¡Sorpréndeme!':'Surprise me!','¿Qué sonido te apetece explorar?':'What sound would you like to explore?','¿Qué quieres sentir al escuchar?':'What do you want to feel while listening?','Calma':'Calm','Energía':'Energy','IDIOMA':'LANGUAGE','Me da igual':'Any language','Otros idiomas':'Other languages','ENCUESTA EXPRESS · 2 PREGUNTAS':'QUICK SURVEY · 2 QUESTIONS','Encuentra otro ángulo.':'Find another angle.','Dos decisiones rápidas y una selección musical nueva.':'Two quick choices and a fresh music selection.','ENCUENTRA MI SIGUIENTE LOOP':'FIND MY NEXT LOOP','BUSCANDO TU LOOP…':'FINDING YOUR LOOP…','Tus descubrimientos':'Your discoveries','ÁLBUMES':'ALBUMS','ARTISTAS':'ARTISTS','VISTA PREVIA · 30 S':'30-SECOND PREVIEW','PROBAR OTRA VEZ ↺':'TRY AGAIN ↺','Nuevos sonidos familiares':'New familiar sounds','Un puente hacia otro sonido':'A bridge to a new sound','Fuera de tu loop habitual':'Outside your usual loop','AÑADIR A MI PLAYLIST DE SPOTIFY':'ADD TO MY SPOTIFY PLAYLIST','Inicio':'Home','Nosotros':'About us','DESCUBRE A TU MANERA':'DISCOVER YOUR WAY','POP':'POP','INDIE':'INDIE','HIP-HOP':'HIP-HOP','JAZZ':'JAZZ','ROCK':'ROCK','Lo que ya conoces':'What you already know','Lo que te mueve':'What moves you','Lo que aún no conoces':'What you don’t know yet','UNIVERSOS MUSICALES':'MUSIC WORLDS','ABRIR ESTE CAMINO':'OPEN THIS PATH','Ideal si:':'Best for:','quieres descubrir sin alejarte demasiado de lo que ya disfrutas.':'you want discovery that stays close to what you enjoy.','te apetece una sorpresa que todavía se sienta cercana.':'you want a surprise that still feels familiar.','hoy te apetece explorar sin saber exactamente qué vas a encontrar.':'you want to explore without knowing exactly what you’ll find.','Busca fechas en una ciudad para los artistas que ya loopeaste.':'Find dates in a city for artists in your loops.','Añade tu clave de Ticketmaster a config.js para activar la búsqueda de conciertos.':'Add your Ticketmaster key to config.js to enable concert search.','Conecta Spotify para guardar y ver tus loops personales.':'Connect Spotify to save and see your personal loops.','Conecta Spotify para ver tus loops guardados.':'Connect Spotify to see your saved loops.','Ciudad · ej. Barcelona':'City · e.g. Barcelona','Ej. Rosalía, Frank Ocean…':'E.g. Rosalía, Frank Ocean…','Tu próxima canción':'Your next song','Prueba otro sonido para encontrar álbumes.':'Try another sound to find albums.','Prueba otro sonido para encontrar artistas.':'Try another sound to find artists.','Estudio UNLOOP':'UNLOOP STUDIO','ESTUDIO UNLOOP':'UNLOOP STUDIO','Cómo funciona':'How it works','CÓMO FUNCIONA':'HOW IT WORKS','ELIGE UNA DIRECCIÓN':'CHOOSE A DIRECTION','Un sonido nuevo puede empezar con una imagen.':'A new sound can start with an image.','Acerca una carta al centro para elegir cómo quieres descubrir hoy.':'Bring a card to the center to choose how you want to discover today.','ABRIR MI ENCUESTA':'OPEN MY SURVEY','SIN MAPA':'OFF THE MAP','OTRA ÓRBITA':'A NEW ORBIT','UN ECO FAMILIAR':'A FAMILIAR ECHO','Una curiosidad basta para poner el descubrimiento en marcha.':'A little curiosity is all it takes to start discovering.','CUENTA LO QUE TE MUEVE':'TELL US WHAT MOVES YOU','ENCUENTRA EL HILO':'FIND THE CONNECTION','DALE AL PLAY':'PRESS PLAY','Elige artistas, estilos, idiomas y energía. La encuesta te toma un par de minutos.':'Choose artists, genres, languages and moods. The survey takes a couple of minutes.','UNLOOP usa tus respuestas para acercarte a canciones, álbumes y artistas del catálogo.':'UNLOOP uses your answers to find songs, albums and artists in the catalog.','Prueba fragmentos, guarda un loop en Spotify y vuelve a explorar desde otro ángulo.':'Preview tracks, save a loop to Spotify and explore from a new angle.','Una ruta cercana: estilos, energía o voces que recuerdan a tus favoritos, con artistas nuevos por descubrir.':'A nearby route: genres, moods or voices that echo your favorites, with new artists to discover.','Una mezcla con un pie en lo conocido y otro en un género vecino. Encuentra el hilo entre dos mundos.':'A mix with one foot in the familiar and one in a neighboring genre. Find the thread between two worlds.','Una salida más atrevida hacia escenas y sonidos que quizá aún no formen parte de tu día a día.':'A bolder journey into scenes and sounds outside your everyday listening.'
};
const englishToSpanish = Object.fromEntries(Object.entries(languagePairs).map(([es,en])=>[en,es]));
function t(es, en) { return pageLanguage === 'en' ? (en || languagePairs[es] || es) : es; }
function applyLanguage() {
  const translations = pageLanguage === 'en' ? languagePairs : englishToSpanish;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode, trimmed = node.nodeValue.trim();
    let replacement = translations[trimmed];
    if (!replacement && pageLanguage === 'en' && /^CANCIÓN ·/.test(trimmed)) replacement = trimmed.replace('CANCIÓN ·','TRACK ·');
    if (!replacement && pageLanguage === 'en' && /^ÁLBUM ·/.test(trimmed)) replacement = trimmed.replace('ÁLBUM ·','ALBUM ·');
    if (!replacement && pageLanguage === 'en' && /^ARTISTA ·/.test(trimmed)) replacement = trimmed.replace('ARTISTA ·','ARTIST ·');
    if (replacement) node.nodeValue = node.nodeValue.replace(trimmed, replacement);
  }
  const attributes = {'Abrir menú':'Open menu','Cerrar menú':'Close menu','Cerrar':'Close','Canción anterior':'Previous song','Siguiente canción':'Next song','Reproducir vista previa':'Play preview','Abrir en Apple Music':'Open in Apple Music','Ej. Rosalía, Frank Ocean…':'E.g. Rosalía, Frank Ocean…','tu@email.com':'you@email.com','Ciudad · ej. Barcelona':'City · e.g. Barcelona','Explorar sonidos sin mapa':'Explore sounds off the map','Explorar una mezcla inesperada':'Explore an unexpected mix','Explorar sonidos familiares':'Explore familiar sounds','Elige una forma de descubrir música':'Choose a way to discover music'};
  document.querySelectorAll('[aria-label], [placeholder]').forEach(el => ['aria-label','placeholder'].forEach(attr => {
    const value = el.getAttribute(attr); if (!value) return;
    const translated = pageLanguage === 'en' ? attributes[value] : Object.fromEntries(Object.entries(attributes).map(([es,en])=>[en,es]))[value];
    if (translated) el.setAttribute(attr, translated);
  }));
  document.documentElement.lang = pageLanguage;
  const selector = document.querySelector('#language-select'); if (selector && selector.value !== pageLanguage) selector.value = pageLanguage;
  document.title = pageLanguage === 'en' ? 'UNLOOP — Break the listening loop' : 'UNLOOP — Break the listening loop';
}

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
  applyLanguage();
}

setStep(0);

async function searchCatalogEntity(term, entity, limit = 18, country = 'ES') {
  const params = new URLSearchParams({ term, entity, limit: String(limit), country });
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
  const catalogCountry = loop.languages.length === 1 && loop.languages[0] === 'Inglés' ? 'US' : 'ES';
  const requestGroup = async (entity, terms) => (await Promise.all(terms.map(async term => {
    try { return await searchCatalogEntity(term, entity, 25, catalogCountry); } catch { return []; }
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
    artwork: album.artworkUrl100 || '',
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
  document.querySelectorAll('#track-recommendations .cover-card').forEach((card, cardIndex) => {
    card.classList.toggle('cover-card-active', cardIndex === activePreviewIndex);
    if (cardIndex === activePreviewIndex && autoplay) card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  });
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
  activePreviewPicks = loop.picks; selectPreview(Math.min(2, loop.picks.length - 1), false);
  document.querySelector('#player-progress').style.width = '0%';
  form.hidden = true;
  results.hidden = false;
  progressFill.style.width = '100%';
  stepLabel.textContent = 'MAPA COMPLETADO';
  percentLabel.textContent = '100%';
  applyLanguage();
  document.querySelector('#results').scrollIntoView({ behavior: 'smooth', block: 'start' });
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
form.addEventListener('keydown', event => {
  if (event.key !== 'Enter' || event.isComposing || event.target.matches('textarea, button')) return;
  event.preventDefault();
  if (!nextButton.disabled) nextButton.click();
});

// Selector de idioma y encuestas express de Descubre.
document.querySelector('#language-select')?.addEventListener('change', event => {
  pageLanguage = event.target.value === 'en' ? 'en' : 'es';
  try { localStorage.setItem('unloop_language', pageLanguage); } catch { /* El idioma sigue activo durante esta visita. */ }
  applyLanguage();
});
applyLanguage();

const pathDialog = document.querySelector('#path-quiz-dialog');
const pathForm = document.querySelector('#path-quiz-form');
const pathError = document.querySelector('#path-quiz-error');
const pathAudio = document.querySelector('#path-preview-audio');
let pathMode = 'Familiar Territory';
let pathPicks = [];
let pathPickIndex = 0;
function playPathPick(index, autoplay = true) {
  if (!pathPicks.length) return;
  pathPickIndex = (index + pathPicks.length) % pathPicks.length;
  const pick = pathPicks[pathPickIndex];
  document.querySelectorAll('#path-track-recommendations .cover-card').forEach((card, cardIndex) => {
    card.classList.toggle('cover-card-active', cardIndex === pathPickIndex);
    if (cardIndex === pathPickIndex && autoplay) card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  });
  document.querySelector('#path-player-title').textContent = pick.song;
  document.querySelector('#path-player-artist').textContent = pick.artist;
  document.querySelector('#path-player-progress').style.width = '0%';
  const button = document.querySelector('#path-player-toggle');
  if (!pick.preview) {
    pathAudio.pause(); pathAudio.removeAttribute('src'); button.disabled = true; button.textContent = '—';
    document.querySelector('#path-player-status').textContent = 'Sin fragmento disponible'; return;
  }
  button.disabled = false; button.textContent = '▶'; pathAudio.src = pick.preview; pathAudio.currentTime = 0;
  if (autoplay) pathAudio.play().then(() => { button.textContent = 'Ⅱ'; }).catch(() => {});
}
function openPathQuiz(mode) {
  pathMode = mode;
  document.querySelector('#path-quiz-kicker').textContent = `${pathMode.toLocaleUpperCase()} · 2 PREGUNTAS`;
  document.querySelector('#path-quiz-title').textContent = pathMode === 'Familiar Territory' ? 'Quédate cerca.' : pathMode === 'Crossover' ? 'Prueba una conexión nueva.' : 'Sal de tu zona conocida.';
  pathForm.hidden = false; document.querySelector('#path-quiz-results').hidden = true; pathForm.reset(); pathError.textContent = '';
  pathDialog.showModal();
}
document.querySelectorAll('[data-path-quiz]').forEach(button => button.addEventListener('click', () => openPathQuiz(button.dataset.pathQuiz)));
document.querySelector('#path-quiz-close').addEventListener('click', () => { pathAudio.pause(); pathDialog.close(); });
pathDialog.addEventListener('click', event => { if (event.target === pathDialog) { pathAudio.pause(); pathDialog.close(); } });
pathForm.addEventListener('submit', async event => {
  event.preventDefault();
  const genres = [...pathForm.querySelectorAll('[name="path-genre"]:checked')].map(input => input.value);
  if (!genres.length) { pathError.textContent = 'Elige al menos un sonido para orientar tus recomendaciones.'; return; }
  const mood = pathForm.querySelector('[name="path-mood"]:checked')?.value || 'Inspiración';
  const language = document.querySelector('#path-language').value;
  const loop = { artists: [], genres, languages: language === 'Cualquier idioma' ? [] : [language], moods: [mood], distance: pathMode, picks: [] };
  const submit = pathForm.querySelector('[type="submit"]'); submit.disabled = true; submit.textContent = 'BUSCANDO TU LOOP…'; pathError.textContent = '';
  try {
    const catalog = await getCatalogRecommendations(loop);
    loop.picks = catalog.picks; loop.albums = catalog.albums; loop.recommendedArtists = catalog.artists;
    loop.artistSeeds = catalog.artistSeeds.map(item => item.artistName); window.unloopPending = loop;
    document.querySelector('#path-track-recommendations').innerHTML = renderSongCards(loop.picks);
    document.querySelector('#path-album-recommendations').innerHTML = loop.albums.length ? renderMiniCards(loop.albums, 'ÁLBUM') : '<p class="catalog-empty">Prueba otro sonido para encontrar álbumes.</p>';
    document.querySelector('#path-artist-recommendations').innerHTML = loop.recommendedArtists.length ? renderMiniCards(loop.recommendedArtists, 'ARTISTA') : '<p class="catalog-empty">Prueba otro sonido para encontrar artistas.</p>';
    document.querySelector('#path-result-heading').textContent = pathMode === 'Familiar Territory' ? 'Nuevos sonidos familiares' : pathMode === 'Crossover' ? 'Un puente hacia otro sonido' : 'Fuera de tu loop habitual';
    pathPicks = loop.picks; playPathPick(Math.min(2, loop.picks.length - 1), false); pathForm.hidden = true; document.querySelector('#path-quiz-results').hidden = false; applyLanguage();
  } catch (cause) { pathError.textContent = cause.message || 'No encontramos sugerencias. Prueba con otra combinación.'; }
  finally { submit.disabled = false; submit.innerHTML = 'ENCUENTRA MI SIGUIENTE LOOP <span>↗</span>'; applyLanguage(); }
});
document.querySelector('#path-track-recommendations').addEventListener('click', event => {
  const button = event.target.closest('[data-preview-index]'); if (button && !button.disabled) playPathPick(Number(button.dataset.previewIndex));
});
document.querySelector('#path-player-toggle').addEventListener('click', async () => {
  const button = document.querySelector('#path-player-toggle');
  if (!pathPicks[pathPickIndex]?.preview) return;
  if (pathAudio.paused) { try { await pathAudio.play(); button.textContent = 'Ⅱ'; } catch { document.querySelector('#path-player-status').textContent = 'No se pudo reproducir'; } }
  else { pathAudio.pause(); button.textContent = '▶'; }
});
document.querySelector('#path-player-prev').addEventListener('click', () => playPathPick(pathPickIndex - 1));
document.querySelector('#path-player-next').addEventListener('click', () => playPathPick(pathPickIndex + 1));
pathAudio.addEventListener('ended', () => playPathPick(pathPickIndex + 1));
pathAudio.addEventListener('timeupdate', () => { document.querySelector('#path-player-progress').style.width = `${pathAudio.duration ? pathAudio.currentTime / pathAudio.duration * 100 : 0}%`; });
document.querySelector('#path-save-loop-button').addEventListener('click', () => window.UnloopSpotify?.saveSurveyLoop({ messageSelector: '#path-save-loop-message' }));
document.querySelector('#path-quiz-restart').addEventListener('click', () => { pathAudio.pause(); document.querySelector('#path-quiz-results').hidden = true; pathForm.hidden = false; pathForm.reset(); pathError.textContent = ''; applyLanguage(); });

// Scroll 04 · Cartas interactivas del Estudio UNLOOP.
const studioCards = [...document.querySelectorAll('.studio-card')];
let studioMode = 'Familiar Territory';
const studioDescriptions = {
  'Familiar Territory': 'Una ruta cercana: estilos, energía o voces que recuerdan a tus favoritos, con artistas nuevos por descubrir.',
  Crossover: 'Una mezcla con un pie en lo conocido y otro en un género vecino. Encuentra el hilo entre dos mundos.',
  'Out of Comfort': 'Una salida más atrevida hacia escenas y sonidos que quizá aún no forman parte de tu día a día.'
};
studioCards.forEach(card => card.addEventListener('click', () => {
  studioMode = card.dataset.mode;
  studioCards.forEach(item => item.classList.toggle('is-active', item === card));
  document.querySelector('#studio-description').textContent = studioDescriptions[studioMode];
  applyLanguage();
}));
document.querySelector('#studio-open-path').addEventListener('click', () => openPathQuiz(studioMode));

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
