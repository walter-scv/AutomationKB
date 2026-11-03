import type {OrderItem, OrderRule} from '@site/src/components/Order';
import type {MatchItem} from '@site/src/components/Match';
import type {FillBlankSlot} from '@site/src/components/FillBlank';

export const PHASE_ITEMS: OrderItem[] = [
  {id: 'run', what: 'Fase', code: 'Correr los tests nuevos de la pantalla de pacientes.'},
  {id: 'docs', what: 'Fase', code: 'Leer los casos de uso de pacientes y los tests que ya existen.'},
  {id: 'review', what: 'Fase', code: 'Revisar el Page Object y los tests contra las reglas de la suite.'},
  {id: 'clean', what: 'Fase', code: 'Borrar los archivos temporales del proceso.'},
  {id: 'plan', what: 'Fase', code: 'Decidir los escenarios y los datos que necesita cada uno.'},
  {id: 'update', what: 'Fase', code: 'Actualizar la cobertura de los casos de uso de pacientes.'},
  {id: 'build', what: 'Fase', code: 'Escribir el Page Object y los tests como archivos temporales.'},
  {id: 'app', what: 'Fase', code: 'Recorrer la pantalla con MCP y verificar los locators que necesitan los escenarios del plan.'},
];
export const PHASE_CORRECT = ['docs', 'plan', 'app', 'build', 'review', 'run', 'update', 'clean'];
export const PHASE_RULES: OrderRule[] = [
  {before: 'docs', after: 'plan', why: 'El plan se arma a partir de los casos de uso y de lo que ya está cubierto.'},
  {before: 'plan', after: 'app', why: 'Se verifican los locators que necesitan los escenarios del plan.'},
  {before: 'app', after: 'build', why: 'El constructor escribe con el plan y los locators verificados.'},
  {before: 'build', after: 'review', why: 'Se revisa lo que el constructor dejó en archivos temporales.'},
  {before: 'review', after: 'run', why: 'Solo se corre lo que pasó la revisión.'},
  {before: 'run', after: 'update', why: 'La cobertura se documenta cuando los tests pasaron de verdad.'},
  {before: 'update', after: 'clean', why: 'La limpieza va al final, y se hace aunque algo haya fallado.'},
];

export const ART_LEFT: MatchItem[] = [
  {id: 'plan', text: 'El planificador termina su trabajo.'},
  {id: 'explore', text: 'El agente con MCP termina de verificar la pantalla.'},
  {id: 'build', text: 'El constructor termina el Page Object y el test.'},
  {id: 'review', text: 'Un revisor termina de revisar el Page Object.'},
  {id: 'run', text: 'El ejecutor corre los tests nuevos.'},
];
export const ART_RIGHT: MatchItem[] = [
  {id: 'run', text: 'La salida real de npx playwright test, con cuántos tests pasaron y cuántos fallaron'},
  {id: 'review', text: 'Un veredicto APROBADO o RECHAZADO, con la lista de problemas'},
  {id: 'plan', text: 'El plan aprobado en JSON: cada test con su caso de uso y su prioridad'},
  {id: 'build', text: 'El Page Object y los tests, como archivos temporales en .claude/temp/'},
  {id: 'explore', text: 'La lista corta de locators verificados, uno por elemento que usan los escenarios'},
];
export const ART_WHY: Record<string, string> = {
  plan: 'El plan con formato fijo le dice a cada fase qué tests se esperan.',
  explore: 'Un resultado condensado, no el snapshot entero.',
  build: 'No van directo a la suite: primero se revisan.',
  review: 'Un veredicto fijo que el orquestador puede leer sin interpretar.',
  run: 'Una ejecución real es la única validación de un test.',
};

export const PLAN_TEMPLATE = `{
  "funcionalidad": "cancelar turnos",
  "tests_requeridos": {
    "cancelar un turno lo libera": { "caso_de_uso": "UC-07", "prioridad": "{{a}}" },
    "la agenda muestra en gris los turnos pasados": { "caso_de_uso": "{{b}}", "prioridad": "p1" }
  },
  "datos": {
    "cancelar un turno lo libera": "{{c}}",
    "la agenda muestra en gris los turnos pasados": "{{d}}"
  }
}`;
export const PLAN_SLOTS: FillBlankSlot[] = [
  {id: 'a', answer: 'p0'},
  {id: 'b', answer: 'UC-08'},
  {id: 'c', answer: 'propio'},
  {id: 'd', answer: 'sembrados'},
];
export const PLAN_BANK = ['p0', 'p3', 'UC-08', 'UC-80', 'propio', 'sembrados', 'ninguno'];
export const PLAN_EXPLANATION =
  'La cancelación es crítica: p0. La vista de turnos pasados tiene su propio caso de uso. Cancelar modifica el turno: necesita uno propio; mostrar turnos pasados solo lee, así que puede usar los sembrados.';
