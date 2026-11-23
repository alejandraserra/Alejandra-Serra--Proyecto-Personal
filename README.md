# UNLOOP

Landing page y encuesta musical para explorar nuevas canciones a partir de los gustos de cada persona.

## Activar la conexión con Spotify

1. Crea una aplicación en [Spotify for Developers](https://developer.spotify.com/dashboard).
2. Añade como Redirect URI exacta: `https://alejandraserra.github.io/Alejandra-Serra--Proyecto-Personal/`.
3. Copia el Client ID público en `config.js`, en `spotifyClientId`.
4. Abre la web desde GitHub Pages y pulsa **Inicia sesión → Conectar con Spotify**.

La conexión usa OAuth PKCE y solicita leer los artistas más escuchados y las playlists privadas, además de permiso para crear playlists privadas. UNLOOP solo crea una playlist cuando la persona pulsa **Guardar este loop**. Los loops se guardan en la cuenta de Spotify para que sigan disponibles en sus dispositivos.

Las nuevas canciones se buscan en el catálogo de Spotify a partir de estilos de artistas más escuchados y respuestas de la encuesta. Spotify ya no ofrece su endpoint de recomendaciones ni el de artistas relacionados a las aplicaciones nuevas; por eso esta versión crea loops con una selección por estilos y distancia de descubrimiento.

## Activar conciertos

La búsqueda de conciertos usa Ticketmaster Discovery API. Hace falta una API key y añadirla a `ticketmasterApiKey` en `config.js`. Esa clave queda visible en el JavaScript público de GitHub Pages; para una publicación abierta conviene mover la petición a un pequeño servicio backend.

La sección de novedades consulta los álbumes y singles publicados por artistas presentes en las playlists guardadas. No incluye artículos de prensa.

## Desarrollo

Spotify no acepta `file://` como origen de OAuth: hay que probar la conexión desde la dirección HTTPS que esté registrada en la aplicación de Spotify. La página funciona con HTML, CSS y JavaScript sin paquetes adicionales.
