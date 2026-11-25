<!--
LOG.md · ¿Qué hemos probado y qué ha pasado?
El registro de lo que has probado con la IA y de qué ha pasado.
- Una entrada por petición, con su fecha, en pocas líneas.
- Lo importante es «Aprendido»: la próxima vez irá a tu criterio o a tu SOUL.md.
- También va en los archivos del proyecto: así la IA sabe qué ya no funciona.
- Lo puede generar / actualizar la IA: revisa lo que escribe.
-->

# LOG · [UNLOOP]

## Secciones de la web
- Scroll 01 · Inicio `#portada` · pregunta central, marca y llamada a explorar.
- Scroll 02 · Encuesta `#encuesta` · preferencias y propuestas de descubrimiento.
- Scroll 03 · Nosotros `#nosotros` · origen del proyecto y fotografías.
- Scroll 04 · Descubre `#descubre` · Familiar Territory, Crossover y Out of Comfort.
- Scroll 05 · Mi espacio `#account-panel` · loops, novedades y conciertos tras conectar Spotify.
- Pie · onda UNLOOP y vuelta al inicio.

## [18/11] · [Primera propuesta web]
Criterio: [crear una primera versión navegable de UNLOOP con identidad visual, fotografía, frase principal, navegación y encuesta usable. ✅]
Aprendido: [la encuesta puede recoger artistas, sonidos, moods y distancia de descubrimiento sin acceder a Spotify. El resumen es local y orientativo; todavía no hay un sistema de recomendaciones real. Los PDF de referencia no pudieron abrirse en la vista previa disponible, así que la propuesta se basó en CONTEXT.md. La fotografía y las tipografías se cargan desde servicios externos.]

## [18/11] · [Ajuste visual según las referencias]
Criterio: [rehacer la portada siguiendo las capturas: fondo negro, cabecera carbón, tipografía gruesa blanca, logo multicolor, onda de sonido y acentos azul, naranja, verde, amarillo y turquesa. Añadir recorrido hacia la encuesta dentro de la página. ✅]
Aprendido: [la portada sigue la composición de las capturas y la encuesta muestra una selección musical de ejemplo a partir de los géneros elegidos. No hay conexión con Spotify ni catálogo conectado; la selección se identifica como una primera muestra, no como un análisis del historial personal.]

## [23/11] · [Logo y navegación]
Criterio: [usar el logo proporcionado, explicar el origen del proyecto en “Nosotros”, renombrar la sección de exploración y dejar el menú solo tras el botón de tres líneas. Cambiar el enlace del encabezado a “Inicia sesión”. ✅]
Aprendido: [el logo de la captura se guardó en assets/unloop-logo.png. El menú inferior desapareció; la navegación se abre desde el icono hamburguesa. “Inicia sesión” abre una maqueta visual y avisa que el acceso todavía no está conectado.]

## [23/11] · [Iconos, logo transparente y fotos]
Criterio: [usar los iconos de Google, Apple e Instagram mostrados en la referencia; quitar el fondo del logo y cambiar las fotos de “Nosotros” manteniendo el tratamiento visual. ✅]
Aprendido: [el logo ahora tiene transparencia real; los iconos son SVG vectoriales; las tres fotos del collage muestran escenas de escucha, vinilos y exploración musical. Se mantuvo la composición y el tono de color existentes.]

## [23/11] · [Un único botón principal]
Criterio: [unir “UNLOOP — Break the listening loop” y “Encuentra tu próximo loop” en una sola caja azul que lleve a la encuesta. ✅]
Aprendido: [el mensaje de marca y la llamada a la acción forman ahora un único enlace visual hacia la encuesta; se eliminó la segunda caja azul.]

## [23/11] · [Paleta y encuesta]
Criterio: [recuperar las imágenes anteriores de “Nosotros”, unificar los acentos con la paleta de la onda y probar un formato distinto para la encuesta. ✅]
Aprendido: [se recuperó el collage anterior; los acentos ahora usan amarillo, naranja, rosa, lila y azul. La encuesta mantiene sus preguntas y pasos, pero pasa de una tarjeta compacta a una composición amplia con opciones en mosaico.]

## [23/11] · [Tipografía Crossover y repeat]
Criterio: [poner en blanco el texto de la tarjeta Crossover y dar a “repeat” un degradado rainbow como la onda principal. ✅]
Aprendido: [Crossover conserva su fondo amarillo con texto blanco sombreado; “repeat” usa el degradado amarillo, naranja, rosa, lila y azul de UNLOOP.]

## [23/11] · [Interacción de tarjetas y encuesta]
Criterio: [usar el logo real en el pie, hacer más grandes y desplegables los niveles de descubrimiento, animar y enlazar las fotos de Nosotros, retirar adornos y dar más juego visual a la encuesta. ✅]
Aprendido: [las tarjetas explican su nivel al abrirse; Crossover pasa a lila dentro de la paleta y mantiene texto blanco; las fotos se mueven, crecen al pasar el cursor y llevan a Descubre; la encuesta suma idioma como quinta pregunta y una onda rainbow.]

## [23/11] · [Cuenta y conexión musical]
Criterio: [preparar el acceso con Spotify, guardar loops como playlists privadas, crear nuevos loops a partir de artistas más escuchados, mostrar lanzamientos recientes y permitir buscar conciertos por ciudad.]
Aprendido: [se añadió conexión OAuth PKCE en el navegador, almacenamiento de loops en playlists privadas de Spotify, lectura de artistas y lanzamientos, creación de loops por estilos, y búsqueda de conciertos con Ticketmaster. Falta añadir el Client ID de Spotify y la API key de Ticketmaster en config.js para activar las conexiones; Ticketmaster requiere además una clave y permiso de acceso.] 

## [04/11] · [Preparar las instrucciones para diseñar la encuesta]
Criterio: [definir una petición clara para crear una encuesta que recoja los gustos musicales de los usuarios, sin depender de Spotify y teniendo en cuenta los tres niveles de descubrimiento. 1 vuelta. ✅. [✅ / ❌]
Aprendido: [antes de diseñar la encuesta, hay que definir qué información necesitamos recoger y cómo se utilizará para orientar los descubrimientos. No debemos dar por hecho que tenemos acceso al historial musical de los usuarios.].

## [23/11] · [Ajustes de Descubre y encuesta]
Criterio: [hacer más visibles los tres niveles en escritorio, sustituir la tarjeta amarilla por un color de la onda, mantener solo la estrella de Out of Comfort, enlazar y animar las fotos, desplegar más información al abrir cada nivel y dar más ritmo visual a la encuesta. ✅]
Aprendido: [las tarjetas crecen en pantallas grandes y muestran su explicación al abrirlas; las fotos flotan y enlazan con Descubre; la encuesta suma una onda animada en la paleta UNLOOP y se retiran los adornos gráficos que no encajan.]

## [23/11] · [Espaciado y ondas]
Criterio: [dar más aire a la página, separar la onda principal del botón, cambiar la foto de “Lo que ya conoces”, quitar la onda decorativa de la encuesta y repetir en el pie la onda animada de portada. ✅]
Aprendido: [aumentar espacios y tamaños por sección aclara la lectura sin cambiar la estructura; compartir la onda de portada en el pie mantiene la identidad visual más coherente que añadir otro dibujo.]

## [23/11] · [Despliegue de niveles]
Criterio: [abrir un solo nivel de “Descubre a tu manera” cada vez y mantener los otros cuadrados en su tamaño original. ✅]
Aprendido: [las tarjetas de niveles deben funcionar como un acordeón exclusivo y alinearse al inicio para que el contenido abierto no estire las tarjetas vecinas.]

## [23/11] · [Frase de portada]
Criterio: [cambiar la pregunta principal por “¿POR QUÉ TENIENDO ACCESO A TANTA DIVERSIDAD MUSICAL, SEGUIMOS ESCUCHANDO LO QUE YA CONOCEMOS?”. ✅]
Aprendido: [mantener literalmente la pregunta central elegida para UNLOOP en la portada.]

## [23/11] · [Código y documentos por scrolls]
Criterio: [ordenar el código de la página única por secciones y actualizar SOUL.md, CONTEXT.md e INSTRUCTIONS.md sin cambiar su estructura base. ✅]
Aprendido: [las secciones de scroll se identifican en el HTML; los estilos están en style.css y el JavaScript mantiene sus interacciones separadas por función. El registro conserva su formato y añade un mapa breve de secciones.]

## [23/11] · [Espaciado de portada]
Criterio: [presentar la pregunta en cuatro líneas exactas y separar visualmente el titular, el botón y la onda. ✅]
Aprendido: [fijar cada línea y reservar espacio vertical evita que el contenido se amontone o se cruce en distintas pantallas.]

## [25/11] · [Fichas del loop]
Criterio: [crear una ficha por cada sección de scroll trabajada, con las decisiones de Alejandra y Codex y quién verifica el resultado. ✅]
Aprendido: [las fichas documentan el alcance de las decisiones de Codex y dejan la validación visual y de contenido en manos de Alejandra; Codex comprueba comportamiento y publicación.]

## [25/11] · [Encuesta primero y menú principal]
Criterio: [poner la encuesta al inicio, ordenar el resto según prioridad para quien visita la web y rehacer el menú desplegable a pantalla completa siguiendo las referencias. ✅]
Aprendido: [la primera sección visible ahora es la encuesta; después se presentan la pregunta y la identidad de UNLOOP, el origen del proyecto y los tres niveles de descubrimiento. El menú abre una navegación oscura de pantalla completa con destinos grandes, números, flechas y acceso prioritario a la encuesta. Sus estilos y comportamiento quedan en menu.css y menu.js.]

## [25/11] · [Orden de portada y encuesta]
Criterio: [mantener la pregunta de UNLOOP en la primera pantalla y dejar la encuesta en el segundo scroll; el único botón azul dice «Encuentra tu próximo loop» y lleva a la encuesta. Mejorar el icono de Spotify en el acceso. ✅]
Aprendido: [la portada vuelve a abrir la página y presenta primero la pregunta; la encuesta queda justo después. El menú refleja Inicio (01) y Encuesta (02). El acceso a Spotify usa un icono más reconocible en una pastilla oscura para separarlo del fondo verde.]

## [25/11] · [Acceso, encuesta y Spotify]
Criterio: [preparar correo, Google, Apple e Instagram con acceso real; consultar canciones de catálogo desde la encuesta y guardar los loops en Spotify. ✅ código preparado · pendiente configuración externa]
Aprendido: [Supabase Auth gestiona el acceso por correo y redes; Spotify OAuth PKCE permite guardar canciones como playlists o añadirlas a una existente. La encuesta usa catálogos reales y guarda localmente sus respuestas para loops posteriores. Por las condiciones de Spotify no se leen playlists para perfilar gustos ni se consulta el top de artistas. Faltan el Client ID de Spotify y el proyecto/proveedores de Supabase; para probar Google, Apple e Instagram también hacen falta sus credenciales de proveedor.]

## [25/11] · [Corrección final de portada e icono]
Criterio: [dejar clara la secuencia de la web en el código: pregunta en el primer scroll, encuesta en el segundo; hacer reconocible el icono de Spotify junto al acceso. ✅]
Aprendido: [la encuesta debe ser el destino del único botón azul, no el contenido inicial. El botón de Spotify se inserta junto al acceso y usa el símbolo verde con ondas negras sobre carbón. Para que inicien sesión Google y Apple falta configurar el proyecto y los proveedores de Supabase; para conectar Spotify falta el Client ID.]
