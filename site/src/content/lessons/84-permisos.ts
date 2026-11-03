import type {ClassifyItem} from '@site/src/components/Classify';
import type {FillBlankSlot} from '@site/src/components/FillBlank';
import type {DecisionNode} from '@site/src/components/DecisionPath';

export const RULE_COLUMNS = ['allow', 'ask', 'deny'];
export const RULE_ITEMS: ClassifyItem[] = [
  {code: 'Correr los tests de la agenda con npx playwright test, varias veces por hora.', column: 0, why: 'Es lo que el agente hace todo el tiempo y no tiene riesgo: `allow` acotado a ese comando.', hint: '¿Tiene riesgo? ¿Se hace todo el tiempo?'},
  {code: 'Leer el .env con las contraseñas de las cuentas de prueba.', column: 2, why: 'Es un secreto: no se lee nunca.', hint: '¿Hay alguna situación en que el agente tenga que leerlo?'},
  {code: 'Hacer git push de una rama al repositorio remoto.', column: 1, why: 'Publica afuera: conviene que pregunte siempre, aunque haya reglas más amplias.', hint: '¿Querés decidir cada vez?'},
  {code: 'Editar los archivos de la carpeta legacy/, que el equipo congeló.', column: 2, why: 'Una carpeta que no se toca se bloquea con `deny`, no con una instrucción.', hint: '¿Puede haber una buena razón para editarlos?'},
  {code: 'Tomar un snapshot de la página con el servidor MCP de Playwright.', column: 0, why: 'Solo lee la página: se puede permitir sin preguntar.', hint: '¿Modifica algo?'},
  {code: 'Crear un ticket en Jira con el servidor MCP.', column: 1, why: 'Cambia algo afuera: conviene confirmar cada vez.', hint: '¿Qué pasa si se equivoca?'},
  {code: 'Revisar los tipos con npx tsc --noEmit.', column: 0, why: 'No modifica nada y se usa todo el tiempo.', hint: '¿Tiene algún efecto?'},
];

export const SET_TEMPLATE = `{
  "permissions": {
    "{{a}}": ["Bash(npx playwright test *)"],
    "ask": ["{{b}}"],
    "deny": ["{{c}}", "Edit({{d}})"]
  }
}`;
export const SET_SLOTS: FillBlankSlot[] = [
  {id: 'a', answer: 'allow'},
  {id: 'b', answer: 'Bash(git push *)'},
  {id: 'c', answer: 'Read(./.env)'},
  {id: 'd', answer: '/legacy/**'},
];
export const SET_BANK = ['allow', 'permit', 'Bash(git push *)', 'Bash(*)', 'Read(./.env)', 'Edit(./.env)', '/legacy/**', 'legacy'];
export const SET_EXPLANATION =
  '`allow` para correr los tests, `ask` para publicar con `git push`, y `deny` para leer el `.env` y para editar cualquier archivo de `legacy/`.';

export const MODE_START = 'freeze';
export const MODE_NODES: Record<string, DecisionNode> = {
  freeze: {
    id: 'freeze',
    situation: 'El CLAUDE.md de turnos dice «no edites legacy/», y aun así el agente editó un archivo de esa carpeta. ¿Qué cambiás?',
    options: [
      {text: 'Repetir la instrucción en mayúsculas, al principio del CLAUDE.md.', correct: false, why: 'Sigue siendo una instrucción: el agente puede no cumplirla.'},
      {text: 'Activar el modo plan en todas las sesiones del equipo.', correct: false, why: 'Frena todas las ediciones, no solo las de legacy/, y al aprobar el plan vuelve el problema.'},
      {text: 'Agregar Edit(/legacy/**) a la lista deny del proyecto.', correct: true, why: 'Una regla deny bloquea la edición aunque el agente lo intente.', next: 'carve'},
    ],
  },
  carve: {
    id: 'carve',
    situation: 'Hay un deny para Bash(git *) y querés que el agente pueda correr git status. Agregás Bash(git status) a allow. ¿Qué pasa?',
    options: [
      {text: 'git status sigue bloqueado: deny se evalúa antes que allow.', correct: true, why: 'Primero deny, después ask, después allow.', next: 'container'},
      {text: 'Se permite, porque la regla allow es más específica que el deny.', correct: false, why: 'La especificidad no cambia el orden: deny se evalúa primero.'},
      {text: 'Pregunta cada vez, por el conflicto entre las dos reglas.', correct: false, why: 'No hay ambigüedad: gana la primera en el orden deny, ask, allow.'},
    ],
  },
  container: {
    id: 'container',
    situation: 'Querés que un agente revise la suite durante la noche, sin nadie que apruebe nada. Solo tiene que leer archivos y correr npx playwright test. ¿Qué modo y qué reglas usás?',
    options: [
      {text: 'bypassPermissions en tu computadora, porque no va a pedir nada.', correct: false, why: 'Permite cualquier acción con tu usuario y tus archivos: la documentación lo reserva para entornos aislados.'},
      {text: 'dontAsk, con allow solo para Bash(npx playwright test *).', correct: true, why: 'No pregunta nunca: hace lo permitido y deniega todo lo demás. Es el modo para una lista cerrada de acciones sin nadie mirando.'},
      {text: 'acceptEdits, para que no pregunte por las ediciones.', correct: false, why: 'Sigue preguntando antes de correr comandos, y de noche nadie responde: se queda esperando.'},
    ],
  },
};
export const MODE_EXPLANATION =
  'Lo intocable se bloquea con deny; un allow no abre excepciones dentro de un deny; y un agente sin nadie mirando trabaja con dontAsk y una lista cerrada de acciones permitidas.';
