import type {MatchItem} from '@site/src/components/Match';
import type {DecisionNode} from '@site/src/components/DecisionPath';
import type {MultiSelectQuestion} from '@site/src/components/MultiSelect';
import type {QuizQuestion} from '@site/src/components/Quiz';

export const VERDICT_LEFT: MatchItem[] = [
  {id: 'drift', text: 'El test no encuentra el botón «Reprogramar»; el contrato dice ese texto y FilaTurno.tsx ahora dice «Cambiar horario». En el entorno limpio falla igual.'},
  {id: 'data', text: 'Fallan 9 tests porque la fixture siembra turnos para un profesional que la limpieza del día anterior borró.'},
  {id: 'doc', text: 'El mensaje pasó de «Turno reservado» a «Reserva confirmada»; el Pull Request #318 lo hizo a propósito y el caso de uso UC-03 ya dice el mensaje nuevo.'},
  {id: 'bug', text: 'En el entorno limpio, la agenda acepta dos turnos a la misma hora para el mismo profesional, contra la regla de negocio.'},
  {id: 'none', text: 'El test de exportar falló una vez y en el entorno limpio pasa; no hay ningún cambio relacionado.'},
];
export const VERDICT_RIGHT: MatchItem[] = [
  {id: 'none', text: 'Sin corroborar: se abre un issue con la evidencia que hay, y lo investiga una persona'},
  {id: 'doc', text: 'Cambio documentado: se adapta la assertion al mensaje nuevo, citando la documentación'},
  {id: 'drift', text: 'Locator desactualizado: se corrige la entrada del contrato de locators'},
  {id: 'bug', text: 'Defecto: el test no se toca; se reproduce y se abre un issue con los pasos'},
  {id: 'data', text: 'Datos: se corrige la fixture o la limpieza que dejó sin profesional a los turnos'},
];
export const VERDICT_WHY: Record<string, string> = {
  drift: 'Falla en limpio, no encuentra el elemento, y hay una diferencia citada entre contrato y componente.',
  data: 'El problema está en cómo se crean los datos: se corrige en la fixture o en la limpieza.',
  doc: 'Es la única rama que puede tocar una assertion, y solo con la documentación citada.',
  bug: 'La aplicación incumple la regla: el test está bien.',
  none: 'Sin evidencia suficiente para actuar: lo investiga una persona.',
};

export const ROUTE_START = 'group';
export const ROUTE_NODES: Record<string, DecisionNode> = {
  group: {
    id: 'group',
    situation: 'La regresión nocturna de turnos tiene 23 tests fallidos. 18 fallan con el mismo error de ingreso, 3 en la búsqueda de pacientes y 2 pasaron en el reintento. ¿Cuántos grupos analiza el router?',
    options: [
      {text: '23, uno por test fallido, para no perder información.', correct: false, why: 'Muchos tests con la misma firma de error son un solo grupo: una causa.'},
      {text: '2: el del ingreso y el de la búsqueda.', correct: true, why: 'Se agrupa por firma de causa, y un test que pasó en un reintento no cuenta como fallido.', next: 'evidence'},
      {text: '3, con los que pasaron en el reintento como otro grupo.', correct: false, why: 'Un test que pasó en un reintento se trata como inestable, no como fallido.'},
    ],
  },
  evidence: {
    id: 'evidence',
    situation: 'Para el grupo de la búsqueda, el router propone «locator desactualizado». El test falla en el entorno limpio, pero lo que falla es el valor de la ficha, no que no encuentre el elemento. ¿Qué responde el adjudicador?',
    options: [
      {text: 'Rechaza el veredicto: falta una de las tres evidencias, y el grupo pasa a «sin corroborar».', correct: true, why: 'Un valor equivocado no es un locator que no encuentra el elemento: ante la duda, no se actúa.', next: 'serial'},
      {text: 'Lo aprueba, porque dos de las tres evidencias alcanzan y el resto se puede revisar en el Pull Request.', correct: false, why: 'Las tres evidencias se exigen a la vez para actuar.'},
      {text: 'Lo cambia a «defecto» y abre un issue directamente, porque si no es un locator tiene que ser de la aplicación.', correct: false, why: 'El adjudicador aprueba o rechaza: no inventa otro veredicto sin su propia evidencia.'},
    ],
  },
  serial: {
    id: 'serial',
    situation: 'Para ahorrar tiempo, alguien propone reproducir todos los grupos a la vez, con 4 workers. ¿Qué corresponde?',
    options: [
      {text: 'Hacerlo, porque el entorno ya está limpio y es más rápido.', correct: false, why: 'Los grupos pueden pisarse los datos entre sí y producir fallos que no existen.'},
      {text: 'Hacerlo solo con los grupos de locators, que no tocan datos.', correct: false, why: 'Todavía no se sabe qué grupo es de locators: eso es lo que se está averiguando.'},
      {text: 'Reproducir en serie, con un solo worker, en el entorno limpio.', correct: true, why: 'Reproducir en serie evita que un grupo afecte a otro, y la evidencia es confiable.'},
    ],
  },
};
export const ROUTE_EXPLANATION =
  'Agrupar por causa, exigir todas las evidencias antes de actuar, y reproducir en serie en un entorno limpio.';

export const REPORT_QUESTIONS: MultiSelectQuestion[] = [
  {
    prompt: '¿Qué reglas de reporte siguen el router de causa raíz? Marcá todas las que correspondan.',
    options: [
      {text: 'Una reparación exitosa no abre un ticket: su señal es el Pull Request.', correct: true, why: 'Evita ruido: lo que importa revisar es la corrección.'},
      {text: 'Si el mismo fallo de locators se repite tres noches, se abren tres issues.', correct: false, why: 'Los fallos repetidos comentan el issue abierto en lugar de duplicarlo.'},
      {text: 'Un fallo que vuelve después de que su issue se cerró abre un issue nuevo.', correct: true, why: 'Es una regresión nueva: el issue cerrado no se reabre.'},
      {text: 'Cada defecto distinto tiene su propio issue, con una marca oculta para no duplicarlo.', correct: true, why: 'Los defectos son la excepción a «un issue por categoría».'},
      {text: 'Si el router ruteó todos los fallos, el job nocturno termina en verde.', correct: false, why: 'Rutear no es arreglar: el job sigue en rojo.'},
      {text: 'El router se dispara con cada merge a main, para revisar cada cambio apenas entra.', correct: false, why: 'Analiza los fallos de la regresión nocturna: corre una vez por noche, sobre la corrida completa.'},
    ],
  },
];

export const WHY_QUIZ: QuizQuestion[] = [
  {
    question: 'Ayer se mergearon seis Pull Requests a la rama principal, y esta noche la regresión completa tiene doce tests en rojo. ¿Por qué no alcanza el auto-heal del Pull Request?',
    options: [
      {text: 'Porque su diagnóstico pregunta por un solo Pull Request, y acá hay seis, ya mergeados.', correct: true, why: 'A la noche no hay un único cambio al que preguntarle, ni una rama abierta donde dejar la corrección.'},
      {text: 'Porque el auto-heal del Pull Request solo funciona en un navegador, y de noche corren todos.', correct: false, why: 'El problema no es el navegador: es que no hay un único Pull Request sospechoso.'},
      {text: 'Porque de noche no hay credenciales para correr agentes en el CI del proyecto.', correct: false, why: 'Las credenciales son las mismas; lo que cambia es de dónde pueden venir los fallos.'},
    ],
  },
  {
    question: 'Un Pull Request de la agenda pasó en verde y se mergeó. Esa noche falla un test de la ficha del paciente que el Pull Request no corrió. ¿Cómo puede ser?',
    options: [
      {text: 'El test de la ficha es inestable: si pasó en el Pull Request, el cambio está bien.', correct: false, why: 'Ese test no corrió en el Pull Request: no hay ningún resultado anterior que compare.'},
      {text: 'El Pull Request corrió solo una parte de la suite, y el cambio rompió un test que no estaba en esa parte.', correct: true, why: 'Es la razón por la que la regresión completa corre de noche: encuentra lo que el subconjunto del Pull Request no cubre.'},
      {text: 'La regresión nocturna corre una versión vieja de la aplicación.', correct: false, why: 'Corre sobre la rama principal, con todo lo mergeado en el día.'},
    ],
  },
];
