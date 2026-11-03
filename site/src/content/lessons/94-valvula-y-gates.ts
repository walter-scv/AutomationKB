import type {QuizQuestion} from '@site/src/components/Quiz';
import type {ClassifyItem} from '@site/src/components/Classify';
import type {FillBlankSlot} from '@site/src/components/FillBlank';

export const VALVE_QUIZ: QuizQuestion[] = [
  {
    question: 'decidirHeal recibe 7 grupos de la agenda, cada uno con un Pull Request sospechoso distinto; 2 son de locator y 5 son defectos o sin corroborar. ¿Qué decisión devuelve?',
    options: [
      {text: 'router: manda los fallos al router de causa raíz.', correct: false, why: 'Hay más de 5 grupos, no convergen y los reparables (2 de 7) no son mayoría: se cumplen las tres condiciones para frenar.'},
      {text: 'regresion-amplia: frena y lo mira una persona.', correct: true, why: 'Más de 5 grupos, sin un único sospechoso y sin mayoría reparable.'},
      {text: 'sin-fallos: no hay fallos para procesar.', correct: false, why: 'Hay 7 grupos: sin-fallos es solo para una lista vacía.'},
    ],
  },
  {
    question: 'Ahora recibe 8 grupos, todos con el Pull Request #402 como sospechoso, y ninguno es reparable. ¿Qué decisión devuelve?',
    options: [
      {text: 'router, porque todos los grupos convergen en el #402.', correct: true, why: 'Converger en un único Pull Request es una de las dos salidas que habilitan el router.'},
      {text: 'regresion-amplia, porque hay más de 5 grupos y ninguno es reparable.', correct: false, why: 'Para frenar tienen que cumplirse las tres condiciones, y estos grupos convergen.'},
      {text: 'sin-fallos, porque no hay nada que reparar.', correct: false, why: 'sin-fallos es para cuando no hay fallos, no para cuando no son reparables.'},
    ],
  },
  {
    question: 'Recibe 6 grupos con sospechosos distintos: 4 son de locator o de datos. ¿Qué decisión devuelve?',
    options: [
      {text: 'regresion-amplia, porque hay más de 5 grupos que no convergen.', correct: false, why: 'Falta la tercera condición: 4 de 6 reparables es mayoría.'},
      {text: 'sin-fallos, porque los grupos no tienen un sospechoso común.', correct: false, why: 'sin-fallos es solo para una lista vacía.'},
      {text: 'router, porque los grupos reparables son mayoría.', correct: true, why: 'La mayoría reparable es la otra salida que habilita el router.'},
    ],
  },
  {
    question: 'Una corrección del auto-heal subió a la rama auto-heal/turnos-402, su suite falló y nadie vio correr un segundo auto-heal. Alguien pregunta por qué no corrió. ¿Dónde está la respuesta más rápida?',
    options: [
      {text: 'En los registros de la corrida del auto-heal de esa rama.', correct: false, why: 'No hay corrida: el auto-heal no se disparó, así que no dejó registros.'},
      {text: 'En la tabla consolidada: el auto-heal no dispara en las ramas auto-heal/.', correct: true, why: 'La tabla responde en un solo lugar cuándo corre cada automatización y cuándo no.'},
      {text: 'En el diagnóstico, porque seguro respondió «Posiblemente».', correct: false, why: 'No hubo diagnóstico: el workflow ignora esas ramas antes de llegar a ese gate.'},
    ],
  },
];

export const GATE_COLUMNS = ['skipped', 'error'];
export const GATE_ITEMS: ClassifyItem[] = [
  {code: 'El repositorio no tiene configuradas las credenciales del agente de reparación.', column: 0, why: 'Es una situación esperada: la integración no está activa en este repositorio.', hint: '¿Algo dejó de funcionar, o la automatización no está configurada?'},
  {code: 'El paso de análisis terminó sin dejar el archivo con el diagnóstico.', column: 1, why: 'Algo que tenía que producir una salida no la produjo: es un error.', hint: '¿Era esperable que no hubiera diagnóstico?'},
  {code: 'El diagnóstico dijo «No»: los fallos no los causó el Pull Request.', column: 0, why: 'La automatización decidió no actuar, por una razón esperada.', hint: '¿El sistema funcionó y decidió, o falló?'},
  {code: 'El texto del diagnóstico no se pudo interpretar como Sí, No ni Posiblemente.', column: 1, why: 'No es una absolución: no se sabe qué dijo el análisis, y hay que investigarlo.', hint: '¿Se sabe cuál fue la decisión?'},
  {code: 'Fallaron 46 tests, más que el tope de 10.', column: 0, why: 'Es una decisión esperada del gate de demasiados fallos.', hint: '¿Este caso estaba previsto en las reglas?'},
  {code: 'La suite falló, pero el resumen de resultados tiene cero fallos.', column: 1, why: 'Una corrida fallida sin fallos en el resumen indica que algo no se leyó bien.', hint: '¿Tiene sentido una corrida fallida sin fallos?'},
];

export const FN_TEMPLATE = `if (grupos.length {{a}} 0) {
  return { decision: 'sin-fallos', motivo: 'no se encontraron fallos' };
}
const convergen = new Set(grupos.map((g) => g.prSospechoso)).size === {{b}};
const mayoriaReparable = reparables.length > grupos.length / {{c}};

if (grupos.length > maxGrupos && {{d}}convergen && !mayoriaReparable) {
  return { decision: 'regresion-amplia', motivo: 'la mira una persona' };
}`;
export const FN_SLOTS: FillBlankSlot[] = [
  {id: 'a', answer: '==='},
  {id: 'b', answer: '1'},
  {id: 'c', answer: '2'},
  {id: 'd', answer: '!'},
];
export const FN_BANK = ['===', '>', '1', '0', '2', '3', '!', '&&'];
export const FN_EXPLANATION =
  'Una lista vacía devuelve sin-fallos; los grupos convergen si el conjunto de sospechosos tiene un solo elemento; la mayoría es más de la mitad; y se frena solo si además los grupos no convergen.';
