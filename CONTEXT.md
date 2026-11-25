<!--
CONTEXT.md · ¿De qué va mi proyecto y qué está decidido?
Es el mapa de tu proyecto, no su documentación: lo mínimo para que alguien que
no te conoce (persona o IA) entienda qué haces, con qué y qué está decidido.
-->

# CONTEXT · UNLOOP
Última actualización: 25/11/2026

## La pregunta
¿POR QUÉ TENIENDO ACCESO A TANTA DIVERSIDAD MUSICAL, SEGUIMOS ESCUCHANDO LO QUE YA CONOCEMOS?

## Los datos
- Fuente 1: mi historial personal de Spotify (2018–2026): 1.873 horas de escucha, 53.385 reproducciones, 7.466 canciones, 2.249 artistas y 5.078 álbumes.
- Fuente 2: encuesta de cinco preguntas integrada en la web, que recoge artistas, estilos, idiomas, moods y distancia de descubrimiento. No hay un registro centralizado de respuestas.
- Spotify es opcional. Cada persona autoriza la conexión por separado para guardar loops como playlists privadas.
- Las recomendaciones parten de las respuestas de la encuesta. Las preferencias guardadas se mantienen en el navegador; no se leen ni analizan las canciones del usuario en Spotify.
- El inicio por correo y Google/Apple/Instagram requiere proyecto y credenciales de Supabase; Spotify requiere Client ID.
- La conexión de Spotify y la búsqueda de conciertos necesitan sus claves en `config.js` para activarse.

## El tono
Cercano, curioso y dinámico, sin juzgar los gustos musicales.
La web invita a usar lo conocido como punto de partida para explorar música nueva.

## Referentes
- Last.fm: seguimiento de las escuchas y evolución de hábitos, sin centrar la web solo en estadísticas.
- Explore My Music Listening History y Spotify Wrapped: representación visual y narrativa progresiva, sin convertir UNLOOP en un resumen anual.
- Contrarreferente: rankings sin contexto ni experiencia de exploración.

## Decisiones
- 18/11/2026 · UNLOOP representa la idea de romper el ciclo de escuchar siempre lo mismo.
- 18/11/2026 · La web es una sola página con scrolls: Inicio, Encuesta, Descubre a tu manera, Estudio UNLOOP, Cómo funciona, Nosotros, Mi espacio y pie.
- 25/11/2026 · La portada con la pregunta abre el recorrido; la encuesta es el segundo scroll y el CTA azul lleva hasta ella.
- 18/11/2026 · La encuesta propia ofrece Familiar Territory, Crossover y Out of Comfort como distintos grados de descubrimiento.
- 23/11/2026 · La identidad visual mantiene fondo negro, letras blancas, el logo UNLOOP y la onda con acentos amarillo, naranja, rosa, lila y azul.
- 23/11/2026 · La pregunta de portada mantiene cuatro líneas exactas, con espacio claro entre el titular, el único botón y la onda.
- 23/11/2026 · La conexión con Spotify es opcional; sin conectarla la encuesta sigue disponible.
- 23/11/2026 · Las tarjetas de Descubre se abren de una en una y enlazan con la encuesta.
- 25/11/2026 · Los accesos por correo y redes usan Supabase Auth; Spotify usa OAuth PKCE separado y permite añadir las canciones sugeridas a una playlist.
- 25/11/2026 · Familiar Territory, Crossover y Out of Comfort tienen encuestas breves propias con recomendaciones del catálogo; el idioma de interfaz puede alternarse entre español e inglés.
- 25/11/2026 · El resultado visual presenta canciones en una fila de portadas en arco con un reproductor integrado; el Estudio UNLOOP selecciona y abre una ruta de descubrimiento y «Cómo funciona» explica el proceso en tres pasos.

## Hipótesis (sin comprobar)
- Partir de los gustos personales y ofrecer distintos niveles de descubrimiento puede animar a encontrar música nueva.
- Una experiencia visual e interactiva puede hacer más atractivo ese descubrimiento.

## Descartado
- 23/11/2026 · Acceso automático al historial de Spotify: solo se consultan datos si cada persona conecta su cuenta y concede permisos.
- 18/11/2026 · Crear un Spotify Wrapped personal: UNLOOP usa la información para descubrir música, no solo para mostrar rankings.

## Estado
Hecho: análisis inicial de mi historial y referentes; definición de UNLOOP; web de una página con secciones de scroll, encuesta conectada a catálogos musicales, base de acceso con Supabase y conexión opcional con Spotify.

Siguiente: introducir el Client ID de Spotify, configurar Supabase y los proveedores, añadir la clave de Ticketmaster y probar el flujo publicado con las cuentas de demo autorizadas.

La encuesta principal avanza con Enter. Las encuestas express muestran canciones, álbumes, artistas y fragmentos de audio; guardar sus resultados en Spotify sigue necesitando Client ID y autorización.


## Actualización · Resultado de la encuesta (25/11/2026)
Al terminar las cinco preguntas, UNLOOP busca canciones, álbumes y artistas del catálogo musical usando los artistas favoritos, géneros, idioma, mood y nivel de descubrimiento. Muestra portadas y permite reproducir fragmentos cuando están disponibles; las tarjetas llevan al catálogo para escuchar la pieza completa. Conectar Spotify es opcional para recibir recomendaciones y necesario para guardar las canciones en playlists.
