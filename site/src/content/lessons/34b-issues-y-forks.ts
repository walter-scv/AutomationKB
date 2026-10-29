import type {MultiSelectQuestion} from '@site/src/components/MultiSelect';
import type {OrderItem, OrderRule} from '@site/src/components/Order';
import type {FillBlankSlot} from '@site/src/components/FillBlank';

export const ISSUE_QUESTIONS: MultiSelectQuestion[] = [
  {
    prompt: 'Vas a registrar como issue que el filtro de turnos por profesional muestra turnos de otro profesional. ¿Qué tiene que tener el issue para que se pueda trabajar? Marcá todo lo que corresponda.',
    options: [
      {text: 'La versión y el entorno donde ocurrió.', correct: true, why: 'Sin versión ni entorno, quien lo tome no sabe dónde reproducirlo.'},
      {text: 'Los pasos con datos concretos: qué profesional se filtró y qué turnos aparecieron.', correct: true, why: 'Son lo que permite reproducir el fallo sin preguntar nada.'},
      {text: 'La causa que suponés: "seguro el filtro compara por apellido".', correct: false, why: 'Una causa no confirmada puede mandar la investigación al lugar equivocado; el issue describe el síntoma.'},
      {text: 'El resultado esperado y el obtenido, por separado.', correct: true, why: 'Deja claro qué difiere, sin interpretar.'},
      {text: 'La label `bug` y, si corresponde, la versión (milestone) en la que se tiene que resolver.', correct: true, why: 'Clasificarlo permite encontrarlo, priorizarlo y planificarlo.'},
      {text: 'El nombre de quien programó el filtro, para que lo arregle.', correct: false, why: 'El responsable se asigna como assignee según cómo se organiza el equipo; señalar a quien escribió el código no ayuda a resolverlo.'},
    ],
  },
];

export const FORK_ORDER_ITEMS: OrderItem[] = [
  {id: 'pr', what: 'Paso', code: 'Abrir un Pull Request desde la rama del fork hacia el repositorio original.'},
  {id: 'clone', what: 'Paso', code: 'git clone https://github.com/ana-gomez/biblioteca.git'},
  {id: 'push', what: 'Paso', code: 'git push -u origin fix/busqueda-por-isbn'},
  {id: 'fork', what: 'Paso', code: 'Tocar «Fork» en github.com/biblioteca-abierta/biblioteca.'},
  {id: 'commit', what: 'Paso', code: 'git commit -m "Aceptar ISBN con guiones en la búsqueda"'},
  {id: 'branch', what: 'Paso', code: 'git switch -c fix/busqueda-por-isbn'},
];
export const FORK_ORDER_CORRECT = ['fork', 'clone', 'branch', 'commit', 'push', 'pr'];
export const FORK_ORDER_RULES: OrderRule[] = [
  {before: 'fork', after: 'clone', why: 'se clona el fork, que tiene que existir primero en la cuenta propia.'},
  {before: 'clone', after: 'branch', why: 'la rama se crea dentro del repositorio clonado.'},
  {before: 'branch', after: 'commit', why: 'los commits del cambio van en su propia rama, no en main.'},
  {before: 'commit', after: 'push', why: 'se sube lo que ya está confirmado.'},
  {before: 'push', after: 'pr', why: 'el Pull Request se abre sobre una rama que ya está en el fork.'},
];

export const SYNC_TEMPLATE =
  'git switch main\ngit {{traer}} upstream\ngit merge {{ref}}\ngit {{subir}} origin main';
export const SYNC_SLOTS: FillBlankSlot[] = [
  {id: 'traer', answer: 'fetch'},
  {id: 'ref', answer: 'upstream/main'},
  {id: 'subir', answer: 'push'},
];
export const SYNC_BANK = ['origin/main', 'push', 'clone', 'fetch', 'upstream/main', 'pull'];
export const SYNC_EXPLANATION =
  '`fetch upstream` trae lo nuevo del repositorio original, `merge upstream/main` lo incorpora al main local (`origin/main` es el fork, que justamente está atrasado) y `push origin main` actualiza el fork en GitHub.';
