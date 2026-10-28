import type {ClassifyItem} from '@site/src/components/Classify';
import type {BuilderStep} from '@site/src/components/CommandBuilder';
import type {OrderItem, OrderRule} from '@site/src/components/Order';

export const TURNOS_CODE = `// src/agenda/turnos.ts
export interface Turno {
  id: number;
  fecha: string;
}

export const DURACION_MINUTOS = 30;

export function reservar(fecha: string): Turno {
  // ...
}

function validarHorario(fecha: string): boolean {
  // ...
}

export default class Agenda {
  // ...
}`;
export const IMPORT_COLUMNS = ['Compila', 'Da error'];
export const IMPORT_ITEMS: ClassifyItem[] = [
  {code: "import { reservar, DURACION_MINUTOS } from './turnos';", column: 0, why: 'Los dos están exportados con nombre y se importan entre llaves con el nombre exacto.'},
  {code: "import { validarHorario } from './turnos';", column: 1, why: '`validarHorario` no tiene `export`: es interna de turnos.ts. TypeScript informa TS2459.', hint: '¿Todas las funciones de turnos.ts tienen export?'},
  {code: "import MiAgenda from './turnos';", column: 0, why: 'Es el export por defecto: se importa sin llaves y quien importa elige el nombre.', hint: '¿Qué pasa con el nombre cuando se importa un export por defecto?'},
  {code: "import { Agenda } from './turnos';", column: 1, why: '`Agenda` es el export por defecto: se importa sin llaves. Con llaves, TypeScript informa TS2614.', hint: '¿Cómo está exportada la clase, con nombre o por defecto?'},
  {code: "import { reservar as reservarTurno } from './turnos';", column: 0, why: '`as` renombra un import con nombre: en este archivo la función se llama `reservarTurno`.', hint: '¿El nombre original, antes de `as`, existe en turnos.ts?'},
  {code: "import { Reservar } from './turnos';", column: 1, why: 'Los nombres distinguen mayúsculas: el exportado es `reservar`. TypeScript informa TS2724 y sugiere el correcto.', hint: 'Compará letra por letra con lo que exporta turnos.ts.'},
  {code: "import type { Turno } from './turnos';", column: 0, why: '`Turno` es una interface exportada; `import type` deja explícito que es solo un tipo.', hint: '¿Turno está exportado?'},
  {code: "import { reservar } from './agenda/turnos';", column: 1, why: 'El archivo que importa está en la misma carpeta, `src/agenda/`: `./agenda/turnos` buscaría `src/agenda/agenda/turnos.ts`. TypeScript informa TS2307.', hint: 'El archivo que importa está en src/agenda/. ¿Adónde lleva esa ruta desde ahí?'},
];

export const PATH_PREFIX = 'import';
export const PATH_STEPS: BuilderStep[] = [
  {options: ['formatearMoneda', '{ formatearMoneda }', '* formatearMoneda'], correct: '{ formatearMoneda }', hint: 'Es un export con nombre, no por defecto.'},
  {options: ['of', '=', 'from'], correct: 'from', hint: 'Es la palabra que introduce la ruta del archivo.'},
  {options: ["'./utils/formato/moneda'", "'../utils/formato/moneda'", "'../../utils/formato/moneda'"], correct: "'../utils/formato/moneda'", hint: 'Desde src/reportes/, ¿cuántas carpetas hay que subir para llegar a src/?'},
];
export const PATH_TREE = `src/
├── reportes/
│   └── mensual.ts   ← importa
└── utils/
    └── formato/
        └── moneda.ts`;
export const PATH_EXPLANATION =
  "`import { formatearMoneda } from '../utils/formato/moneda'`: entre llaves porque es un export con nombre, y la ruta sube de `reportes/` a `src/` con `../` antes de entrar a `utils/formato/`. Con `../../` se saldría de `src/`.";

export const EXTRACT_ITEMS: OrderItem[] = [
  {id: 'check', what: 'Paso', code: 'npx tsc --noEmit'},
  {id: 'import', what: 'Paso', code: "En pedidos.ts, agregar: import { calcularEnvio } from './envios';"},
  {id: 'create', what: 'Paso', code: 'Crear el archivo envios.ts en la misma carpeta que pedidos.ts.'},
  {id: 'export', what: 'Paso', code: 'Agregar export delante de function calcularEnvio en envios.ts.'},
  {id: 'move', what: 'Paso', code: 'Cortar la función calcularEnvio de pedidos.ts y pegarla en envios.ts.'},
];
export const EXTRACT_CORRECT = ['create', 'move', 'export', 'import', 'check'];
export const EXTRACT_RULES: OrderRule[] = [
  {before: 'create', after: 'move', why: 'la función se pega en un archivo que tiene que existir.'},
  {before: 'move', after: 'export', why: 'el export se agrega sobre la función ya ubicada en su archivo nuevo.'},
  {before: 'export', after: 'import', why: 'solo se puede importar lo que el otro archivo exporta.'},
  {before: 'import', after: 'check', why: 'la revisión de tipos confirma que la ruta y el nombre del import son correctos; antes del import, pedidos.ts tendría un error por usar una función que ya no está.'},
];
