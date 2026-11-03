import type {ClassifyItem} from '@site/src/components/Classify';
import type {TerminalStep} from '@site/src/components/Terminal';
import type {OrderItem, OrderRule} from '@site/src/components/Order';

export const DIFF_COLUMNS = ['Reportar un defecto', 'Actualizar la referencia', 'Enmascarar o fijar el dato'];
export const DIFF_ITEMS: ClassifyItem[] = [
  {
    code: 'El diff marca el precio de la ficha, que ahora se superpone con el botón «Agregar al carrito». Nadie pidió ese cambio.',
    column: 0,
    why: 'Un cambio visual que nadie decidió, y que además rompe el diseño: es un defecto.',
    hint: '¿Ese cambio estaba previsto?',
  },
  {
    code: 'El diff marca el encabezado completo: el equipo cambió el logo de la tienda por el nuevo, aprobado la semana pasada.',
    column: 1,
    why: 'El cambio fue decidido: la referencia quedó vieja y se actualiza con `--update-snapshots`, después de mirar el diff.',
    hint: '¿El cambio era esperado?',
  },
  {
    code: 'El diff marca solo el texto «Oferta válida hasta las 18:42», que muestra la hora actual más una hora.',
    column: 2,
    why: 'El texto cambia en cada corrida sin ser un defecto: se enmascara, o se fija el reloj con `page.clock`.',
    hint: '¿Ese texto es igual en dos corridas seguidas?',
  },
  {
    code: 'El diff marca el carrusel de productos recomendados, que elige productos al azar en cada visita.',
    column: 2,
    why: 'El contenido es aleatorio por diseño: se enmascara o se fijan los datos con una respuesta simulada.',
    hint: '¿Qué productos va a mostrar en la próxima corrida?',
  },
  {
    code: 'El diff marca el ícono del carrito, que ahora aparece cortado a la mitad en el encabezado.',
    column: 0,
    why: 'Un ícono cortado no es un cambio de diseño: es un defecto visual para reportar.',
    hint: '¿Alguien decidiría mostrar un ícono cortado?',
  },
  {
    code: 'El diff marca los botones: el equipo de diseño pasó todos los bordes de redondeados a rectos, según el nuevo manual de estilo.',
    column: 1,
    why: 'Cambio decidido y documentado: se actualiza la referencia de los tests afectados.',
    hint: '¿El cambio viene de una decisión del equipo?',
  },
];

export const BASELINE_STEPS: TerminalStep[] = [
  {
    instruction: 'Escribiste el test visual del título de la ficha de la mochila. Correlo por primera vez, filtrando por el archivo ficha.',
    accepted: ['npx playwright test ficha', 'npx playwright test ficha.spec.ts', 'npx playwright test tests/ficha.spec.ts'],
    hint: 'Es el comando de siempre con el filtro por archivo.',
    output: "Running 1 test using 1 worker\n  ✘  1 [chromium] › tests/ficha.spec.ts:2:5 › la ficha de la mochila se ve como la aprobada (282ms)\n    Error: A snapshot doesn't exist at .../tests/ficha.spec.ts-snapshots/ficha-titulo-chromium-darwin.png, writing actual.\n  1 failed",
  },
  {
    instruction: 'Miraste la imagen generada y es correcta. Más tarde, el equipo aprueba un título más grande y el test falla con el diff esperado. Actualizá la referencia solo del archivo ficha.',
    accepted: ["npx playwright test ficha --update-snapshots", "npx playwright test --update-snapshots ficha", "npx playwright test ficha -u", "npx playwright test -u ficha", "npx playwright test ficha.spec.ts --update-snapshots", "npx playwright test --update-snapshots ficha.spec.ts", "npx playwright test ficha.spec.ts -u", "npx playwright test -u ficha.spec.ts", "npx playwright test tests/ficha.spec.ts --update-snapshots", "npx playwright test --update-snapshots tests/ficha.spec.ts", "npx playwright test tests/ficha.spec.ts -u", "npx playwright test -u tests/ficha.spec.ts"],
    hint: 'Es la opción que reemplaza las imágenes de referencia por las capturas actuales; combinala con el filtro por archivo.',
    output: 'Running 1 test using 1 worker\n  ✓  1 [chromium] › tests/ficha.spec.ts:2:5 › la ficha de la mochila se ve como la aprobada (116ms)\n  1 passed (483ms)',
  },
];
export const BASELINE_EXPLANATION =
  'La primera corrida falla y escribe la referencia; después de mirarla, se confirma. Cuando un cambio está aprobado, `--update-snapshots` con el filtro por archivo reemplaza solo las referencias afectadas.';

export const VISUAL_ITEMS: OrderItem[] = [
  {id: 'commit', what: 'Paso', code: 'Confirmar la imagen de referencia en el repositorio.'},
  {id: 'diff', what: 'Paso', code: 'Revisar Expected, Received y Diff en el reporte.'},
  {id: 'write', what: 'Paso', code: 'Escribir el test con toHaveScreenshot y la máscara del contenido dinámico.'},
  {id: 'update', what: 'Paso', code: 'Correr --update-snapshots para ese test, porque el cambio fue aprobado.'},
  {id: 'first', what: 'Paso', code: 'Correrlo por primera vez: falla y escribe la referencia.'},
  {id: 'look', what: 'Paso', code: 'Mirar la imagen generada y confirmar que se ve como se espera.'},
  {id: 'fail', what: 'Paso', code: 'Semanas después, el test falla con píxeles distintos.'},
];
export const VISUAL_CORRECT = ['write', 'first', 'look', 'commit', 'fail', 'diff', 'update'];
export const VISUAL_RULES: OrderRule[] = [
  {before: 'write', after: 'first', why: 'Sin test no hay corrida.'},
  {before: 'first', after: 'look', why: 'La referencia se genera en la primera corrida: recién ahí se puede mirar.'},
  {before: 'look', after: 'commit', why: 'Se confirma solo una referencia revisada: desde ese momento define cómo se tiene que ver.'},
  {before: 'commit', after: 'fail', why: 'El fallo aparece en una corrida posterior, contra la referencia confirmada.'},
  {before: 'fail', after: 'diff', why: 'Ante el fallo, primero se mira qué cambió.'},
  {before: 'diff', after: 'update', why: 'Se actualiza solo después de revisar el diff y confirmar que el cambio fue aprobado.'},
];
