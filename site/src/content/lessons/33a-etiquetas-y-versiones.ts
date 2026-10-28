import type {BuilderStep} from '@site/src/components/CommandBuilder';
import type {DecisionNode} from '@site/src/components/DecisionPath';
import type {MatchItem} from '@site/src/components/Match';

export const TAG_PREFIX = 'git ';
export const TAG_STEPS: BuilderStep[] = [
  {
    options: ['branch', 'tag', 'commit'],
    correct: 'tag',
    hint: 'Una rama avanza con cada commit; lo que hace falta es un nombre fijo para este commit.',
  },
  {
    options: ['-d', '-l', '-a'],
    correct: '-a',
    hint: 'Hace falta la opción que guarda autor, fecha y mensaje: la recomendada para versiones.',
  },
  {
    options: ['v3.1', 'v3.1.0', 'version-nueva'],
    correct: 'v3.1.0',
    hint: 'El nombre sigue la convención de tres números que se ve en la teoría.',
  },
  {
    options: ['-m "Versión 3.1.0: turnos online"', '--force', '--tags'],
    correct: '-m "Versión 3.1.0: turnos online"',
    hint: 'Una etiqueta anotada necesita su mensaje.',
  },
];
export const TAG_EXPLANATION =
  '`git tag -a v3.1.0 -m "..."` crea una etiqueta anotada sobre el commit actual, con el nombre en formato semántico y un mensaje. Después hay que subirla con `git push origin v3.1.0`, porque `git push` solo no sube etiquetas.';

export const HOTFIX_START = 'reproducir';
export const HOTFIX_NODES: Record<string, DecisionNode> = {
  reproducir: {
    id: 'reproducir',
    situation: 'Producción tiene la v3.0.2. Un usuario reporta que el turno online no muestra el nombre del profesional. En `main` ya hay tres funcionalidades nuevas sin liberar. ¿Dónde intentás reproducir el fallo?',
    options: [
      {text: 'En `main`, que tiene el código más reciente.', correct: false, why: '`main` ya no es lo que tiene producción: puede que el fallo no aparezca, o que aparezca por otro motivo. Hay que probar lo que el usuario está usando.'},
      {text: 'En la etiqueta v3.0.2, con `git switch --detach v3.0.2`.', correct: true, why: 'La etiqueta apunta exactamente al código que se liberó: es donde el fallo tiene que reproducirse.', next: 'corregir'},
      {text: 'En la última etiqueta que haya, sea cual sea.', correct: false, why: 'La última etiqueta puede ser una versión que todavía no está en producción. Hay que usar la de la versión reportada.'},
    ],
  },
  corregir: {
    id: 'corregir',
    situation: 'El fallo se reproduce en la v3.0.2. Hay que liberar una corrección cuanto antes, sin incluir las funcionalidades nuevas de `main`. ¿Cómo se empieza?',
    options: [
      {text: 'Corregir y commitear ahí mismo, en detached HEAD.', correct: false, why: 'Esos commits no quedan en ninguna rama y se pierden de vista al cambiar de rama.'},
      {text: 'Corregir en `main` y liberar desde ahí.', correct: false, why: 'Liberar desde `main` incluiría las tres funcionalidades que todavía no se probaron.'},
      {text: 'Crear una rama desde la etiqueta con `git switch -c hotfix/v3.0.3 v3.0.2` y corregir ahí.', correct: true, why: 'La rama parte exactamente de lo publicado, sin lo nuevo de `main`.', next: 'version'},
    ],
  },
  version: {
    id: 'version',
    situation: 'La corrección está lista y probada en la rama del hotfix. ¿Qué número lleva la nueva versión?',
    options: [
      {text: 'v3.0.3', correct: true, why: 'Es una corrección de un defecto, sin funcionalidad nueva: sube el número de parche.'},
      {text: 'v3.1.0', correct: false, why: 'El número menor sube cuando se agrega funcionalidad; esto solo corrige un defecto.'},
      {text: 'v4.0.0', correct: false, why: 'El número mayor sube con cambios incompatibles, y esta corrección no rompe nada que funcionara.'},
    ],
  },
};
export const HOTFIX_EXPLANATION =
  'Un defecto de producción se reproduce sobre la etiqueta de esa versión, se corrige en una rama creada desde la etiqueta para no arrastrar lo nuevo de `main`, y se libera como versión de parche.';

export const SEMVER_LEFT: MatchItem[] = [
  {id: 'patch', text: 'Se corrige que el total no sumaba el envío; no se agrega nada nuevo.'},
  {id: 'minor', text: 'Se agrega la opción de pagar en cuotas; todo lo anterior sigue funcionando igual.'},
  {id: 'major', text: 'El formato de exportación cambia y los archivos de la versión anterior ya no se pueden importar.'},
  {id: 'rc', text: 'La próxima versión mayor está lista para que QA la pruebe, pero todavía no se libera.'},
];
export const SEMVER_RIGHT: MatchItem[] = [
  {id: 'major', text: '`v2.6.1` → `v3.0.0`'},
  {id: 'rc', text: '`v3.0.0-rc.1`'},
  {id: 'patch', text: '`v2.6.1` → `v2.6.2`'},
  {id: 'minor', text: '`v2.6.1` → `v2.7.0`'},
];
export const SEMVER_WHY: Record<string, string> = {
  patch: 'Corrección sin funcionalidad nueva: sube el último número.',
  minor: 'Funcionalidad nueva compatible con lo anterior: sube el del medio y el parche vuelve a cero.',
  major: 'Cambio incompatible: sube el primero y los otros dos vuelven a cero.',
  rc: 'El sufijo `-rc.1` marca una versión candidata: se prueba antes de publicar la definitiva.',
};
