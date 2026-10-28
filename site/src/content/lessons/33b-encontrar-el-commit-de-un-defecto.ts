import type {TerminalStep} from '@site/src/components/Terminal';
import type {ClassifyItem} from '@site/src/components/Classify';

export const BISECT_STEPS: TerminalStep[] = [
  {
    instruction: 'Desde la v3.2.0, los recordatorios por email ya no se envían; en la v3.1.0 funcionaban. Empezá la búsqueda binaria.',
    accepted: ['git bisect start'],
    hint: 'Es el subcomando que inicia la búsqueda de git bisect.',
    output: 'status: waiting for both good and bad commits',
  },
  {
    instruction: 'Indicá que el commit actual tiene el defecto.',
    accepted: ['git bisect bad'],
    hint: 'Se marca el commit actual con la palabra que significa "falla".',
    output: 'status: waiting for good commit(s), bad commit known',
  },
  {
    instruction: 'Indicá la última versión en la que funcionaba, por su etiqueta.',
    accepted: ['git bisect good v3.1.0'],
    hint: 'Es la palabra que significa "funciona", seguida de la etiqueta de esa versión.',
    output: 'Bisecting: 4 revisions left to test after this (roughly 2 steps)\n[61b0e2c] Cambiar el proveedor de emails',
  },
  {
    instruction: 'Probaste el commit 61b0e2c y el recordatorio no llega. Informá el resultado.',
    accepted: ['git bisect bad'],
    hint: 'El defecto está presente en este commit.',
    output: 'Bisecting: 1 revision left to test after this (roughly 1 step)\n[4d90a7b] Agregar plantilla del recordatorio',
  },
  {
    instruction: 'Probaste 4d90a7b y el recordatorio llega bien. Informá el resultado.',
    accepted: ['git bisect good'],
    hint: 'En este commit el comportamiento es el correcto.',
    output: '61b0e2c is the first bad commit\ncommit 61b0e2c...\n    Cambiar el proveedor de emails',
  },
  {
    instruction: 'Ya sabés qué commit lo introdujo. Terminá la búsqueda y volvé al estado normal.',
    accepted: ['git bisect reset'],
    hint: 'Es el subcomando que cierra la búsqueda y vuelve a la rama donde estabas.',
    output: "Previous HEAD position was 4d90a7b Agregar plantilla del recordatorio\nSwitched to branch 'main'",
  },
];
export const BISECT_EXPLANATION =
  'Con los dos extremos marcados (bad en el commit actual, good en la v3.1.0), Git propone commits intermedios y descarta la mitad del rango con cada respuesta. Dos pruebas alcanzaron para saber que el defecto entró con el cambio de proveedor de emails. Ese dato, en el reporte, ahorra buena parte del debugging.';

export const PICKAXE_OUTPUT = `$ git log -S "MAX_REINTENTOS" --oneline -- pagos.ts
e9c27a4 Reducir reintentos de cobro
3f60b18 Mover la configuración de pagos a un archivo
a12d5c9 Reintentar el cobro si el proveedor no responde`;
export const PICKAXE_ACCEPTED = ['a12d5c9'];
export const PICKAXE_HINTS = [
  '`git log -S` lista los commits que agregaron o quitaron ese texto, del más reciente al más antiguo.',
  'La constante apareció por primera vez en el commit más antiguo de la lista: el de abajo.',
];
export const PICKAXE_EXPLANATION =
  '`git log -S` muestra los commits que agregaron o quitaron el texto, igual que `git log`, del más reciente al más antiguo. El primero en el que apareció `MAX_REINTENTOS` es el de más abajo, `a12d5c9`. Los otros dos la modificaron después: `e9c27a4` es el candidato si el problema es la cantidad de reintentos actual.';

export const TOOL_COLUMNS = ['git log -S', 'git blame -L', 'git bisect'];
export const TOOL_ITEMS: ClassifyItem[] = [
  {code: 'El mensaje «Código de cupón inválido» empezó a mostrarse con cupones válidos; querés saber qué commits tocaron ese mensaje.', column: 0, why: 'Se conoce un texto exacto del código: `git log -S` busca los commits que lo agregaron o quitaron.', hint: '¿Tenés un texto concreto para buscar en el código?'},
  {code: 'Ya sabés que el problema está en la condición de la línea 42 de checkout.ts y querés saber quién la modificó por última vez.', column: 1, why: 'Con la línea identificada, `blame -L` muestra el commit y el autor del último cambio.', hint: '¿Ya sabés en qué línea está el problema?'},
  {code: 'La exportación a PDF salía bien en la v2.8.0 y ahora sale en blanco; no tenés idea de qué archivo puede estar involucrado.', column: 2, why: 'Sin pista sobre el código, pero con una versión buena y una mala, `bisect` encuentra el commit probando el comportamiento.', hint: '¿Tenés alguna pista sobre el código, o solo sabés cuándo funcionaba?'},
  {code: 'Querés saber en qué commit se agregó la constante HORAS_MINIMAS_CANCELACION.', column: 0, why: 'Se busca un nombre concreto en el código: `log -S` lo encuentra directamente.', hint: '¿Hay un nombre concreto que buscar?'},
  {code: 'El login con Google dejaba entrar en la v4.1.0 y en la v4.3.0 ya no; entre las dos hay 60 commits.', column: 2, why: 'Dos versiones de referencia y muchos commits en el medio: es el caso típico de `bisect`.', hint: 'Fijate qué datos tenés: ¿un texto, una línea, o una versión buena y otra mala?'},
  {code: 'En una revisión ves una validación extraña en las líneas 15 a 20 de turnos.ts y querés saber en qué commit se escribió cada una.', column: 1, why: '`blame -L 15,20` muestra, línea por línea, el commit que las escribió.', hint: '¿Lo que tenés es un rango de líneas concreto?'},
];
