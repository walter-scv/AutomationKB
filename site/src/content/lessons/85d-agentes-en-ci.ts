import type {FillBlankSlot} from '@site/src/components/FillBlank';
import type {MatchItem} from '@site/src/components/Match';
import type {DecisionNode} from '@site/src/components/DecisionPath';

export const WF_TEMPLATE = `jobs:
  resumen:
    runs-on: ubuntu-latest
    {{a}}: 20
    permissions:
      contents: {{b}}
      id-token: write
    steps:
      - uses: actions/checkout@v4
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: \${{ {{c}} }}
          prompt: "/resumen-regresion"
          claude_args: "{{d}} 15"`;
export const WF_SLOTS: FillBlankSlot[] = [
  {id: 'a', answer: 'timeout-minutes'},
  {id: 'b', answer: 'read'},
  {id: 'c', answer: 'secrets.ANTHROPIC_API_KEY'},
  {id: 'd', answer: '--max-turns'},
];
export const WF_BANK = ['timeout-minutes', 'concurrency', 'read', 'write', 'secrets.ANTHROPIC_API_KEY', 'env.ANTHROPIC_API_KEY', '--max-turns', '--model'];
export const WF_EXPLANATION =
  'El job se corta a los 20 minutos, solo puede leer el repositorio, toma la clave de un secreto y el agente no da más de 15 vueltas.';

export const WHERE_LEFT: MatchItem[] = [
  {id: 'perm', text: 'El agente que resume la regresión no tiene que poder subir cambios al repositorio.'},
  {id: 'tools', text: 'El agente puede correr los tests sin preguntar, pero ningún otro comando de la terminal.'},
  {id: 'scope', text: 'El agente que repara solo puede modificar locators.ts y los Page Objects.'},
  {id: 'conc', text: 'Si llega un push nuevo a la rama, la ejecución anterior se cancela en lugar de sumarse.'},
  {id: 'secret', text: 'La clave del modelo no puede aparecer en ningún archivo del repositorio.'},
];
export const WHERE_RIGHT: MatchItem[] = [
  {id: 'conc', text: '`concurrency` en el workflow'},
  {id: 'secret', text: 'Un secreto del repositorio en GitHub'},
  {id: 'perm', text: 'El bloque `permissions` del job'},
  {id: 'scope', text: 'Las instrucciones del pedido o de la skill, con los permisos como respaldo'},
  {id: 'tools', text: '`--allowedTools` o las reglas de `.claude/settings.json`'},
];
export const WHERE_WHY: Record<string, string> = {
  perm: 'Lo que el job puede hacer en GitHub se fija en permissions.',
  tools: 'Las herramientas del agente se limitan en Claude Code.',
  scope: 'Qué archivos tocar lo dice el pedido; los permisos impiden lo que no debe hacer.',
  conc: 'concurrency evita ejecuciones duplicadas sobre la misma rama.',
  secret: 'El workflow lee la clave con secrets, sin escribirla.',
};

export const CI_START = 'token';
export const CI_NODES: Record<string, DecisionNode> = {
  token: {
    id: 'token',
    situation: 'El agente subió una corrección a la rama de un Pull Request usando github_token: ${{ secrets.GITHUB_TOKEN }}, y la suite no volvió a correr sobre ese commit. ¿Qué cambiás?',
    options: [
      {text: 'Agregar un paso que corra la suite dentro del mismo workflow del agente, después de subir.', correct: false, why: 'Correría, pero el Pull Request seguiría sin el resultado de su suite habitual sobre el commit nuevo.'},
      {text: 'Quitar github_token: los commits de la aplicación de Claude sí disparan la suite.', correct: true, why: 'Los commits hechos con GITHUB_TOKEN no disparan otros workflows.', next: 'manual'},
      {text: 'Pedirle a alguien del equipo que haga un push vacío cada vez que el agente sube algo.', correct: false, why: 'Funciona, pero agrega trabajo manual a algo que tenía que ser automático.'},
    ],
  },
  manual: {
    id: 'manual',
    situation: 'El equipo escribió una skill para resumir la regresión nocturna y quiere programarla en CI desde mañana. Nadie la corrió todavía. ¿Qué conviene?',
    options: [
      {text: 'Programarla igual, con --max-turns bajo, y mirar los resultados en unos días.', correct: false, why: 'Un procedimiento que no se probó a mano falla en CI sin que nadie lo vea, y cada falla cuesta.'},
      {text: 'Programarla en CI con todas las herramientas habilitadas, para que no se trabe.', correct: false, why: 'Suma riesgo a algo que todavía no se sabe si funciona.'},
      {text: 'Invocarla a mano unas veces, corregirla, y programarla cuando dé resultados confiables.', correct: true, why: 'A mano se ve cada paso; en CI, solo el resultado.', next: 'signal'},
    ],
  },
  signal: {
    id: 'signal',
    situation: 'La skill del resumen decide no hacer nada cuando la regresión pasó. Esa noche el equipo no encuentra ningún comentario y no sabe si corrió. ¿Qué falta?',
    options: [
      {text: 'Una señal visible también cuando no actúa: «sin fallos, no hay resumen».', correct: true, why: 'Sin señal, no se distingue un agente que decidió no actuar de uno que no arrancó.'},
      {text: 'Que corra dos veces por noche, para estar seguros de que alguna vez arrancó.', correct: false, why: 'Duplica el costo y sigue sin dejar señal.'},
      {text: 'Que mande un mensaje en Slack cada vez que arranca, con la hora de inicio.', correct: false, why: 'Dice que arrancó, no qué decidió ni por qué.'},
    ],
  },
};
export const CI_EXPLANATION =
  'Commits que disparan la suite, procedimientos probados a mano antes de programarlos, y una señal visible en cada ejecución, también cuando no se actúa.';
