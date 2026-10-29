import type {ClassifyItem} from '@site/src/components/Classify';
import type {BuilderStep} from '@site/src/components/CommandBuilder';
import type {SpotTokenRound} from '@site/src/components/SpotToken';

export const FLOW_COLUMNS = ['GitHub flow', 'Git flow', 'Trunk-based'];
export const FLOW_ITEMS: ClassifyItem[] = [
  {code: 'Una app de escritorio publica la versión 5.0 en marzo y tiene que seguir corrigiendo la 4.x para los clientes que no actualizan.', column: 1, why: 'Versiones numeradas y más de una vigente a la vez: Git flow, con `main` etiquetado y ramas `hotfix/*`, ordena ese mantenimiento.', hint: '¿Cuántas versiones del producto hay que mantener al mismo tiempo?'},
  {code: 'Un sitio web publica a producción cada cambio apenas se aprueba su Pull Request; hay una sola versión vigente.', column: 0, why: 'Una rama `main` siempre publicable y ramas cortas con PR: es exactamente GitHub flow.', hint: '¿Cuánto tarda un cambio aprobado en llegar a producción, y hace falta congelar una versión?'},
  {code: 'El equipo integra en main cuatro o cinco veces por día; lo que no está terminado queda escondido detrás de un interruptor de configuración.', column: 2, why: 'Integración varias veces por día y funcionalidades incompletas escondidas con feature flags: desarrollo basado en trunk.', hint: '¿Cuánto viven las ramas, y cómo se oculta lo incompleto?'},
  {code: 'Antes de cada publicación trimestral se congela una rama donde solo se corrigen los defectos que encuentra QA.', column: 1, why: 'Congelar una rama de versión (`release/*`) para estabilizarla es propio de Git flow.', hint: '¿Hay una rama especial para estabilizar la versión antes de publicarla?'},
  {code: 'Cada PR tiene su propio entorno temporal donde QA prueba el cambio antes del merge a main, que sale a producción el mismo día.', column: 0, why: 'La prueba ocurre en la rama del PR, porque `main` se publica enseguida: GitHub flow.', hint: '¿Qué pasa con main inmediatamente después del merge?'},
  {code: 'No hay ramas de más de un día: si un cambio es grande, se integra en partes chicas, con la parte visible apagada hasta el final.', column: 2, why: 'Ramas de horas y cambios grandes integrados en partes detrás de un flag: trunk-based.', hint: '¿Qué se hace con un cambio que tarda una semana en terminarse?'},
];

export const RELEASE_PREFIX = 'git ';
export const RELEASE_STEPS: BuilderStep[] = [
  {options: ['branch -d', 'switch -c', 'merge'], correct: 'switch -c', hint: 'Lo que hace falta es una rama nueva, y quedar parado en ella.'},
  {options: ['release/3.2.0', 'feature/3.2.0', 'hotfix/3.2.0'], correct: 'release/3.2.0', hint: 'El prefijo indica para qué existe la rama: acá es preparar una versión para publicar.'},
  {options: ['main', 'develop', 'origin/main'], correct: 'develop', hint: '¿Dónde está acumulado el trabajo terminado que todavía no se publicó?'},
];
export const RELEASE_EXPLANATION =
  '`git switch -c release/3.2.0 develop` crea la rama de la versión desde `develop`, donde está todo lo terminado para la 3.2.0. `main` todavía tiene solo lo publicado (la 3.1.x), así que partir de ahí dejaría afuera todo lo nuevo.';

export const FLOW_TOKEN_PROMPT = '¿Qué palabra no corresponde al flujo que indica la línea?';
export const FLOW_TOKEN_ROUNDS: SpotTokenRound[] = [
  {
    line: 'Git flow: el defecto encontrado al probar la 3.2.0 se corrige en develop.',
    targetIndex: 12,
    why: 'En Git flow, lo que aparece al probar una versión se corrige en su rama `release/*`: `develop` ya puede tener funcionalidades de la versión siguiente.',
    hint: '¿Qué otra cosa, además de la 3.2.0, puede estar ya integrada en esa rama?',
  },
  {
    line: 'GitHub flow: la rama del cambio se crea desde develop y vuelve por Pull Request.',
    targetIndex: 9,
    why: 'GitHub flow tiene una sola rama permanente, `main`: toda rama sale de ahí.',
    hint: '¿Cuántas ramas permanentes tiene este flujo?',
  },
  {
    line: 'Git flow: el hotfix/3.1.1 se integra solo a main.',
    targetIndex: 6,
    why: 'Un `hotfix/*` se integra a `main` y también a `develop`; si va solo a `main`, la corrección falta en la próxima versión y el defecto reaparece.',
    hint: '¿La versión siguiente, que sale de otra rama, va a tener esta corrección?',
  },
  {
    line: 'Trunk-based: la rama del buscador nuevo lleva tres semanas abierta sin integrarse.',
    targetIndex: 8,
    why: 'En trunk-based las ramas viven horas o uno o dos días; tres semanas es exactamente lo que el flujo evita. Lo incompleto se integra detrás de un flag.',
    hint: '¿Cuánto tiempo puede vivir una rama en este flujo?',
  },
];
