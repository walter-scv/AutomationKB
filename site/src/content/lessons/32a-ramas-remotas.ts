import type {TerminalStep} from '@site/src/components/Terminal';
import type {MultiSelectQuestion} from '@site/src/components/MultiSelect';

export const PR_BRANCH_STEPS: TerminalStep[] = [
  {
    instruction: 'Diego abrió un Pull Request desde la rama fix/filtro-por-fecha y te pidió que lo pruebes. Traé el estado actual del remoto, sin tocar tu rama.',
    accepted: ['git fetch', 'git fetch origin'],
    hint: 'Es el comando que descarga lo nuevo del remoto sin mezclarlo con nada.',
    output: 'From https://github.com/empresa/turnos\n * [new branch]      fix/filtro-por-fecha -> origin/fix/filtro-por-fecha',
  },
  {
    instruction: 'Cambiá a la rama de Diego de forma que quede una rama local vinculada con la remota.',
    accepted: ['git switch fix/filtro-por-fecha', 'git checkout fix/filtro-por-fecha', 'git checkout --track origin/fix/filtro-por-fecha', 'git switch --track origin/fix/filtro-por-fecha'],
    hint: 'Se cambia a la rama por su nombre, sin el prefijo origin/: Git crea la rama local y la vincula sola.',
    output: "branch 'fix/filtro-por-fecha' set up to track 'origin/fix/filtro-por-fecha'.\nSwitched to a new branch 'fix/filtro-por-fecha'",
  },
  {
    instruction: 'Encontraste un problema y Diego subió una corrección a su rama. Actualizá tu copia local de esa rama antes de volver a probar.',
    accepted: ['git pull', 'git pull origin fix/filtro-por-fecha'],
    hint: 'Como la rama ya está vinculada, alcanza con el comando que trae y mezcla, sin argumentos.',
    output: 'Updating 2b7e1a0..9f03c4d\nFast-forward\n filtros.ts | 3 ++-',
  },
  {
    instruction: 'El PR se integró y la rama se borró en GitHub. Volvé a main.',
    accepted: ['git switch main', 'git checkout main'],
    hint: 'Es el comando para cambiar a una rama que ya existe.',
    output: "Switched to branch 'main'",
  },
  {
    instruction: 'Borrá tu rama local de prueba, con la opción que se niega si tuviera trabajo sin integrar.',
    accepted: ['git branch -d fix/filtro-por-fecha'],
    hint: 'Es git branch con la opción de borrado segura (en minúscula) y el nombre de la rama.',
    output: 'Deleted branch fix/filtro-por-fecha (was 9f03c4d).',
  },
];
export const PR_BRANCH_EXPLANATION =
  'Para probar la rama de otra persona: `fetch` para que exista como `origin/<rama>`, `switch` por su nombre para crear la rama local vinculada, `pull` cada vez que la persona sube correcciones, y al final volver a main y borrar la rama local.';

export const BRANCH_VV_OUTPUT = `$ git fetch
$ git branch -vv
  feature/turnos-online   4e2a91c [origin/feature/turnos-online: behind 3] Elegir profesional en el turno online
* main                    e41b7c2 [origin/main] Ordenar los turnos por fecha
  fix/recordatorio        77c1f08 [origin/fix/recordatorio: ahead 2] Enviar recordatorio 24 horas antes
  experimento-colores     1d3b5e9 Probar colores del calendario`;
export const BRANCH_VV_ACCEPTED = ['feature/turnos-online'];
export const BRANCH_VV_HINTS = [
  'Mirá lo que dice entre corchetes cada línea: con qué rama remota se compara y si está adelante (ahead) o atrás (behind).',
  'Probar una rama atrasada es probar una versión vieja: buscá la que el remoto tiene más avanzada que tu copia local.',
];
export const BRANCH_VV_EXPLANATION =
  '`feature/turnos-online` está 3 commits atrás de su remota: hay cambios subidos que tu copia no tiene, así que primero hay que hacer `git pull` en esa rama. `fix/recordatorio` está adelante (tiene commits sin subir), `main` está al día y `experimento-colores` no sigue a ninguna rama remota.';

export const REMOTE_BRANCH_QUESTIONS: MultiSelectQuestion[] = [
  {
    prompt: 'Después de un `git fetch`, aparece la referencia `origin/feature/exportar-agenda`. ¿Cuáles de estas afirmaciones son ciertas? Marcá todas las que correspondan.',
    options: [
      {text: 'Es una foto de cómo estaba esa rama en el remoto en el momento del `fetch`.', correct: true, why: 'Las ramas de seguimiento remoto reflejan el estado del remoto en la última comunicación con el servidor.'},
      {text: 'Se puede commitear directamente sobre `origin/feature/exportar-agenda`.', correct: false, why: 'Es una referencia que Git mueve solo; para trabajar hace falta una rama local, que se crea con `git switch feature/exportar-agenda`.'},
      {text: 'Si la autora sube más commits, la referencia se actualiza sola en tu computadora, sin hacer nada.', correct: false, why: 'Se actualiza recién en el próximo `fetch` o `pull`: hasta entonces muestra el estado anterior.'},
      {text: '`git switch feature/exportar-agenda` crea una rama local vinculada a esa rama remota.', correct: true, why: 'Si existe la remota y no hay una local con ese nombre, `switch` la crea y la deja siguiendo a `origin/feature/exportar-agenda`.'},
      {text: 'Si la rama se borra en GitHub, la referencia desaparece sola de tu repositorio en ese momento.', correct: false, why: 'Sigue apareciendo hasta que se ejecuta `git fetch --prune`.'},
    ],
  },
];
