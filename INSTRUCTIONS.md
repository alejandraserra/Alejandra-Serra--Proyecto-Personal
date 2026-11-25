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
