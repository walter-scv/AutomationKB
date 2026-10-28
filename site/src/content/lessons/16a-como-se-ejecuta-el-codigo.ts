import type {ClassifyItem} from '@site/src/components/Classify';
import type {TerminalStep} from '@site/src/components/Terminal';
import type {MultiSelectQuestion} from '@site/src/components/MultiSelect';
import type {OrderItem, OrderRule} from '@site/src/components/Order';

export const RUN_STEPS: TerminalStep[] = [
  {
    instruction: 'Acabás de instalar Node.js. Comprobá qué versión quedó instalada.',
    accepted: ['node -v', 'node --version'],
    hint: 'Es el comando de Node con la opción que muestra la versión.',
    output: 'v22.11.0',
  },
  {
    instruction: 'Clonaste el proyecto del equipo, que ya tiene package.json. Instalá las herramientas que declara.',
    accepted: ['npm install', 'npm i'],
    hint: 'Es el comando de npm que descarga en node_modules lo que figura en package.json.',
    output: 'added 4 packages, and audited 5 packages in 2s\n\nfound 0 vulnerabilities',
  },
  {
    instruction: 'Escribiste cuotas.ts. Antes de ejecutarlo, revisá sus tipos sin generar ningún archivo.',
    accepted: ['npx tsc --noEmit cuotas.ts'],
    hint: 'Es el compilador de TypeScript, ejecutado con npx, con la opción que no genera archivos y el nombre del archivo.',
    output: "cuotas.ts:2:7 - error TS2322: Type 'string' is not assignable to type 'number'.\n\n2 const cantidadDeCuotas: number = '6';\n        ~~~~~~~~~~~~~~~~\n\nFound 1 error in cuotas.ts:2",
  },
  {
    instruction: "Corregiste la línea 2 (ahora es 6, sin comillas). Volvé a revisar los tipos.",
    accepted: ['npx tsc --noEmit cuotas.ts'],
    hint: 'Es el mismo comando del paso anterior: hay que confirmar que el error desapareció.',
    output: '',
  },
  {
    instruction: 'La revisión no imprimió nada: no hay errores. Ejecutá cuotas.ts directamente, sin compilarlo a JavaScript.',
    accepted: ['npx tsx cuotas.ts'],
    hint: 'Es la herramienta que ejecuta un archivo .ts directamente, con npx.',
    output: 'Total en 6 cuotas: 6 x 2500',
  },
];
export const RUN_EXPLANATION =
  '`tsc --noEmit` revisa los tipos sin generar archivos, y no imprimir nada significa que no hay errores. Recién entonces tiene sentido ejecutar con `tsx`, que no revisa tipos: si se lo hubiera corrido primero, el archivo con el error se habría ejecutado igual.';

export const CHECK_QUESTIONS: MultiSelectQuestion[] = [
  {
    prompt: 'En inventario.ts hay una línea que asigna un texto a una variable declarada como `number`. ¿Cuáles de estas formas te muestran ese error antes de que el programa se ejecute? Marcá todas las que correspondan.',
    options: [
      {text: 'Abrir el archivo en Visual Studio Code.', correct: true, why: 'El editor hace la misma revisión de tipos que tsc mientras se escribe, y subraya la línea.'},
      {text: '`npx tsc --noEmit inventario.ts`', correct: true, why: 'Revisa los tipos sin generar archivos e informa el error con archivo, línea y código.'},
      {text: '`npx tsx inventario.ts`', correct: false, why: 'tsx quita los tipos y ejecuta sin revisarlos: el archivo corre igual, con el error adentro.'},
      {text: '`npx tsc inventario.ts`', correct: true, why: 'Informa el error igual que con `--noEmit`; la diferencia es que además genera el `.js`, aunque haya errores.'},
      {text: 'Pegar el contenido del archivo en la consola de `node`.', correct: false, why: 'La consola de Node ejecuta JavaScript: no revisa tipos, y ni siquiera acepta las anotaciones de tipo.'},
      {text: '`node inventario.js`, después de compilar.', correct: false, why: 'El `.js` ya no tiene tipos: ejecutarlo no revisa nada. El error lo había informado `tsc` al compilar.'},
    ],
  },
];

export const COMPILE_ITEMS: OrderItem[] = [
  {id: 'run', what: 'Paso', code: 'node stock.js'},
  {id: 'read', what: 'Paso', code: 'Leer en la salida el archivo, la línea y el mensaje del error.'},
  {id: 'write', what: 'Paso', code: 'Escribir stock.ts en el editor y guardarlo.'},
  {id: 'recheck', what: 'Paso', code: 'npx tsc stock.ts   (ya no informa errores)'},
  {id: 'compile', what: 'Paso', code: 'npx tsc stock.ts   (informa 1 error)'},
  {id: 'fix', what: 'Paso', code: 'Corregir la línea indicada en stock.ts.'},
];
export const COMPILE_CORRECT = ['write', 'compile', 'read', 'fix', 'recheck', 'run'];
export const COMPILE_RULES: OrderRule[] = [
  {before: 'write', after: 'compile', why: 'el compilador trabaja sobre un archivo que ya existe y está guardado.'},
  {before: 'compile', after: 'read', why: 'lo que hay que leer es la salida del compilador.'},
  {before: 'read', after: 'fix', why: 'la salida dice qué línea corregir y por qué.'},
  {before: 'fix', after: 'recheck', why: 'después de corregir hay que confirmar que el error desapareció.'},
  {before: 'recheck', after: 'run', why: 'se ejecuta el .js recién cuando la compilación no informa errores; aunque tsc lo genere igual, ejecutarlo antes es correr código con un error conocido.'},
];

export const WHO_COLUMNS = ['Lo informa tsc, antes de ejecutar', 'Lo informa Node, al ejecutar'];
export const WHO_ITEMS: ClassifyItem[] = [
  {code: "reserva.ts:3:7 - error TS2322: Type 'number' is not assignable to type 'string'.", column: 0, why: 'Tiene el formato de tsc: archivo:línea:columna, la palabra error y un código TS. Se detecta revisando los tipos, sin ejecutar nada.', hint: '¿El mensaje tiene un código que empieza con TS?'},
  {code: "TypeError: Cannot read properties of undefined (reading 'nombre')\n    at <anonymous> (/Users/laura/practica/reserva.ts:9:30)", column: 1, why: 'Un error con nombre (TypeError) y una línea «at» con la ubicación es lo que imprime Node cuando el programa se detiene al ejecutar.', hint: '¿Qué tipo de línea aparece debajo del mensaje?'},
  {code: 'Found 2 errors in cuotas.ts:4', column: 0, why: 'Es el resumen que imprime tsc al terminar la revisión de tipos.', hint: '¿Qué herramienta cuenta los errores que encontró en un archivo?'},
  {code: "> const ciudad: string = 'Rosario'\nUncaught SyntaxError: Missing initializer in const declaration", column: 1, why: 'Es la consola interactiva de Node, que ejecuta JavaScript y no entiende las anotaciones de tipo: falla al ejecutar la línea.', hint: 'Fijate en el prompt de la primera línea: ¿dónde se escribió eso?'},
  {code: "envio.ts:12:5 - error TS2304: Cannot find name 'costoBase'.", column: 0, why: 'Formato de tsc con código TS2304: el compilador detecta el nombre inexistente antes de ejecutar.', hint: '¿El mensaje dice archivo:línea:columna seguido de «error TS»?'},
  {code: 'ReferenceError: costoBase is not defined\n    at <anonymous> (/Users/laura/practica/envio.ts:12:5)', column: 1, why: 'Es el mismo problema que el anterior, pero visto al ejecutar con tsx, que no revisa tipos: Node se detiene con ReferenceError.', hint: 'El problema puede ser el mismo que otro de la lista: ¿quién lo está informando acá?'},
];
