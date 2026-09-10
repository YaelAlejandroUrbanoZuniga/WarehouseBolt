# Estándar de Interfaz — Aplicaciones Internas

**Versión 6.1 · Documento normativo**

Este documento define cómo se ve y cómo se comporta cualquier aplicación web
interna construida bajo este estándar. No describe una aplicación en
particular: describe el conjunto de decisiones ya tomadas, con valores exactos,
para que ninguna se vuelva a tomar desde cero.

Va acompañado de un kit de componentes (`Componentes_UI_Nexteer_v6/`), que es
su implementación de referencia. Los dos documentos son complementarios, no
intercambiables: este `.md` explica la regla y el porqué — es lo que se lee
para entender el sistema o diseñar un componente que el kit todavía no tiene.
El kit es esa misma regla ya escrita como código — es lo que se usa para
construir. **Cuando un valor del kit no coincide con lo que aquí se
describe, el kit tiene un defecto de implementación** — nunca una segunda
versión del criterio.

---

## 0. Cómo se usa este documento

### 0.1 Si vas a diseñar o a estandarizar componentes

Las secciones 1–5 son el fundamento (principios, color, tipografía, geometría).
La sección 6 es la especificación componente por componente. La sección 10 es la
lista de verificación con la que se aprueba o se rechaza una pantalla.

Cada valor numérico de este documento es **normativo**. Cuando dice `padding:
20px` significa exactamente 20, no "alrededor de 20".

### 0.2 Si vas a generar una app con una IA

El flujo es:

1. Se le entrega este `.md` **completo** y el kit `.zip` **completo**.
2. Se le pide que copie `tokens/` y `estilos/global.css` **antes** de escribir
   la primera pantalla.
3. Se describe únicamente lo específico del dominio (qué entidades, qué
   pantallas, qué reglas de negocio). Nada de color, tamaño ni espaciado: eso
   ya está resuelto aquí.

Hay una plantilla de prompt lista para copiar en la **sección 11**.

### 0.3 Vocabulario

| Término | Significa |
|---|---|
| **Token** | Valor con nombre (color, tamaño, sombra) que vive en un solo archivo y se importa. Nunca se escribe el número a mano. |
| **Rol de color** | Para qué sirve un color (`peligro`, `superficie`, `borde`), no cómo se ve. Los roles no cambian entre sistemas; los hex sí. |
| **Superficie** | Cualquier plano blanco elevado sobre el fondo: card, modal, panel, tabla. |
| **Acento contextual** | Color que un componente recibe por parámetro porque depende del contenido (el color de una categoría, de un estado, de un módulo). |
| **Banda** | Franja de color sólido en la parte superior de un modal o panel. |

---

## 1. Los siete principios

Todo lo demás en este documento se deriva de estos siete. Cuando una situación
no esté cubierta, se resuelve con ellos.

### 1.1 Si algo se puede interpretar de dos formas, está mal documentado

Cuando dos pantallas del mismo sistema se ven distinto, la pregunta correcta no
es "¿cuál está mal?" sino "¿qué parte del estándar era ambigua?". Decir "el
icono va a la derecha" sin decir *contra qué se alinea* produce dos
implementaciones legítimas y distintas.

### 1.2 Ningún valor se escribe a mano

Colores, alto del header, ancho del sidebar, z-index, duraciones: todo se
importa de `tokens/`. Un número copiado siempre termina desincronizado, y la
desincronización rara vez se ve en una revisión rápida — se ve en producción,
como 4 px de contenido tapado.

### 1.3 La jerarquía se construye con tamaño, peso y color; nunca con más fuentes

Una sola familia tipográfica en todo el sistema. Ni siquiera "solo para los
números" o "solo para el logo".

### 1.4 Todo lo que se puede clicar tiene que demostrarlo

Botón, card, fila, celda, chip, link, pestaña: si responde al clic, cambia al
pasar el mouse y tiene foco visible con teclado. Sin excepción.

### 1.5 Una lista nunca pasa de "cargando" a la nada

Los tres estados —cargando, vacío, error— son obligatorios en toda pantalla que
pida datos. Un `EmptyState` no es un extra: es parte del contrato.

### 1.6 Nada destructivo ocurre en un solo clic

Eliminar, editar de forma significativa, mover algo de estado: siempre pasa por
una confirmación explícita. Y el borrado corre **en el servidor primero**; si
falla, se vuelve a pedir la lista en lugar de adivinar qué sobrevivió.

### 1.7 Toda animación se apaga bajo `prefers-reduced-motion`

No es un extra de accesibilidad. Hay personas para las que el movimiento causa
mareo real. Si agregas un `@keyframes`, agregas su clase al bloque
`@media (prefers-reduced-motion: reduce)` en el mismo commit.

---

## 2. Fundamento: la arquitectura de tokens

```
tokens/
  colores.ts      Núcleo de marca, grises funcionales, opacidades derivadas
  tipografia.ts   Familia + escala completa con destino de cada entrada
  espaciado.ts    Escala de 4px, paddings por tipo, sombras, radios, anchos
  layout.ts       Geometría del shell y escala de z-index
  motion.ts       Duraciones, curvas, nombres de clases de animación
  hover.ts        Patrones de hover reutilizables
```

**Se copian los seis, completos, siempre, primero.** No se copia parcial: cada
archivo referencia a los otros.

### 2.1 Tailwind sí, pero solo para layout

Se usa Tailwind **únicamente** para utilidades de posición y flex: `flex`,
`items-center`, `justify-between`, `fixed`, `w-full`, `relative`, `min-w-0`.

**Todo** color, tamaño de fuente, padding, radio y medida puntual va en el
atributo `style={{ }}`.

No es preferencia estética. Las clases de Tailwind se compilan y se purgan: una
IA que genera `bg-red-600` produce un rojo que **no es** el de la marca y que
además es invisible en una revisión de código, porque *parece* correcto. Un
`backgroundColor: '#DC0202'` en `style` se verifica a simple vista y con un
`grep`. Si el estándar depende de que alguien note la diferencia entre
`red-600` y `red-700`, el estándar no existe.

### 2.2 Entorno de referencia

Versiones exactas, no "las últimas disponibles":

| Herramienta | Versión |
|---|---|
| Node.js | 20.x LTS |
| React | 18.3.1 |
| TypeScript | 5.5.3 |
| Vite | 5.4.2 |
| Tailwind CSS | 3.4.1 |
| React Router DOM | 7.15.1 |
| Font Awesome | 7.2.0 (`react-fontawesome` 3.3.1) |
| Recharts | 3.8.1 — solo si hay gráficas |

---

## 3. Color

### 3.1 Los seis colores principales — el núcleo que nunca cambia

Estos seis son los únicos colores que el estándar fija por hex exacto. Son el
esqueleto visual que hace que dos sistemas distintos se reconozcan como parte
de la misma familia: **no se sustituyen, no se aclaran, no se oscurecen, no se
reinterpretan por sistema.**

| Rol | Hex | Dónde va — exactamente |
|---|---|---|
| **Header / estructura de marca** | `#AA0202` | Header global. Fondo del panel de identidad del login. Botón circular de colapsar sidebar. |
| **Acción** | `#DC0202` | Botón primario. Badge de conteo. Barra del ítem activo del sidebar. Franja de título de panel lateral. Página actual en la paginación. Anillo del `LoadingState`. Contorno de foco. Subrayado de pestaña activa. Asterisco de campo obligatorio. |
| **Sidebar / texto secundario** | `#808285` | Fondo del sidebar. **Y además** todo el texto secundario del sistema: subtítulos, labels, texto de ayuda, celda secundaria de tabla, hora de notificación. |
| **Fondo de la aplicación** | `#EEEEEE` | Fondo de **todas** las pantallas, detrás del contenido de cada módulo. Nunca blanco: el blanco es la superficie, el gris es el lienzo. Sin ese contraste las cards desaparecen. |
| **Superficie** | `#FFFFFF` | Toda card, modal, panel, tabla, dropdown, toast. Texto sobre header, sidebar y bandas de color. |
| **Texto principal** | `#000000` | Títulos, valores, dato principal de tabla, texto de input. |

**Los dos rojos no son intercambiables.** `#AA0202` es identidad (estructura
permanente: el header, el panel de marca). `#DC0202` es acción (lo que el
usuario puede tocar). Si el botón primario fuera `#AA0202` se confundiría con
el header; si el header fuera `#DC0202` compitiría con cada botón de la
pantalla.

**Estos seis se aplican en cualquier sistema construido bajo este estándar,
sea o no de la misma marca.** Si el sistema pertenece a otra marca, se
sustituyen los seis por la paleta de esa marca — pero se sustituyen **juntos y
una sola vez**, en el token compartido, nunca pantalla por pantalla.

### 3.2 Todo lo demás: libre, con una sola condición

Fuera de los seis colores del núcleo, el resto de la paleta —colores de
estado, categorías, acentos, badges, series de datos, cualquier necesidad
propia del sistema o de quien lo construye— **no está fijado por este
estándar.** Cada proyecto elige los tonos secundarios y terciarios que
necesite: un verde de éxito, un dorado de patrocinio, siete colores de
categoría, el que haga falta.

La única condición no es sobre qué color elegir, sino sobre cuándo NO inventar
uno nuevo:

> **Si un color ya cumple un rol en el sistema, se reutiliza ese color para
> cualquier otro elemento que cumpla el mismo rol — no se elige una tonalidad
> parecida.** Solo se introduce un tono distinto cuando el caso concreto
> requiere, de forma deliberada, un contraste que el color ya existente no da.

En la práctica, esto es lo que separa un sistema ordenado de uno con seis
grises casi idénticos eligiéndose a ojo: si el texto secundario del sistema ya
tiene un tono, un texto secundario nuevo usa ese tono — no uno "parecido pero
un poco más oscuro". Si ya existe un fondo de aviso informativo, un aviso
informativo nuevo usa ese fondo, no inventa el suyo. La pregunta que se hace
antes de escribir un hex nuevo es **"¿ya existe algo en el sistema que cumple
este mismo rol?"**, no "¿está este color en una lista permitida?".

Esta regla aplica **dentro de un mismo rol semántico** (texto secundario con
texto secundario, fondo de aviso con fondo de aviso), no entre roles distintos:
un color de categoría y un color de SLA pueden ser tonos parecidos sin
problema, porque no compiten por el mismo trabajo visual.

**Quién decide si un caso "requiere forzosamente" un tono distinto** es quien
construye esa pantalla — pero la decisión es sobre necesidad real de contraste
o de distinción semántica, no sobre preferencia. Un texto secundario que se ve
"un poco apagado" con el gris ya existente no es un caso que lo amerite; un
badge que necesita distinguirse de otros seis badges del mismo color, sí.

### 3.3 Derivar tonos por opacidad, no a ojo

Cuando un color —del núcleo o de los libres— necesita una versión más clara
para un fondo (el círculo detrás de un icono, una fila seleccionada, el fondo
de un badge), **no se elige un hex distinto**: se deriva el mismo hex con un
sufijo alfa hexadecimal.

| Sufijo | Opacidad aprox. | Uso canónico |
|---|---|---|
| `14` | ~8 % | Fondo de hover de botón de texto. |
| `1F` | ~12 % | Fondo del círculo de un icono. Fila seleccionada. |
| `26` | ~15 % | Fondo de badge / chip de estado. Trigger de filtro activo. |

```ts
backgroundColor: color + '1F'   // ✔ correcto — el mismo color, más claro
backgroundColor: '#F5D0D0'      // ✘ inventado a ojo, no se deriva de nada
```

Esto es lo que permite que un sistema con muchos colores de categoría siga
viéndose ordenado aunque cada categoría tenga su propio tono libre: todos los
fondos derivados tienen exactamente la misma intensidad relativa respecto a su
color base, sin importar cuál sea ese color.

### 3.4 Grises funcionales de superficie

Estos no son parte del núcleo de marca, pero **sí están fijados** porque
resuelven un problema que reaparece en cualquier sistema con tablas, listas y
paneles: la superposición de superficies casi blancas necesita orden, o cada
pantalla termina eligiendo un gris claro distinto sin que ninguno signifique
algo.

| Rol | Hex | Uso exacto |
|---|---|---|
| `borde` | `#D1D3D4` | Borde de input, de botón secundario, flecha de orden inactiva. |
| `bordeSuave` | `#E0E0E0` | Borde de barra de búsqueda, separador de fila, borde de dropdown. |
| `encabezadoTabla` | `#F7F7F7` | **Solo** encabezado de tabla y filas impares (zebra). |
| `hoverFila` | `#F5F5F5` | Hover de fila de lista, de ítem de menú, de botón secundario. |
| `hoverCelda` | `#EFEFEF` | Hover de celda clicable dentro de una matriz. |
| `separadorInterno` | `#F0F0F0` | Separador entre ítems **dentro** de una card (no entre filas de tabla). |
| `superficieHundida` | `#FAFAFA` | Zona de entrada dentro de un panel (composer de nota, dropzone), fila de detalle expandida. |

**La regla práctica:** más claro = más al fondo. Zebra de tabla (`#F7F7F7`) es
más notorio que un separador interno (`#F0F0F0`) porque tiene que leerse a lo
largo de una fila completa.

Un sistema puede necesitar un gris de superficie que no está en esta lista —
en ese caso aplica la regla de §3.2: se revisa primero si alguno de estos siete
ya cumple el rol antes de introducir uno nuevo.

### 3.5 Contraste mínimo

Independientemente de qué tono se elija para un color libre: texto normal
≥ 4.5:1 contra su fondo; texto ≥ 18 px o en peso 700, ≥ 3:1. Si un color no
pasa como texto, se usa como fondo con texto oscuro encima, no como texto.

**El color nunca es el único portador de información** (ver también §9): un
punto de estado lleva `title`, una fila de error lleva icono además de color.
Esto importa más cuando la paleta secundaria es libre: dos tonos que una
persona distingue bien pueden ser indistinguibles para otra.

### 3.6 Cómo leer un hex fuera de §3.1 en el resto de este documento

De aquí en adelante, cualquier valor hex que aparezca en una especificación de
componente (§6) y que **no** sea uno de los seis del núcleo (§3.1) es el valor
que usa la implementación de referencia — exacto, no aproximado, pero **libre
de sustituir** bajo la regla de §3.2. Por ejemplo, el link interno de la
implementación de referencia es `#0084C0` y el color de éxito es `#6ABF4B`:
un proyecto nuevo puede quedarse con esos tonos o elegir los suyos, pero una
vez elegidos, se fijan para ese rol en todo el sistema y no vuelven a variar
pantalla por pantalla.

La medida (tamaño, padding, radio, posición) de cada componente en §6 **sí es
siempre normativa**, sea cual sea el color que el proyecto elija.


## 4. Tipografía

### 4.1 Familia única

```css
* { font-family: 'Inter', sans-serif; box-sizing: border-box; }
```

Se aplica con el selector universal, no clase por clase. Una sola familia; si el
sistema es de otra marca, se cambia **solo** `fontFamily` y la escala completa se
mantiene: la escala es un patrón de jerarquía, no depende de la fuente.

Sustitutos aceptables si Inter no está disponible: Arial, Helvetica. Nunca
serifas, decorativas ni manuscritas.

### 4.2 La escala completa

Cada entrada tiene **un destino**. Si un texto nuevo no encaja en ninguna, se usa
la más parecida — no se inventa un tamaño intermedio.

#### Pantalla

| Nombre | px | Peso | Color |
|---|---|---|---|
| `tituloPantalla` | 32 | 700 | `#000000` |
| `subtituloPantalla` | 16 | 400 | `#808285` |
| `tituloSeccion` | 14 | 700 | `#000000` |
| `etiquetaSeccion` | 12 | 700 | `#808285` · `letter-spacing: 0.04em` · MAYÚSCULAS |

#### KPI

| Nombre | px | Peso | Color |
|---|---|---|---|
| `kpiEtiqueta` | 14 | 500 | `#808285` |
| `kpiNumero` | 30 | 700 | `#000000` |
| `kpiSubtexto` | 11 | 400 | `#808285` |

#### Tabla

| Nombre | px | Peso | Color |
|---|---|---|---|
| `tablaEncabezado` | 13 | 700 | `#000000` |
| `tablaCeldaPrincipal` | 13 | 700 | `#000000` |
| `tablaCeldaSecundaria` | 13 | 400 | `#808285` |
| `tablaCeldaNumerica` | 13 | 600 | `#000000` |
| `tablaDelta` | 12 | 700 | según signo |
| `tablaMeta` | 12 | 400 | `#808285` (folio, código, id) |

#### Navegación

| Nombre | px | Peso | Color |
|---|---|---|---|
| `sidebarItem` | 16 | 500 | según activo/inactivo |
| `sidebarUsuario` | 15 | 600 | `#FFFFFF` |
| `sidebarRol` | 12 | 400 | `rgba(255,255,255,0.70)` |
| `itemMenu` | 13 | 400 | `#000000` |
| `pestana` | 14 | 400 / **700** activa | `#808285` / `#000000` |
| `breadcrumb` | 12 | 500 | `#0084C0`, último `#000000` peso 600 |

#### Modales y paneles

| Nombre | px | Peso | Color |
|---|---|---|---|
| `modalTitulo` | 20 | 700 | `#FFFFFF` · `letter-spacing: -0.01em` |
| `modalSubtitulo` | 13 | 400 | `rgba(255,255,255,0.75)` |
| `modalCuerpo` | 13 | 400 | `#808285` · `line-height: 1.6` |
| `panelTitulo` | 15 | 700 | `#FFFFFF` |
| `panelPestana` | 13 | 600 | según activo |

#### Estados, notificaciones y avisos

| Nombre | px | Peso | Color |
|---|---|---|---|
| `estadoTitulo` | 15 | 700 | `#000000` |
| `estadoDescripcion` | 13 | 400 | `#808285` |
| `notificacionTexto` | 13 | 600 | `#000000` · `line-height: 1.4` |
| `notificacionHora` | 12 | 400 | `#808285` |
| `toastTitulo` | 13 | 700 | `#000000` · `line-height: 1.4` |
| `toastMensaje` | 12 | 400 | `#808285` · `line-height: 1.5` |

#### Botones, links y formularios

| Nombre | px | Peso | Color |
|---|---|---|---|
| `botonPrimario` | 14 | 700 | `#FFFFFF` |
| `botonModal` | 13 | 700 | `#FFFFFF` |
| `botonSecundario` | 13 | 600 | `#000000` |
| `linkInterno` | 13 | 500 | `#0084C0` — sin subrayado en reposo |
| `linkExterno` | 13 | 400 | `#02B3E1` — subrayado siempre |
| `inputTexto` | 13 | 400 | `#000000` |
| `labelFormulario` | 13 | 400 | `#808285` |
| `mensajeError` | 12 | 400 | `#DC0202` |
| `insignia` | 11 | 500 | color del estado |
| `insigniaCompacta` | 11 | 700 | color del estado |

#### Login (única pantalla con escala propia)

| Nombre | px | Peso | Color |
|---|---|---|---|
| `loginCategoria` | 13 | 600 | `rgba(255,255,255,0.85)` · `0.08em` · MAYÚSCULAS |
| `loginTitulo` | 55 | 800 | `#FFFFFF` · `line-height: 1.15` · `-0.02em` |
| `loginDescripcion` | 16 | 400 | `rgba(255,255,255,0.80)` · `line-height: 1.6` |
| `loginBienvenida` | 30 | 700 | `#000000` |
| `loginLabel` | 16 | 500 | `#484848` |
| `loginBoton` | 16 | 700 | `#FFFFFF` |

### 4.3 Cuándo se puede salir de la escala — y cuándo no

**Sí se puede, con justificación escrita en el código:**

- **Un número que es el contenido principal de la pantalla.** Un KPI que domina
  un dashboard puede subir a 40 px. Se documenta por qué.
- **La portada del login.** Ya está fuera: 55 px / peso 800. Es la única
  pantalla sin chrome, y compite con una foto de fondo.
- **Un icono decorativo grande** dentro de un estado vacío (hasta 40 px).

**No se puede, nunca:**

- Bajar de **11 px** en texto que el usuario tiene que leer. Un `fontSize: 9`
  o `10` solo es admisible en un badge de conteo de dos dígitos, donde el número
  también se comunica por posición y color.
- Inventar un peso intermedio. Los pesos del sistema son **400, 500, 600, 700,
  800**. Nada de 300 ni 350.
- Usar tamaño para compensar un problema de jerarquía. Si un título no destaca,
  el problema es el espaciado alrededor, no que le falten 2 px.

**Regla práctica:** el sistema debe poder describirse con ≤ 12 tamaños
distintos. Si al auditar una pantalla aparecen 18, hay tamaños que se eligieron
sin criterio.

### 4.4 Segunda tipografía: cuándo

**Nunca**, con una sola excepción: `font-family: monospace` para contenido que
es literalmente código, un hash, un identificador que se copia y pega, o una
columna de números que se alinean verticalmente. En ese caso se declara
explícitamente en el elemento, no en un token global.

Una segunda tipografía "de display" para títulos está prohibida. Cambia la caja
óptica y hace que dos pantallas del mismo sistema se lean como dos productos.

---

## 5. Geometría, espaciado y elevación

### 5.1 Geometría del shell — fuente única

Todo elemento que se posicione respecto al header, al sidebar o al área de
contenido importa estos valores. **Prohibido escribir el número a mano.**

```ts
export const HEADER_HEIGHT            = 55;   // px, header fijo
export const SIDEBAR_WIDTH            = 240;  // expandido
export const SIDEBAR_WIDTH_COLLAPSED  = 60;   // colapsado — NO 56, NO 64
export const MAIN_PADDING_TOP         = HEADER_HEIGHT + 32;  // 87
export const MAIN_PADDING_X           = 32;
export const MAIN_PADDING_BOTTOM      = 32;
export const CONTENT_HEIGHT_CSS =
  `calc(100vh - ${MAIN_PADDING_TOP}px - ${MAIN_PADDING_BOTTOM}px)`;
export const ANCHO_MINIMO             = 1280; // body { min-width: 1280px }
```

**Por qué 55 px de header y no 44.** Se subió de forma intencional: con 44, el
velo del panel de notificaciones invadía 11 px del propio header al abrirse. Si
alguien lo "corrige" de vuelta a 44, el panel se vuelve a encimar.

**Por qué el sidebar colapsado mide 60 y no 56.** Porque el `marginLeft` del
`<main>` tiene que leer exactamente la misma constante. Los dos números
distintos son el error más común de este layout y se manifiesta como 4 px de
contenido tapado — invisible en una revisión, molesto en uso diario.

**Aplicación de escritorio.** No hay breakpoints de teléfono ni de tablet. Lo
que sí se soporta: zoom del navegador y laptops de 1280 px.

### 5.2 Escala de z-index — cerrada

Prohibido inventar un nivel nuevo o usar `9999`.

| Nivel | Valor |
|---|---|
| Sidebar | 30 |
| Header global | 50 |
| Dropdown (menú de usuario, popover de filtros) | 50 |
| Velo de panel lateral | 98 |
| Panel lateral | 99 |
| Overlay de carga a pantalla completa | 200 |
| Tooltip flotante | 300 |
| Modal centrado + su velo | 10001 |
| Toast | 10002 |

El toast va **por encima** del modal a propósito: un error tiene que poder verse
aunque haya un modal abierto.

### 5.3 Escala de espaciado

Todo padding, gap y margin es múltiplo de 4:

```
4 · 8 · 12 · 16 · 20 · 24 · 28 · 32
```

Fuera de la escala solo se sale por una razón estructural documentada (por
ejemplo, un padding de 15 px que existe para que un ítem mida exactamente 48 px
de alto con un icono de 18 px adentro).

### 5.4 Gaps por contexto — tabla normativa

Este es el punto donde más se improvisa. Aquí queda fijo.

| Contexto | Gap | Por qué |
|---|---|---|
| Icono ↔ texto dentro de un botón | **6** | Se leen como una unidad. |
| Icono ↔ texto en un título de sección | **8** | El título ya tiene peso; necesita un poco más de aire. |
| Icono ↔ texto en un ítem de sidebar | **10** | Compensa el ancho fijo de 40 px de la caja del icono. |
| Icono ↔ texto en un ítem de menú | **12** | Menú desplegable: separación mayor que un botón. |
| Entre botones de una barra de acciones | **8** | |
| Entre botones de un footer de modal | **12** | Cancelar y Confirmar deben ser difíciles de confundir. |
| Entre chips / badges en una línea | **6** | |
| Entre campos de un formulario (vertical) | **16** | |
| Entre columnas de un formulario de 2 columnas | **12** | |
| Entre campos dentro del popover de filtros | **12** | |
| Entre cards de una grilla | **20** | |
| Entre cards de KPI de una fila | **16** | Son más pequeñas y se leen en conjunto. |
| Entre bloques mayores de una pantalla | **24** | Título → toolbar → contenido. |
| Entre toasts apilados | **10** | |
| Entre el avatar y el texto de una fila de nota | **10** | |
| Icono de estado ↔ texto en toast/notificación | **10** | |
| Entre la etiqueta y su control (vertical) | **4** | Deben leerse pegados. |

**La regla que los genera todos:** el gap crece con la independencia semántica
de los elementos. Icono y texto de un botón son *una* cosa (6). Dos botones son
*dos* cosas (8). Dos bloques de la pantalla son dos regiones (24).

### 5.5 Sombras — progresivas

A mayor interacción, mayor sombra. Siempre negro con alfa, nunca teñida.

| Token | Valor | Uso |
|---|---|---|
| `card` | `0 1px 4px rgba(0,0,0,0.08)` | Reposo de toda card, tabla, `EmptyState`. |
| `selectable` | `0 2px 6px rgba(0,0,0,0.10)` | Elemento explícitamente seleccionable. |
| `cardHover` | `0 4px 12px rgba(0,0,0,0.13)` | Hover de card. **Un solo valor** — no 0.13 en un lado y 0.15 en otro. |
| `btnHover` | `0 6px 16px rgba(0,0,0,0.18)` | Hover de botón primario. |
| `dropdown` | `0 8px 24px rgba(0,0,0,0.20)` | Modal, dropdown, tooltip, toast, card de login. |
| `panelLateral` | `-4px 0 24px rgba(0,0,0,0.20)` | Panel anclado al borde derecho. |
| `botonFlotante` | `0 2px 6px rgba(0,0,0,0.28)` | Botón circular de colapsar sidebar. |

### 5.6 Border-radius — un valor por tipo, no por pantalla

| Tipo | Radio |
|---|---|
| Card, tabla, dropdown, toast, botón primario | **8** |
| Input, select, textarea, botón secundario, botón dentro de modal | **6** |
| Modal centrado | **12** |
| Badge / chip de estado | **4** |
| Botón de paginación, botón de barra de panel | **4** |
| Avatar, círculo de icono, badge de conteo | **50 %** |
| Popover de filtros | **10** |

**La única forma "píldora" (`999`) permitida** es el badge numérico de conteo
que va pegado a un trigger (el "3" del botón de filtros). Todo lo demás usa 4:
una píldora en un chip de estado lo hace parecer un botón.

**Por qué el botón primario es 8 en una toolbar y 6 dentro de un modal.** El
botón de toolbar es un objeto flotando sobre el fondo gris y se lee como card;
el botón del footer de modal vive dentro de una superficie blanca y se alinea
con los inputs de ese mismo formulario, que son 6. La regla es: **el botón toma
el radio de su vecindario**.

### 5.7 Bordes

- Grosor por defecto: **1 px**. Nunca `0.5px` — se renderiza distinto según la
  densidad de pantalla y produce filas que se ven inconsistentes.
- Separador de fila de tabla: `1px solid #E0E0E0`.
- Separador entre ítems dentro de una card: `1px solid #F0F0F0`.
- Franja de acento de card: `4px solid <color>`, **siempre a la izquierda**.
  Un acento a la derecha se lee como scroll o como borde recortado.

---

## 6. Especificación por componente

Cada componente lista: geometría exacta, colores por estado, comportamiento
obligatorio y errores frecuentes.

---

### 6.1 Header global

```
Altura        55px (HEADER_HEIGHT)
Posición      fixed, top 0, left 0, right 0
z-index       50
Fondo         #AA0202
Padding       0 24px
Contenido     logo a la izquierda · acciones a la derecha
```

**Logo**

- Altura en header: **32 px**. Se ancla por altura, nunca por ancho.
- Ancho mínimo del logo en pantalla: **120 px**. Por debajo, deja de ser legible.
- Espacio libre alrededor: al menos la altura de la letra minúscula del
  logotipo. En el header eso lo resuelve el padding de 24 px.
- **Nunca** se estira, rota, recolorea, fusiona con otro texto ni se le quita
  parte del nombre.
- Sobre fondo rojo u oscuro se usa la versión blanca del logo, sobre fondo claro
  la versión a color. No se generan variantes nuevas.
- Si no hay logo disponible se usa el nombre del sistema en texto: 22 px, peso
  700, `#FFFFFF`, `letter-spacing: 0.12em`.

**Campana de notificaciones**

```
Caja         40 × 36, fondo transparente, sin borde
Icono        23px, blanco
             sin leer > 0  → icono sólido
             sin leer = 0  → icono outline
Badge        16 × 16, círculo, fondo #DC0202, texto blanco 10px peso 700
             posición absolute top 2 right 2
```

**Errores frecuentes**

- Poner el título de la pantalla en el header. El header es global e invariable;
  el título de pantalla vive en el `<main>` (§6.9).
- Hacer el header `sticky` en vez de `fixed`. `fixed` es lo que permite que el
  sidebar y los paneles cuelguen de una constante conocida.

---

### 6.2 Sidebar

```
Ancho         240 expandido · 60 colapsado
Posición      fixed, left 0, top = HEADER_HEIGHT, bottom 0
z-index       30
Fondo         #808285
Transición    width 300ms
```

**Botón de colapsar**

```
30 × 30, círculo, fondo #AA0202, icono blanco 10px (chevron ← / →)
Posición: right -12, top 50%, translateY(-50%)
Sombra: 0 2px 6px rgba(0,0,0,0.28)
```

Va montado sobre el borde derecho, a media altura. Es la única pieza del sistema
que sobresale de su contenedor, y por eso lleva la sombra más marcada.

**Ítem de navegación**

| Estado | Fondo | Texto | Marca |
|---|---|---|---|
| Inactivo | transparente | `#FFFFFF` | — |
| Hover | `rgba(255,255,255,0.08)` | `#FFFFFF` | — |
| Activo | `#EEEEEE` (= fondo de página) | `#000000` | `box-shadow: inset 6px 0 0 #DC0202` |

```
Padding      15px 15px      (produce ítem de ~48px de alto)
Alto mínimo  40
Gap          10
Icono        18px, caja de ancho fijo 40, centrado
Texto        16px, peso 500, sin wrap
```

El ítem activo usa **el color del fondo de página**, no un gris más claro. Así
se lee como si la pantalla "entrara" en el sidebar. La barra roja de 6 px se
hace con `inset box-shadow`, no con `border-left`: un borde desplazaría el
contenido 6 px al activarse.

Al colapsar, el texto se oculta y el icono conserva su caja de 40 px, así que no
se mueve horizontalmente.

**Bloque de usuario (pie del sidebar)**

```
Fondo        tono libre, un poco más oscuro que el sidebar (#808285) — separa
             el bloque sin necesidad de una línea divisoria
Padding      12px 16px
Avatar       32 × 32, círculo, fondo #DC0202, iniciales blancas 11px peso 700
Nombre       15px peso 600 blanco
Rol          12px rgba(255,255,255,0.70)
```

Iniciales = primera letra de las dos primeras palabras del nombre, en mayúscula.

**Menú de usuario**

```
Fondo blanco, radio 8, sombra dropdown, ancho mínimo 180
Ítem: padding 10px 16px, 13px, gap 12, icono 13px con caja de 14
Hover del ítem: fondo #F5F5F5
Separador antes de la acción de salida: 1px #E0E0E0, margin 4px 0
Acción de salida: texto e icono en #DC0202
```

Se cierra al hacer clic afuera (listener en `mousedown` sobre `document`,
excluyendo el propio menú y su trigger).

**Regla dura:** una entrada de menú **nunca** se deja sin `onClick`. Si la
funcionalidad todavía no existe, la entrada no existe. Un ítem que cambia el
cursor y se ilumina para no hacer nada es peor que su ausencia.

---

### 6.3 Iconos

**Una sola librería: Font Awesome.** No se mezcla con Lucide, Material Icons,
Heroicons ni SVGs sueltos. Dos librerías en la misma pantalla se notan aunque
nadie sepa decir por qué: cambian el grosor de trazo y la caja óptica.

**Tamaños por contexto**

| Contexto | px |
|---|---|
| Ítem de sidebar | 18 |
| Campana de header | 23 |
| Dentro de botón primario | 11–12 |
| Dentro de un círculo de KPI (círculo 48) | 20 |
| Dentro de un círculo de notificación (círculo 28) | 13 |
| En un título de sección | 14 |
| En un `EmptyState` (círculo 48) | 18 |
| Decorativo grande en estado vacío | 40 |
| Flecha de orden de tabla | 12 |
| Cerrar (×) de modal / panel | 16 |
| Cerrar (×) de toast | 12 |

**Reglas**

- Un icono acompaña al texto; **no lo sustituye**, salvo en acciones universales
  (cerrar, buscar, expandir) o cuando lleva `title` y `aria-label`.
- El mapa "módulo → icono" vive en **un solo archivo**. La pantalla de carga, el
  ítem de sidebar y el encabezado de ese módulo leen del mismo mapa; si no, se
  desincronizan y el usuario ve un icono al navegar y otro al llegar.
- Iconos sólidos por defecto. Los outline solo para expresar el par
  lleno/vacío del mismo concepto (campana con y sin pendientes, casilla marcada
  y sin marcar).
- El color de un icono sigue la regla de §3.2: si ya existe un color asignado
  al rol que ese icono representa (una categoría, un estado), se usa ese color
  — no se elige un tono parecido "porque este icono es distinto".

---

### 6.4 Botones

#### Primario

```
Fondo        #DC0202        Texto  #FFFFFF, 14px, peso 700
Padding      8px 16px       Radio  8       Gap icono-texto 6
Hover        box-shadow: 0 6px 16px rgba(0,0,0,0.18)
Activo/press sin desplazamiento
Deshabilitado opacity 0.45 · cursor not-allowed · sin hover
```

**El hover del botón primario es sombra, no cambio de color.** Es una sola
regla, y existe porque cuando se permiten las dos, aparecen tres hovers
distintos en el mismo sistema (sombra neutra, sombra teñida de rojo, y
oscurecimiento del fondo) y ninguno se ve mal por separado.

Excepción única y documentada: el botón de acción dentro de `EmptyState`
oscurece a `#AA0202`, porque está sobre una superficie blanca grande donde una
sombra apenas se percibe.

#### Secundario

```
Fondo        #FFFFFF        Texto  #000000, 13px, peso 600
Borde        1px solid #D1D3D4      Radio 6      Padding 8px 16px
Hover        fondo #F7F7F7
```

#### Terciario / de texto

```
Sin fondo ni borde. Texto 13px peso 600 en el color de la acción.
Hover: fondo = color + '14'   Radio 4   Padding 6px 10px
```

#### Destructivo

Idéntico al primario. **No hay un rojo "más rojo" para eliminar**: lo que separa
un borrado de un guardado no es el color del botón, es que el borrado pasa por
`ConfirmDialog` y el guardado no siempre.

#### Botón sobre fondo de color (dentro de una banda)

```
Fondo   rgba(255,255,255,0.14)     Borde 1px solid rgba(255,255,255,0.35)
Texto   #FFFFFF, 13px, peso 600    Radio 8      Hover: fondo → rgba(255,255,255,0.24)
```

Variante de acción principal sobre banda: fondo **blanco sólido** con el texto en
el color de la banda. Es el único caso en que un botón blanco es el primario.

#### Reglas transversales

- **Un solo botón primario por región visual.** Si hay tres acciones, una es
  primaria y las otras dos secundarias.
- El botón deshabilitado **conserva** su color de fondo con `opacity: 0.45`. No
  se vuelve gris: un botón gris se lee como secundario, no como bloqueado.
- Un botón deshabilitado por una razón que el usuario puede resolver **debe**
  llevar `title` explicando qué falta.
- Orden en un footer: **Cancelar a la izquierda, acción a la derecha**, gap 12,
  alineados a la derecha.

---

### 6.5 Cards

La card es la unidad de composición del sistema. Todo contenido dentro del
`<main>` vive en una card, salvo el título de pantalla y la toolbar.

#### Card base

```
Fondo     #FFFFFF      Radio 8      Padding 20
Sombra    0 1px 4px rgba(0,0,0,0.08)
Hover (si es clicable):
  box-shadow → 0 4px 12px rgba(0,0,0,0.13)
  transition: box-shadow 150ms ease-out
```

**La card no se mueve al hacer hover.** Sube la sombra, no el elemento. Un
`translateY` en una grilla de 30 cards hace que la página parezca temblar al
recorrerla con el mouse.

#### Franja de acento

Cuando la card pertenece a una categoría con color:

```
borderLeft: 4px solid <colorCategoria>
```

Siempre a la **izquierda**. Es el borde que el ojo encuentra primero al leer, y
mantenerlo consistente permite escanear una columna de cards por color sin leer.

#### Encabezado de card

```
Fila flex, justify-between, margin-bottom 16
Izquierda: icono 14px del color de la sección + título 14px peso 700 #000000, gap 8
Derecha (opcional): acción de texto 13px #0084C0, sin fondo ni borde
```

#### Card de KPI

```
Fondo #FFFFFF · Radio 8 · Sombra card
borderLeft: 4px solid <color>
Padding: 20px 20px 20px 16px      (16 a la izquierda: la franja ya ocupa 4)

Fila flex, align-items: center, justify-between
  Izquierda:
    Etiqueta  14px peso 500 #808285, display block
    Valor     30px peso 700 #000000, margin-top 4
    Subtexto  11px #808285, margin-top 4      (opcional)
  Derecha:
    Círculo 48 × 48, fondo = color + '1F'
    Icono 20px del mismo color, centrado
```

**El círculo se centra contra el alto total de la card**, no contra la etiqueta.
Esta frase es la que evita las dos implementaciones distintas que siempre
aparecen cuando el estándar dice solo "icono a la derecha".

#### Distribución de contenido — la grilla

Es el patrón por defecto de toda pantalla:

```
1. Título de pantalla + acciones          (§6.9)
2. Fila de KPIs                            grid auto-fit, minmax(220px, 1fr), gap 16
3. Toolbar: búsqueda + filtros             gap 12, margin-bottom 24
4. Contenido principal en card(s)          gap 20 entre cards
```

- Grilla de cards de contenido:
  `grid-template-columns: repeat(auto-fit, minmax(320px, 1fr))`, gap 20.
- Nunca más de **4 KPIs** en una fila. Con cinco, el número deja de leerse de un
  vistazo, que es lo único que un KPI tiene que lograr.
- Card ancha (tabla, gráfica): ocupa el 100 % del ancho disponible; no se le
  pone `max-width`.

#### Card de resumen de entidad (patrón de lista)

Para listas de entidades en formato card en lugar de tabla:

```
Radio 8 · Padding 20 · Sombra card · borderLeft 4px del color de estado
Título       14px peso 800 #000000, letter-spacing -0.01em
Clasificación 13px peso 600 #000000
Metadatos    12px #808285, cada uno con su icono 11px del color de estado, gap 4
Línea de contexto  12px #808285, cursiva            (opcional)
Chips de estado    fila con gap 6, flex-wrap
Barra de progreso  altura 4, radio 2, fondo #E0E0E0
```

Máximo **cinco** líneas de metadatos. Más allá de eso, la información pertenece
a la vista de detalle, no a la card.

---

### 6.6 Insignias (badges / chips)

```
Padding   2px 7px        Radio 4        Fuente 11px peso 500
Texto     <color>        Fondo <color> + '26'
```

Variante compacta (dentro de una card, en línea con otros metadatos):
`padding: 2px 8px`, radio 3, peso 700.

Badge numérico de conteo (pegado a un trigger):
```
minWidth 16 · height 16 · padding 0 4px · radio 999
fondo #DC0202 · texto #FFFFFF 10px peso 700 · line-height 1
```

**Nunca** se usa una insignia como botón. Si el chip es clicable, se le agrega
hover explícito y `cursor: pointer`, y se documenta por qué no es un botón.

---

### 6.7 Tablas

#### Contenedor

```
Card blanca: radio 8, sombra card, overflow hidden
<table style={{ width: '100%', borderCollapse: 'collapse' }}>
```

El `overflow: hidden` de la card es lo que recorta las esquinas de la primera y
última fila. Sin él, la tabla sobresale de sus propias esquinas redondeadas.

#### Encabezado

```
Fondo        #F7F7F7      (columna ordenada activa: #EEEEEE)
Padding      12px 16px
Texto        13px peso 700 #000000, text-align left, white-space nowrap
Cursor       pointer si la columna es ordenable
user-select  none
```

#### Ordenamiento — un solo icono, tres estados

```
sin orden    → flecha ARRIBA en #D1D3D4  (gris)
ascendente   → flecha ARRIBA en #000000
descendente  → flecha ABAJO  en #000000
→ vuelve a sin orden
```

**Nunca** dos triángulos que se muestran y se ocultan. Al hacer clic en otra
columna, la anterior vuelve a "sin orden" y la nueva arranca en ascendente.

Los valores vacíos (`null`, `undefined`, `''`) van **siempre al final**, en
ambas direcciones. Es lo que espera cualquiera que ordena para encontrar el
mayor o el menor: los huecos no son ni lo uno ni lo otro.

#### Filas

```
Zebra        par → #FFFFFF · impar → #F7F7F7
Separador    1px solid #E0E0E0
Hover        fondo #EEEEEE  (transition: background-color 100ms)
Padding      12px 16px
Celda principal    13px peso 700 #000000
Celda secundaria   13px peso 400 #808285
Celda de metadato  12px #808285
```

Si la fila entera navega a un detalle, la columna de acciones detiene la
propagación del clic (`e.stopPropagation()`), o el usuario que quiere ver algo
en línea termina navegando.

#### Columna de acciones

Última columna, `text-align: center`, ancho 60. Iconos de 14 px en `#0084C0`,
botón sin fondo ni borde, padding 4.

#### Paginación

Fuera de la card, `margin-top: 16`, fila `justify-between`.

```
Izquierda:  "Mostrando X–Y de Z" en 12px #808285
            select de tamaño de página: padding 4px 8px, borde 1px #E0E0E0,
            radio 4, 12px
Derecha:    botones de 28 × 28, radio 4
              página actual → fondo #DC0202, texto blanco, peso 700
              otras         → sin fondo, texto #808285
              deshabilitado → texto #D1D3D4, cursor not-allowed
            elipsis: ancho 28, centrado, 12px #808285
```

Regla de compresión: si hay ≤ 7 páginas se muestran todas; si hay más, se
muestra `1 … actual-1, actual, actual+1 … última`.

Al cambiar de página, la tabla hace `scrollIntoView({ behavior: 'smooth' })`. Sin
eso, el usuario en una lista larga cambia de página y sigue mirando el pie.

---

### 6.8 Barra de búsqueda y filtros

Van juntas, en una fila con `gap: 12` y `margin-bottom: 24`, encima del
contenido.

#### Barra de búsqueda

```
Contenedor  flex: 1 1 0, max-width 50%
Input       padding-left 36 · padding-right 16 (34 si hay texto)
            padding vertical 8
            borde 1px solid #E0E0E0 · radio 6 · 13px · fondo #FFFFFF
Icono lupa  14px #808285, absolute left 12, centrado vertical, pointer-events none
Botón ×     aparece SOLO cuando hay texto
            absolute right 10, icono 13px #808285, padding 4
```

El `max-width: 50%` no es estético: una barra de búsqueda que ocupa todo el
ancho sugiere que busca en todo el sistema. Al ocupar la mitad y compartir fila
con los filtros, se lee como "busca dentro de esta lista".

#### Panel de filtros

Trigger:

```
Padding 8px 12px · radio 8 · 13px peso 600 · gap 6 · icono embudo 12px
Inactivo: fondo #FFFFFF, borde 1px #D1D3D4, texto #808285
Activo:   fondo #DC0202 + '26', SIN borde, texto #DC0202
          + badge de conteo (píldora, ver §6.6)
```

Popover:

```
Absolute, top: calc(100% + 8px), anclado al borde que no se recorte
Ancho 320 · fondo #FFFFFF · borde 1px #E0E0E0 · radio 10
Sombra dropdown · padding 16 · z-index 50
Encabezado: "Filtros" 13px peso 700 #000000
            + "Limpiar todo" 12px peso 600 #DC0202, solo si hay filtros activos
Campos: grid auto-fit, minmax(140px, 1fr), gap 12
```

Se cierra con clic afuera y con `Escape`. Ambas cosas, no una.

**Por qué popover y no selects en línea.** Cuatro selects en la barra ocupan
todo el ancho, empujan la búsqueda y no dicen cuántos filtros hay activos. El
trigger con badge responde esa pregunta sin abrir nada.

**Campo de filtro:** etiqueta arriba (13px `#808285`, `margin-bottom: 4`),
control abajo. Es el mismo par etiqueta/control de los formularios, para que
filtros y formularios se lean como un solo sistema.

---

### 6.9 Encabezado de pantalla

```
Fila flex, align-items: flex-end, justify-between, margin-bottom 24
Izquierda:
  h1  32px peso 700 #000000, line-height 1.1, margin 0
  p   16px peso 400 #808285, margin-top 4   ← siempre un dato, no un eslogan
Derecha:
  Botones de acción, gap 8
```

El subtítulo dice **cuántos** o **cuándo** ("128 registros", "Actualizado hace 5
minutos"), no "Administra tus registros aquí". Un subtítulo que no aporta un
dato es ruido con formato de contenido.

#### Banda de detalle (hero)

Para pantallas de detalle de una entidad, en lugar del título simple:

```
Fondo        color de la categoría/estado de la entidad
Padding      20px 32px
Márgenes negativos para sangrar al borde del <main>:
             marginTop: -32, marginLeft: -32, marginRight: -32
Radio        0     (va pegado al header y a los bordes)
Layout       flex, align-items: flex-start, justify-between
Contenido    botón "Volver" (§6.4, variante sobre color) · nombre · metadatos
Acciones     a la derecha, gap 8
```

La banda sangra hasta los bordes porque, si respetara el padding de 32 px, se
leería como una card gigante de color en lugar de como el encabezado de la
pantalla.

#### Breadcrumb

Debajo de la banda, `margin: 16px 0 24px`, 12 px.
Niveles intermedios en `#0084C0` peso 500 sin subrayado; separador `/` con
`margin: 0 6px` en `#808285`; nivel actual en `#000000` peso 600, sin link.

---

### 6.10 Pestañas

**Una sola implementación.** Este es el componente que más se duplica y el que
más rápido delata que no hay estándar.

```
Contenedor   flex, gap 0, border-bottom 1px solid #E0E0E0, margin-bottom 24
Pestaña      padding 10px 18px · 14px · sin fondo ni borde lateral
             border-bottom: 2px solid transparent
             margin-bottom: -1  (para que el subrayado tape el borde del contenedor)
Inactiva     peso 400, color #808285
Hover        color #000000
Activa       peso 700, color #000000, border-bottom 2px solid #DC0202
Bloqueada    color #D1D3D4, cursor not-allowed, icono de candado 10px a la izquierda
Completada   icono de check 11px #6ABF4B a la izquierda, gap 6
```

**Valores fijos:** padding `10px 18px` y fuente 14. No 16 en una pantalla y 20 en
otra; no 13 en la vista de solo lectura y 14 en la editable. Si una vista
necesita más pestañas de las que caben, se acortan las etiquetas — no se
reduce el padding.

Una pestaña bloqueada **siempre** lleva `title` explicando qué desbloquea.

---

### 6.11 Formularios

#### Campo de texto

```
Input     width 100% · padding 8px 12px · borde 1px solid #D1D3D4 · radio 6
          13px · color #000000 · fondo #FFFFFF · box-sizing border-box
          outline: none  (el foco lo da :focus-visible global, §9)
Etiqueta  13px · #808285 · display block · margin-bottom 4
Error     borde 1px solid #DC0202 + mensaje 12px #DC0202 debajo
Obligatorio  asterisco #DC0202 pegado a la etiqueta
Deshabilitado  fondo #F7F7F7 · texto #9CA3AF · cursor not-allowed
```

`textarea`: mismo estilo + `resize: vertical` + `font-family: inherit` (sin eso,
el navegador usa monoespaciada y el textarea no pertenece al formulario).

`select`: mismo estilo + `cursor: pointer`.

#### Select de catálogo

Un `select` cuyas opciones vienen de un catálogo cerrado debe **preservar un
valor almacenado que ya no está en el catálogo**, agregándolo como opción extra.
Si no, abrir un registro viejo borra silenciosamente lo que tenía.

#### Layout

- Una columna por defecto, campos con `margin-bottom: 16`.
- Dos columnas solo para pares naturales (fecha inicio / fecha fin):
  `grid-template-columns: 1fr 1fr`, gap 12.
- Nunca tres columnas: a 1280 px los campos quedan demasiado angostos para su
  etiqueta.
- El error se muestra **al intentar enviar**, no mientras se escribe. Marcar en
  rojo un campo que el usuario todavía está llenando es hostil.

---

### 6.12 Modales

#### Estructura

```
Velo    position fixed, inset 0
        backgroundColor rgba(0,0,0,0.3) + backdropFilter blur(4px)
        display flex, align-items center, justify-content center
        z-index 10001
Panel   fondo #FFFFFF · radio 12 · sombra 0 8px 24px rgba(0,0,0,0.20)
        overflow hidden     ← recorta la banda de color
        max-height 85vh · display flex · flex-direction column
Banda   ver ModalHeader abajo (flex-shrink 0)
Cuerpo  padding 28px 32px · overflow-y auto
```

El `overflow: hidden` del panel es lo que evita que la banda de color, que tiene
esquinas inferiores rectas, asome por fuera de las esquinas redondeadas del
panel.

Que la banda no scrollee y el cuerpo sí es el motivo por el que el padding del
cuerpo **no** vive en el panel: si viviera ahí, la banda no podría ocupar el
ancho completo.

#### Banda de título (`ModalHeader`)

```
Fondo         color contextual (de la categoría, la etapa o el módulo)
Padding       20px 32px
Radio         12px arriba en modal centrado · 0 en panel lateral
Título        20px peso 700 #FFFFFF, letter-spacing -0.01em, padding-right 28
Subtítulo     13px rgba(255,255,255,0.75), margin-top 4    (opcional)
Cerrar (×)    absolute top 18 right 22, icono 16px blanco, padding 4
```

#### Anchos

| Tipo | Ancho |
|---|---|
| Confirmación | **420** |
| Formulario | **560** |
| Formulario ancho (2 columnas o tabla dentro) | **720** |

No hay más anchos. Un modal más ancho que 720 debería ser una pantalla.

#### Footer

```
border-top 1px solid #D1D3D4 · padding-top 16 · margin-top 24
flex, justify-content flex-end, gap 12
Cancelar → botón secundario (radio 6)
Acción   → botón primario (radio 6)
```

#### Diálogo de confirmación

```
Ancho 420 · banda del color de la acción
Cuerpo: icono de advertencia 18px del color de la acción + mensaje 13px #808285
        line-height 1.6, gap 12, margin-bottom 20
Botones al pie, gap 8
```

El mensaje dice **qué va a pasar exactamente y si es reversible**: "Esto elimina
las 3 notificaciones seleccionadas. No se puede deshacer." No "¿Estás seguro?".

**Obligatorio antes de:** eliminar, editar algo significativo, mover una entidad
de estado, o cualquier acción cuyo deshacer no exista.

#### Comportamiento

- Cerrar con: clic en el velo, botón ×, tecla `Escape`.
- El clic dentro del panel no debe propagarse al velo (`stopPropagation`).
- Un modal abierto sobre otro (una confirmación sobre un formulario) es válido:
  el de arriba mantiene su z-index y el de abajo **no** se cierra por clic
  afuera mientras el de arriba esté abierto.
- La acción principal se bloquea mientras la petición está en vuelo, o un doble
  clic manda dos peticiones.

---

### 6.13 Paneles laterales

Para contenido auxiliar que acompaña a la pantalla sin taparla: notificaciones,
notas, historial, ayuda contextual.

```
Velo     position fixed, top HEADER_HEIGHT, left/right/bottom 0
         rgba(0,0,0,0.15) + backdropFilter blur(4px) · z-index 98
Panel    position fixed, top HEADER_HEIGHT, right 0 · z-index 99
         fondo #FFFFFF · sombra -4px 0 24px rgba(0,0,0,0.20)
         overflow hidden · display flex · flex-direction column
```

**Dos variantes de altura, y solo dos:**

| Variante | Altura | Ancho | Cuándo |
|---|---|---|---|
| Colgante | `75vh` | `25vw`, min 300, max 420 | Contenido consultivo y transitorio (notificaciones). |
| Completo | `calc(100vh - HEADER_HEIGHT)` | `380` fijo | Contenido en el que se trabaja (notas, historial editable). |

Estructura interna: banda de título (esquinas rectas) → zona fija opcional →
lista con `flex: 1; overflow-y: auto; min-height: 0` → barra inferior fija.

**El `min-height: 0` es el que siempre falta.** Sin él, un hijo flex no se
encoge por debajo de su contenido: el panel crece en vez de mostrar scroll.

Barra inferior: `padding 8px 12px`, `border-top 1px solid #E0E0E0`, `gap 8`,
botones de texto (§6.4 terciario).

---

### 6.14 Notificaciones

Panel colgante (§6.13, variante colgante).

**Pestañas internas:** "Sin leer (n)" y "Todas". Ocupan mitad y mitad
(`flex: 1`), 13 px peso 600, activa en `#DC0202` con `border-bottom: 2px solid
#DC0202`, inactiva `#808285`. Hover de la inactiva: fondo `#F5F5F5`.

**Fila de notificación**

```
Alto mínimo   56 · border-bottom 1px solid #E0E0E0 · cursor pointer
Barra lateral izquierda: 3px de ancho, alto completo, color del tipo de evento
Contenido: padding 14px 16px, gap 12
  [casilla, solo en modo selección]
  Círculo 28 × 28, fondo = color + '1F', icono 13px del color
  Texto     13px peso 600 #000000, line-height 1.4
  Hora      12px #808285
Hover       fondo #F5F5F5
Seleccionada fondo #DC0202 + '1F'
```

**La selección gana sobre el hover.** Los dos estados alimentan **un solo estilo
calculado**; nunca se escriben directamente sobre `element.style.backgroundColor`
desde dos manejadores distintos, porque entonces pasar el mouse sobre una fila
seleccionada la "desmarca" visualmente.

**El color y el icono los define QUÉ pasó, no la severidad.** Si todas las
notificaciones informativas comparten color, el panel no dice nada: su trabajo
es que el usuario reconozca de un vistazo qué parte del sistema se movió. Cuando
un evento pertenece a una categoría que ya tiene color en el sistema, la
notificación **hereda ese color**, no inventa uno.

**Ya leída:** el color pasa a `#9CA3AF` y el icono se conserva. El icono sigue
identificando el evento; solo baja de prioridad.

**Comportamiento**

- Se recarga al abrir el panel. Sin polling permanente.
- Marcar como leído es **optimista con rollback**: se aplica local, se manda al
  servidor, y si el servidor rechaza se restaura el estado anterior y se avisa
  con un toast. Un `.catch(() => {})` deja la campana en 0 mientras las
  notificaciones siguen pendientes — el usuario cree que ya las procesó.
- Borrar pasa por `ConfirmDialog` (una, varias o todas) y corre en el servidor
  **antes** de tocar la lista local.

---

### 6.15 Toasts

```
Posición    fixed, top HEADER_HEIGHT + 16, right 24, z-index 10002
            columna, gap 10, max-width 380, pointer-events none en el contenedor
            (los toasts individuales sí reciben eventos)
Toast       fondo #FFFFFF · radio 8 · sombra 0 8px 24px rgba(0,0,0,0.20)
            borderLeft 4px solid <colorDelTipo> · padding 12px 14px
            flex, align-items flex-start, gap 10
Icono       15px del color, margin-top 1
Título      13px peso 700 #000000, line-height 1.4
Mensaje     12px #808285, line-height 1.5, margin-top 3
Cerrar      icono × 12px #808285, padding 2
```

**Tipos y duración**

| Tipo | Color | Icono | Duración |
|---|---|---|---|
| Éxito | color de éxito del proyecto | check en círculo | 4 000 ms |
| Info | color informativo del proyecto | i en círculo | 4 000 ms |
| Advertencia | color de advertencia del proyecto | triángulo | 6 000 ms |
| Error | `#DC0202` (rojo de acción del núcleo) | × en círculo | 6 000 ms |

El hex de éxito, info y advertencia no los fija este documento — son colores
libres (§3.2). Lo único fijo es que **error reutiliza el rojo de acción**, y
que, una vez que el proyecto define sus tres tonos libres, todo el sistema los
reutiliza para el mismo rol en vez de variar el tono según la pantalla.

Lo que el usuario puede corregir dura más que lo que solo confirma.

**Los cuatro casos de uso — no son intercambiables**

| Situación | Tipo | Qué dice el mensaje |
|---|---|---|
| La acción se completó | Éxito | Exactamente qué pasó. |
| El usuario escribió algo inválido o rompió una regla | **Advertencia** | Qué campo o regla, y cómo corregirlo. |
| El rol del usuario no permite la acción | **Advertencia** | Que no se cambió nada y a quién pedir acceso. Nunca el mensaje técnico del backend. |
| Falla técnica (red, 500, timeout) | **Error** | Que no es su culpa, que no se cambió nada, y que reintente. |

Un error de validación **no** es rojo: es accionable, y el rojo se reserva para
lo que el usuario no puede arreglar. Si todo es rojo, el rojo deja de significar
algo.

**El más nuevo va arriba**, más cerca del header.

---

### 6.16 Estados de pantalla

Los tres son obligatorios.

#### Cargando

```
Anillo   SVG 72 × 72
         círculo de fondo: r 32, stroke #F3D6D6, ancho 5
         arco activo:      r 32, stroke #DC0202, ancho 5, stroke-linecap round,
                           stroke-dasharray "60 141"
         Rota 360° en 1.1s linear infinite
Icono    22px #DC0202, centrado dentro del anillo
Mensaje  15px peso 700 #000000, debajo, gap 12
Submensaje 13px #808285, margin-top 4     (opcional)
```

**El icono del centro es el del módulo que se está cargando**, tomado del mismo
mapa que usa el sidebar (§6.3). Un spinner genérico desperdicia la única
información que se puede dar durante la espera.

**Retraso obligatorio: 400 ms.** El loader no se monta hasta que pasan. La
mayoría de las peticiones resuelven antes, y sin el retraso cada cambio de
pantalla produce un parpadeo. **No es un bug: no se "arregla" quitándolo.**

Cascada correcta cuando hay carga de código diferido *y* carga de datos:

| Nivel | Retraso |
|---|---|
| Fallback de ruta diferida | 350 ms |
| Carga inicial de datos de la pantalla | 100 ms (por encima del anterior, ya cubierto) |
| Carga de una sección dentro de una pantalla ya visible | 400 ms |

Sin esta cascada el usuario ve dos spinners seguidos, con dos iconos distintos,
para una sola navegación.

Modos: `inline` (padding `64px 0`), `fill` (centrado en el alto real del área de
contenido) y `fullScreen` (`position: fixed, inset 0`, fondo blanco, z-index 200).

#### Vacío

```
Card blanca, radio 8, sombra card, padding 48px 24px, centrado
Círculo 48 × 48, fondo #EEEEEE, icono 18px #808285, margin-bottom 16
Título      15px peso 700 #000000
Descripción 13px #808285, max-width 360
Acción      opcional, botón primario radio 6, margin-top 20
```

**Dos situaciones vacías, y no son la misma:**

| Situación | Copy | Acción |
|---|---|---|
| El sistema no tiene datos todavía | "Aún no hay registros" | Botón de crear, si el rol puede |
| Un filtro o búsqueda no encontró nada | "Sin resultados" + "Prueba con otros filtros" | **"Limpiar filtros"** |

Ofrecer "Limpiar filtros" cuando no hay filtros activos confunde: sugiere que el
usuario hizo algo mal cuando simplemente no hay datos.

#### Error

Toast de error (§6.15) **más** un `EmptyState` que explique el motivo. El toast
desaparece; la pantalla no puede quedarse en blanco después.

---

### 6.17 Login

Es la única pantalla sin header ni sidebar, y la única con escala tipográfica
propia. Estructura de dos paneles.

```
Contenedor  flex, height 100vh, overflow hidden, position relative
```

#### Panel izquierdo — identidad

```
flex: 0 0 55%       (min-width 480)
Imagen de fondo: cover, center
Velo de color encima: position absolute, inset 0,
                      backgroundColor #AA0202, opacity 0.80, z-index 0
Padding 40px 48px, flex column, justify-content flex-start

Logo         altura 60, anclado arriba, z-index 1
Bloque central (margin: auto 0, z-index 1):
  Categoría     13px peso 600 rgba(255,255,255,0.85), 0.08em, MAYÚSCULAS
                margin-bottom 12
  Título        55px peso 800 #FFFFFF, line-height 1.15, -0.02em, margin-bottom 16
  Descripción   16px rgba(255,255,255,0.80), line-height 1.6, max-width 360
  Regla         64 × 3, #FFFFFF, opacity 0.6
```

El velo va **encima** de la foto con opacidad 0.80, no se aplica un filtro a la
imagen. Así la foto es intercambiable sin retocarla: cualquier imagen queda
dentro de la marca.

#### Panel derecho — acceso

```
flex: 1, fondo #EEEEEE, contenido centrado vertical y horizontalmente
Card:  ancho 550 · fondo #FFFFFF · radio 12 · sombra 0 8px 24px rgba(0,0,0,0.20)
       padding 64px 32px

Icono de la app   altura hasta 220, centrado, margin-bottom 24
Título            30px peso 700 #000000, centrado
Subtítulo         15px #484848, centrado, margin-bottom 36
Campos            etiqueta 16px peso 500 #484848, margin-bottom 4
                  input: padding vertical 12, padding-left 42, radio 6, 15px
                  icono izquierdo 15px #808285 en left 12
                  campo de contraseña: botón ojo/ojo-tachado en right 12
Error             12px #DC0202, centrado, aria-live="polite", margin-bottom 12
Botón             ancho 100%, padding 13px 0, 16px peso 700
                  fondo #DC0202, radio 8
                  hover: sombra 0 6px 16px rgba(0,0,0,0.18)
                  cargando: opacity 0.7, spinner + "Entrando…", no clicable
```

#### Separación entre paneles

Un elemento decorativo vertical de 90 px de ancho, del color del fondo de
página, con `clip-path` de hexágono alargado, centrado sobre la costura:

```
position absolute, top 0, bottom 0, width 90, z-index 2, pointer-events none
left: 55%; transform: translateX(-50%)
clip-path: polygon(50% 0%, 100% 8%, 100% 92%, 50% 100%, 0% 92%, 0% 8%)
```

**El porcentaje del divisor y el `flex-basis` del panel izquierdo tienen que ser
el mismo número.** Si el panel es `52.78%` y el divisor está en `calc(55% -
20px)`, el divisor no está sobre la costura: está cerca. Es el tipo de
desalineación que nadie reporta y todos perciben.

#### Mensajes de error

Se distinguen tres causas, porque llevan al usuario a lugares distintos:

| Causa | Mensaje |
|---|---|
| No se alcanzó el servidor | "No se puede contactar al servidor. Revisa tu conexión o contacta a IT." |
| El servidor respondió con 5xx | "El servicio de acceso no responde en este momento. Intenta de nuevo en un momento." |
| Credenciales rechazadas | "Correo o contraseña incorrectos." |

**Nunca** se muestra el mensaje literal del servicio de autenticación: puede
filtrar detalles de infraestructura.

---

### 6.18 Contenedores con scroll

Patrón obligatorio, tres cosas juntas:

```
altura limitada  +  overflow-y: auto  +  min-height: 0   (en contexto flex)
```

Scrollbar personalizada (en `global.css`):

```css
::-webkit-scrollbar        { width: 6px; height: 6px; }
::-webkit-scrollbar-track  { background: #F1F1F1; }
::-webkit-scrollbar-thumb  { background: #C1C1C1; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #A1A1A1; }
```

---

## 7. Movimiento

### 7.1 Duraciones — tres niveles, no más

| Nivel | ms | Uso |
|---|---|---|
| Rápida | **120** | Hover de fondo, cambio de color, icono. |
| Media | **200** | Entrada/salida de modal, toast, velo, fade de página. |
| Lenta | **300** | Colapsar/expandir sidebar y el desplazamiento del `<main>`. |

Sombras de hover: **150 ms**, entre rápida y media. Es la única excepción y
existe porque una sombra a 120 ms se percibe como un salto.

### 7.2 Curvas

`ease-out` para entrar. `ease-in` para salir. `linear` **solo** para el giro
infinito del `LoadingState`. Sin excepciones y sin curvas personalizadas.

### 7.3 Animaciones del sistema — conjunto cerrado

| Clase | Qué hace |
|---|---|
| `.modal-overlay` | Velo: fade in. `.is-closing` → fade out. |
| `.modal-panel` | Panel: `opacity 0 → 1`, `translateY(8px) scale(0.98) → none`. |
| `.toast-item` | Entra deslizando desde la derecha (`translateX(24px)`). Sale con fade en su lugar. |
| `.page-fade` | Fade del contenedor de rutas al navegar. |

Un modal que se está cerrando **sigue montado** los 200 ms que dura su
animación de salida. Si se desmonta al instante, la animación nunca se ve.

### 7.4 La regla obligatoria

```css
@media (prefers-reduced-motion: reduce) {
  .modal-overlay, .modal-overlay.is-closing,
  .modal-panel,   .modal-panel.is-closing,
  .toast-item,    .toast-item.is-closing,
  .page-fade { animation: none !important; }
}
```

Cada `@keyframes` nuevo entra a este bloque **en el mismo commit**. Es el error
más fácil de cometer y el más difícil de detectar: solo se manifiesta en la
máquina de alguien que activó esa preferencia del sistema.

---

## 8. Permisos y estados de solo lectura

Si el sistema tiene roles, la interfaz lo refleja de forma consistente:

- Una acción que el rol no puede ejecutar **no se muestra**. No se muestra
  deshabilitada: un botón gris invita a preguntar por qué está gris.
- Una pantalla que el rol no puede abrir redirige, no muestra un error.
- La vista de solo lectura de una entidad usa **los mismos componentes** que la
  editable, con los controles reemplazados por texto. No se diseña una pantalla
  aparte: se desincronizan en la segunda iteración.
- El frontend ocultar ≠ el backend permitir. La verificación real vive en el
  servidor; lo del frontend es cortesía visual.

---

## 9. Accesibilidad — mínimos no negociables

**Foco visible.** Global, no por componente:

```css
*:focus { outline: none; }
*:focus-visible {
  outline: 2px solid #DC0202;
  outline-offset: 2px;
  border-radius: inherit;
}
```

`:focus-visible` y no `:focus` para que el anillo aparezca al navegar con
teclado y no al hacer clic con el mouse.

**Otros mínimos:**

- Todo botón que solo tiene icono lleva `aria-label`.
- Contenedor de toasts: `aria-live="polite"`. Toast de error o advertencia:
  `role="alert"`. Los demás: `role="status"`.
- `LoadingState`: `role="status"` + `aria-live="polite"`.
- Modal: `role="dialog"` + `aria-modal="true"`.
- Trigger de popover: `aria-expanded`.
- **El color nunca es el único portador de información.** Un punto de estado
  lleva `title`; una fila de error lleva icono además de color.
- Contraste: 4.5:1 en texto normal, 3:1 en texto ≥ 18 px o peso 700.
- `Escape` cierra todo lo que se abre en capa: modal, popover, panel.

---

## 10. Lista de verificación

Con esta lista se aprueba o se rechaza una pantalla. Cualquier "no" es un
defecto, no una preferencia.

**Color y tipografía**
- [ ] ¿Los seis colores del núcleo (§3.1) están exactos y sin sustituir?
- [ ] ¿Ningún color secundario o terciario repite —con un tono parecido pero
      distinto— un rol que ya tiene un color asignado en el sistema?
- [ ] ¿Los tonos claros se derivaron con sufijo alfa (`14`/`1F`/`26`) y no a ojo?
- [ ] ¿Una sola familia tipográfica?
- [ ] ¿Todo tamaño de fuente sale de la escala de §4.2?
- [ ] ¿Nada por debajo de 11 px que el usuario tenga que leer?

**Geometría**
- [ ] ¿Ningún número de header, sidebar, `<main>` o z-index escrito a mano?
- [ ] ¿Todos los paddings y gaps son múltiplos de 4?
- [ ] ¿Los gaps siguen la tabla de §5.4?
- [ ] ¿Ningún borde de `0.5px`?
- [ ] ¿Las franjas de acento de card están todas a la izquierda?

**Interacción**
- [ ] ¿Todo elemento clicable tiene hover?
- [ ] ¿La selección gana sobre el hover donde conviven?
- [ ] ¿Un solo botón primario por región?
- [ ] ¿Todo botón deshabilitado con causa resoluble tiene `title`?
- [ ] ¿Toda acción destructiva pasa por confirmación?
- [ ] ¿El botón de una acción en vuelo se bloquea contra doble clic?

**Estados**
- [ ] ¿Existen los tres estados: cargando, vacío, error?
- [ ] ¿El `EmptyState` distingue "no hay datos" de "el filtro no encontró nada"?
- [ ] ¿El loader respeta el retraso de 400 ms y muestra el icono del módulo?
- [ ] ¿Los errores de validación son advertencia (ámbar) y no error (rojo)?

**Movimiento y accesibilidad**
- [ ] ¿Toda animación nueva está en el bloque `prefers-reduced-motion`?
- [ ] ¿Las duraciones salen de los tres niveles?
- [ ] ¿Foco visible funcionando con teclado?
- [ ] ¿`aria-label` en todo botón de solo icono?
- [ ] ¿Ninguna información depende únicamente del color?

---

## 11. Plantilla de prompt para generar una app con IA

Copiar tal cual, rellenar los corchetes:

```text
Vas a construir una aplicación web interna. El diseño NO se decide en esta
conversación: ya está definido.

MATERIAL (adjunto):
- ESTANDAR_UI.md — la regla y el porqué de cada valor.
- Componentes_UI_Nexteer_v6.zip — esa misma regla ya escrita como código, lista para copiar.

ORDEN OBLIGATORIO:
1. Lee ESTANDAR_UI.md completo antes de escribir código.
2. Copia tokens/ completo y estilos/global.css a src/index.css.
3. Copia hooks/ completo.
4. Copia de componentes/ solo lo que uses, sin modificar sus medidas.
5. Recién entonces construye las pantallas.

REGLAS QUE NO PUEDES ROMPER:
- Los seis colores del núcleo (sección 3.1) van exactos: no se sustituyen, no
  se aclaran, no se oscurecen.
- Fuera del núcleo eres libre de elegir los colores secundarios y terciarios
  que el sistema necesite — PERO si un color ya cumple un rol en el sistema
  (texto secundario, fondo de aviso, una categoría), reutilízalo para
  cualquier otro elemento que cumpla el mismo rol. No inventes un tono
  parecido. Solo introduces un tono distinto cuando el caso concreto necesita,
  de forma deliberada, un contraste que el color existente no da.
- Ningún tamaño de fuente fuera de la escala de la sección 4.2.
- Tailwind SOLO para layout y flex. Color, tamaño y padding van en style={{}}.
- Ningún número de geometría escrito a mano: todo desde tokens/layout.ts.
- Font Awesome como única librería de iconos.
- Toda pantalla que pida datos implementa cargando + vacío + error.
- Toda acción destructiva pasa por ConfirmDialog.
- Toda animación nueva entra al bloque prefers-reduced-motion.

LO ÚNICO QUE DEFINO YO:
- Sistema: [nombre]
- Qué hace: [una frase]
- Entidades: [entidad A, entidad B, …]
- Módulos del sidebar: [Inicio, …]
- Roles: [rol A: qué puede hacer; rol B: …]
- Colores secundarios o terciarios propios del sistema, si los quiero fijos
  desde el inicio: [lista de "rol: hex" — opcional, si no se da, la IA elige
  y los declara siguiendo la regla de reutilización]
- Pantallas: [lista]

AL TERMINAR, entrégame la lista de verificación de la sección 10 respondida
punto por punto, señalando cualquier lugar donde te hayas desviado y por qué.
```

---

## 12. Alcance: qué gobierna este estándar y qué no

**Gobierna:** color, tipografía, espaciado, header, logo, sidebar, iconos,
botones, cards, tablas, búsqueda, filtros, formularios, modales, paneles,
notificaciones, toasts, pestañas, estados de pantalla, login, movimiento y
accesibilidad.

**No gobierna:** la lógica de negocio, los nombres de las entidades, los flujos
de trabajo, las reglas de validación de dominio, los componentes que solo tienen
sentido en un sistema (un stepper de un proceso específico, una matriz de
evaluación, un badge de un nivel propio).

**La prueba para decidir de qué lado cae algo:**

> Si el siguiente sistema interno también lo va a necesitar, es del estándar.
> Si solo tiene sentido en este dominio, se construye encima del estándar.

Lo específico de cada sistema se construye **usando** estas piezas, con estos
tokens, sin redefinir ninguna medida.

---

## 13. Cómo se modifica este estándar

Distingue dos tipos de cambio, porque no pasan por el mismo camino:

**Un color secundario o terciario nuevo** (una categoría, un acento propio del
sistema) no modifica este documento — lo permite la sección 3.2 directamente.
Se declara una vez en el token de color del proyecto, con su rol, y se
reutiliza desde ahí. Eso no es una excepción al estándar: es exactamente lo
que el estándar previó.

**Un cambio al núcleo, a una medida, a un comportamiento o a un componente de
la sección 6** sí modifica este documento, y sigue este camino:

1. La propuesta se escribe como **cambio a este documento**, no como excepción
   en una pantalla.
2. Se declara qué problema real resuelve. "Se ve mejor" no es un problema.
3. Se actualiza el token, luego el kit, luego las pantallas. **En ese orden.**
4. Se registra en el changelog del kit: qué cambió, por qué, y qué hay que
   corregir en los sistemas que ya existen.

Una excepción no documentada a una MEDIDA (no a un color libre) es el inicio de
la divergencia. Cuando dos sistemas discrepan en algo que el estándar sí fija,
el trabajo no es elegir uno: es descubrir qué parte del estándar permitía las
dos lecturas y cerrarla.
