<!--
INSTRUCTIONS.md · ¿Qué hacer y qué no hacer?
El criterio de aceptación: las condiciones que tiene que cumplir el resultado
para darlo por bueno. Se escribe ANTES de pedir, no después de ver el resultado.
Regla: si no se puede comprobar mirando el resultado, no es criterio. Es un deseo.
La mitad sale de tu CONTEXT.md (tono, decisiones, lo que falta, hipótesis).
Copia el bloque una vez por petición. Se va ajustando.
-->

# INSTRUCTIONS · [UNLOOP]

## [4/11] · [Diseño de la encuesta musical]

QUIERO: [Diseñar una encuesta integrada en la web de UNLOOP para conocer los gustos y preferencias musicales de los usuarios y utilizarlos como punto de partida para descubrir nuevos artistas.].

SERÁ BUENO SI:
- [Las preguntas son claras, sencillas y fáciles de responder.]
- [La encuesta recoge información suficiente para identificar los gustos musicales de cada usuario.]
- [Las respuestas permiten plantear los tres niveles de descubrimiento: Familiar Territory, Crossover y Out of Comfort.]
- [La experiencia resulta dinámica y cercana, y no parece un formulario largo o complicado.]
- [Se explica qué información se recoge y cómo se utilizará para orientar los descubrimientos.]

NO SIRVE SI:
- [La encuesta presupone que UNLOOP tiene acceso al historial de Spotify o a datos externos del usuario.]
- [Las preguntas son demasiado generales y no permiten conocer sus preferencias.]
- [El resultado se limita a recomendar artistas muy parecidos a los que ya escucha.]
- [Se incluyen preguntas o funciones que no tienen una utilidad clara dentro del proyecto.]

LO SABRÉ PORQUE: [Tendré una propuesta de encuesta con las preguntas, las posibles respuestas y una explicación de cómo se utilizará esa información para orientar las recomendaciones musicales de UNLOOP.]

## [23/11] · [Orden y ajustes de la web]

QUIERO: [Mantener UNLOOP como una sola página y ordenar el código y el registro por sus secciones de scroll, actualizando también SOUL.md y CONTEXT.md sin rehacer sus estructuras.]

SERÁ BUENO SI:
- [Los scrolls de Inicio, Nosotros, Descubre, Mi espacio y Encuesta se identifican con claridad en el código.]
- [Los cambios mantienen la estética negra, blanca y la paleta de la onda UNLOOP.]
- [La pregunta de portada respeta sus cuatro líneas indicadas y no se cruza con el botón ni con la onda.]
- [El LOG.md conserva su formato y recibe entradas breves según cambie cada sección.]
- [Si no está clara una decisión que pueda cambiar el resultado, se consulta antes de asumirla.]

NO SIRVE SI:
- [La web se convierte en varias páginas o se cambia radicalmente la estructura o estética sin que lo pida.]

LO SABRÉ PORQUE: [La web sigue siendo una sola página, pero su código y los documentos del proyecto resultan fáciles de recorrer por secciones.]

## [25/11] · [Acceso, catálogo y loops reales]

QUIERO: [Que correo, Google, Apple e Instagram puedan iniciar sesión en la demo; que la encuesta ofrezca canciones reales y permita guardarlas en Spotify.]

SERÁ BUENO SI:
- [La encuesta busca canciones en un catálogo y muestra título, artista y enlace real.]
- [Con Spotify conectado, se pueden crear playlists o añadir las canciones a una playlist elegida.]
- [Los nuevos loops parten de las preferencias escritas en la encuesta, sin analizar el historial de escucha de Spotify.]
- [Correo y redes usan autenticación real; los métodos quedan pendientes de configurar en Supabase y sus proveedores.]
- [LOG.md registra brevemente los cambios y la prueba requerida para cada integración.]

NO SIRVE SI:
- [La web indica que un acceso o guardado se completó cuando faltan credenciales o la API lo rechazó.]
- [Se exponen secretos de proveedores en los archivos públicos.]

LO SABRÉ PORQUE: [Al configurar las claves, podré iniciar sesión, completar la encuesta, guardar canciones en Spotify y volver a ver mis loops en Mi espacio.]

## [25/11] · [Prioridad y orden de navegación]

QUIERO: [Que la encuesta sea lo primero que vea una persona al entrar; después, que la web presente la idea de UNLOOP, el proyecto y los niveles de descubrimiento en un orden claro.]

SERÁ BUENO SI:
- [La encuesta aparece inmediatamente bajo la cabecera y es el primer scroll de la página.]
- [El menú desplegable usa una pantalla completa, enlaces grandes numerados y flechas como en las referencias.]
- [La encuesta ocupa el primer lugar del menú y cada enlace lleva a su sección correspondiente.]
- [Se conserva la estética y el contenido base de UNLOOP.]
- [LOG.md y las fichas reflejan el nuevo orden.]

NO SIRVE SI:
- [La encuesta queda al final o la persona tiene que buscarla entre otras secciones.]
- [El menú tapa su propia acción de cierre o dificulta llegar a una sección.]

LO SABRÉ PORQUE: [Al abrir la página aparece la encuesta; al abrir el menú puedo identificar y llegar a cada sección con claridad.]

## [25/11] · [Portada primero y acceso Spotify]

QUIERO: [Mantener la pregunta de UNLOOP como primer scroll, usar una sola caja azul con el texto «Encuentra tu próximo loop» y llevar desde ella a la encuesta del segundo scroll. Quiero que el icono de Spotify del acceso sea claro y reconocible, y que Google, Apple y Spotify completen accesos reales.]

SERÁ BUENO SI:
- [La pregunta ocupa el primer scroll y mantiene sus cuatro líneas exactas.]
- [El único botón azul lleva directamente a #encuesta y la encuesta aparece en el segundo scroll.]
- [El menú sigue el orden Inicio, Encuesta, Nosotros, Descubre.]
- [El botón de Spotify muestra el icono reconocible sobre un fondo donde contraste.]
- [Los accesos OAuth muestran errores claros si faltan credenciales o el proveedor no está configurado.]
- [LOG.md, CONTEXT.md y las fichas registran la nueva decisión sin borrar el historial previo.]

NO SIRVE SI:
- [La encuesta vuelve a ser la primera sección o el botón azul duplica el mensaje de marca.]
- [La interfaz simula un acceso completado sin conectar el proveedor real.]

LO SABRÉ PORQUE: [Puedo entrar a la página y ver primero la pregunta, abrir la encuesta con el botón azul y, al configurar los proveedores, acceder mediante Google, Apple o Spotify.]

## [25/11] · [Corrección de orden e icono]

QUIERO: [La pregunta de UNLOOP en el primer scroll, la encuesta como segundo scroll y un icono de Spotify nítido en la opción de conectar Spotify del inicio de sesión.]

SERÁ BUENO SI:
- [La secuencia en HTML, CSS, menú y fichas coincide: Inicio (01), Encuesta (02), Nosotros (03), Descubre (04), Mi espacio (05).]
- [El botón azul único dice «Encuentra tu próximo loop» y enlaza a la encuesta.]
- [El icono de Spotify se distingue bien del botón carbón y el texto sigue legible.]
- [LOG.md conserva el historial y añade esta corrección al final.]

NO SIRVE SI:
- [Se afirma que Spotify, Google o Apple ya están conectados mientras falten sus credenciales o configuración externa.]

LO SABRÉ PORQUE: [La primera pantalla muestra la pregunta; el botón abre la encuesta del siguiente scroll y el icono de Spotify se reconoce junto a las opciones de acceso.]


## [25/11] · [Recomendaciones al terminar la encuesta]

QUIERO: [Que al completar la encuesta aparezca una selección visual de canciones, álbumes y artistas que ayude a salir del loop musical, basada en las respuestas.]

SERÁ BUENO SI:
- [La búsqueda considera artistas favoritos, géneros, idioma, mood y distancia de descubrimiento.]
- [El resultado tiene portadas y tarjetas claras con enlaces al catálogo.]
- [La persona puede reproducir fragmentos si el catálogo los ofrece y pasar entre canciones.]
- [Spotify se usa para guardar las canciones en playlists, no es requisito para ver recomendaciones.]
- [La nueva interacción y las limitaciones del catálogo quedan anotadas en LOG.md.]

NO SIRVE SI:
- [Se muestran recomendaciones fijas o se presenta una búsqueda fallida como si hubiera funcionado.]

LO SABRÉ PORQUE: [Al terminar las preguntas se verá un resultado propio para esas respuestas, con canciones, álbumes, artistas y opciones para escuchar.]

## [25/11] · [Encuestas express e idioma]

QUIERO: [Mantener la portada y ampliar la exploración con encuestas breves para Familiar Territory, Crossover y Out of Comfort, selector ES/EN y avance con Enter.]

SERÁ BUENO SI:
- [Cada nivel abre una encuesta sencilla y genera recomendaciones distintas desde el catálogo según las respuestas y su nivel de descubrimiento.]
- [Los resultados incluyen canciones, álbumes, artistas, fragmentos disponibles y opción de guardado en Spotify.]
- [La preferencia de idioma cambia la interfaz y se conserva durante las visitas; los nombres de artistas y canciones permanecen como en el catálogo.]
- [Enter avanza la encuesta principal sin enviar el formulario por accidente.]
- [Se mantienen estética, portada, orden de scrolls y formato incremental de los documentos.]

NO SIRVE SI:
- [Las mini encuestas repiten un resultado fijo o confirman un guardado de Spotify sin autorización.]
- [El selector deja partes de la interfaz sin traducir o la página pierde la identidad UNLOOP.]

LO SABRÉ PORQUE: [Puedo completar cada encuesta, reproducir las vistas previas disponibles y cambiar ES/EN; el guardado pide conectar Spotify si todavía no está autorizado.]
