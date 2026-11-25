# UNLOOP

Landing page y encuesta musical para explorar nuevas canciones a partir de los gustos de cada persona.

Consulta las [fichas del loop por sección](FICHAS-LOOP.md) para ver qué decide Alejandra, qué resuelve Codex y cómo se verifica cada scroll.

## Activar la conexión con Spotify

1. Crea una aplicación en [Spotify for Developers](https://developer.spotify.com/dashboard).
2. Añade como Redirect URI exacta: `https://alejandraserra.github.io/Alejandra-Serra--Proyecto-Personal/`.
3. Copia el Client ID público en `config.js`, en `spotifyClientId`.
4. Abre la web desde GitHub Pages y pulsa **Inicia sesión → Conectar con Spotify**.

La conexión usa OAuth PKCE y solicita acceso al perfil y playlists, además de permiso para crear playlists y añadir canciones. En el selector de la encuesta se puede elegir una playlist existente o crear una lista privada nueva. La sesión se conserva en el navegador; el token de Spotify no se guarda en GitHub. Para una app en modo de desarrollo, añade en el panel de Spotify las cuentas que probarán UNLOOP.

Las canciones sugeridas se buscan en el catálogo de Spotify usando las respuestas de género, idioma, mood y nivel de descubrimiento. Sin Spotify conectado, la encuesta busca en el catálogo de Apple Music/iTunes. UNLOOP guarda localmente las respuestas de las encuestas guardadas y las usa como punto de partida para crear nuevos loops, novedades y conciertos; no analiza las canciones de Spotify ni el historial de escucha.

## Activar el acceso de cuentas

La pantalla permite entrar con un enlace enviado al correo o con Google, Apple e Instagram. Para activar estos métodos, crea un proyecto de [Supabase](https://supabase.com/dashboard), activa correo y Google/Apple en Authentication, y configura Instagram como proveedor OAuth personalizado si Meta permite ese uso para la cuenta. Añade la URL pública de UNLOOP a los redirects permitidos de Supabase. Cada persona debe autorizar su acceso; no hay cuentas de demostración precargadas.

En `config.js`, rellena `supabaseUrl`, `supabaseAnonKey` y, si lo configuraste con otro identificador, `instagramAuthProvider`. La clave anon está pensada para el navegador; nunca publiques una `service_role` ni secretos de Google, Apple o Meta. Esos secretos se guardan solo en el panel de Supabase. Cada proveedor debe estar habilitado en el panel para que su botón pueda completar el acceso.

Los métodos de correo y redes identifican a la persona en UNLOOP; conectar Spotify sigue siendo un permiso separado, necesario para guardar playlists. La memoria de preferencias se queda en el navegador y los loops se guardan también en la cuenta de Spotify elegida.

## Activar conciertos

La búsqueda de conciertos usa Ticketmaster Discovery API. Hace falta una API key y añadirla a `ticketmasterApiKey` en `config.js`. Esa clave queda visible en el JavaScript público de GitHub Pages; para una publicación abierta conviene mover la petición a un pequeño servicio backend.

La sección de novedades consulta los álbumes y singles publicados por artistas presentes en las playlists guardadas. No incluye artículos de prensa.

## Desarrollo

Spotify no acepta `file://` como origen de OAuth: hay que probar la conexión desde la dirección HTTPS que esté registrada en la aplicación de Spotify. La página funciona con HTML, CSS y JavaScript sin paquetes adicionales.
