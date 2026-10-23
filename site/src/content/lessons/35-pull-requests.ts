import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';

export const PR_RULE_LABELS = [
  'Mezcla varios cambios sin relación entre sí',
  'Abre para revisión un PR que todavía no está listo (debía ser draft)',
  'Abre el PR sin descripción',
];

export const PR_LINES: CodeLine[] = [
  {
    code: 'Un PR titulado "ajustes" cambia el cálculo de envío y no tiene descripción; el diff toca cuatro archivos.',
    rule: 3,
    why: 'Quien revisa tiene que reconstruir desde el código qué se cambió y por qué. Un título y una descripción explican el motivo sin abrir cada archivo.',
    hint: '¿Quien revisa puede saber por qué cambió el cálculo sin abrir cada archivo?',
  },
  {
    code: 'Un PR de doce archivos agrega la misma feature en pantalla, servicio y tests, con una descripción de tres líneas.',
    rule: 0,
    why: 'Doce archivos pueden ser un PR enfocado si todos responden al mismo cambio: la feature y sus tests. Revisar una sola idea de punta a punta es manejable.',
    hint: '¿Estos doce archivos responden a un solo cambio, o a varios sin relación?',
  },
  {
    code: 'Un PR actualiza la versión de una librería y, en el mismo commit, cambia el texto del botón de login.',
    rule: 1,
    why: 'Son dos cambios sin relación: quien revisa no puede evaluar la actualización de la librería sin arrastrar el cambio de copy, y revertir uno obliga a tocar el otro.',
    hint: '¿Los dos cambios se pueden revisar o revertir por separado?',
  },
  {
    code: 'Alguien abre un PR como listo para revisión mientras todavía está escribiendo los tests que faltan.',
    rule: 2,
    why: 'Pedir revisión sobre algo incompleto hace que el equipo gaste tiempo en un diff que va a cambiar. Mientras faltan tests, corresponde draft.',
    hint: '¿Este PR está listo para que alguien invierta tiempo en revisarlo?',
  },
  {
    code: 'Un PR que corrige un solo bug incluye el test que lo reproduce y una descripción con los pasos para verificarlo.',
    rule: 0,
    why: 'Cambio, test y contexto en una sola unidad: quien revisa puede entender el problema y comprobar la solución sin adivinar.',
    hint: '¿Falta algo de lo que necesita quien revisa: enfoque, descripción o estar listo?',
  },
  {
    code: 'Un PR agrega dos validaciones al mismo formulario, en archivos distintos, con una descripción que explica ambas.',
    rule: 0,
    why: 'Las dos validaciones son el mismo cambio funcional sobre la misma pantalla: se pueden revisar juntas sin mezclar temas ajenos.',
    hint: '¿Las dos validaciones son el mismo cambio funcional, o temas sin relación?',
  },
  {
    code: 'Se abre como PR listo, para que el equipo vaya viendo el diff, un cambio que todavía no compila.',
    rule: 2,
    why: 'Un diff que no compila no se puede evaluar en serio y va a cambiar; abrirlo como draft deja claro que es un avance, no una versión para aprobar.',
    hint: '¿Qué tipo de PR corresponde cuando el trabajo todavía no está terminado?',
  },
];

export const PRACTICE_RULE_LABELS = [
  'Mergeó sin que nadie revisara',
  'No actualizó el PR con los últimos cambios de main antes de mergear',
  'Dejó comentarios de revisión sin resolver',
];

export const PRACTICE_LINES: CodeLine[] = [
  {
    code: 'Un PR tiene tres comentarios pidiendo cambios; el autor aplica uno y mergea igual.',
    rule: 3,
    why: 'Quedaron dos pedidos sin responder: la revisión no terminó. Mergear así da por resueltas dudas que nadie contestó, y el problema sigue.',
    hint: '¿Qué pasó con los otros dos pedidos?',
  },
  {
    code: 'El autor responde cada comentario, aplicando el cambio o explicando por qué no, y pide una nueva revisión.',
    rule: 0,
    why: 'Cierra el ciclo de revisión: cada observación tiene respuesta y el revisor sabe qué cambió antes de aprobar. Es exactamente lo que se espera.',
    hint: '¿Quedó algún comentario sin respuesta antes de mergear?',
  },
  {
    code: 'El autor mergea su PR el mismo día que lo abre, sin que nadie lo haya aprobado, porque los tests pasaron.',
    rule: 1,
    why: 'Los tests verifican comportamiento, no reemplazan a alguien que lea el cambio y detecte lo que falta cubrir. Sin revisión, el PR perdió su propósito.',
    hint: '¿Los tests reemplazan la mirada de alguien que no escribió el código?',
  },
  {
    code: 'Un PR recibe una aprobación y un comentario menor; el autor lo responde, el revisor está de acuerdo y se mergea.',
    rule: 0,
    why: 'La observación quedó resuelta y aceptada por quien la hizo: la aprobación sigue siendo válida. No hace falta reabrir el ciclo.',
    hint: '¿La observación quedó resuelta antes del merge?',
  },
  {
    code: 'Un PR lleva dos semanas abierto; main cambió en los mismos archivos y el autor mergea sin traer esos cambios ni revisar si hay conflicto.',
    rule: 2,
    why: 'Se está integrando sobre una base vieja: el conflicto aparece después del merge, en main, donde cuesta más deshacerlo. Actualizar el PR antes de mergear lo detecta a tiempo.',
    hint: '¿Sobre qué versión de main se está integrando este cambio?',
  },
  {
    code: 'El autor abre el PR como draft y lo marca listo recién cuando pasa la suite, y ahí pide revisión.',
    rule: 0,
    why: 'El draft separa el trabajo en curso de la versión que sí está lista para revisión: el equipo no gasta tiempo en algo que todavía cambia.',
    hint: '¿Se pidió revisión sobre algo todavía incompleto?',
  },
  {
    code: 'Ante un comentario con una duda, el autor mergea y contesta por privado que lo van a ver después.',
    rule: 3,
    why: 'La duda quedó fuera del PR y sin resolver antes del merge. Lo que se habla por privado no queda registrado para quien revise más adelante.',
    hint: '¿La duda quedó resuelta antes de que el cambio llegara a main?',
  },
];

export const CLOSING_QUIZ: QuizQuestion[] = [
  {
    question:
      'Un compañero abre un Pull Request con 18 archivos modificados: una feature nueva, dos correcciones sin relación y una actualización de dependencias. ¿Qué problema tiene, más allá del tamaño?',
    options: [
      {text: 'Ninguno: mientras los tests pasen, da igual cuántos archivos o temas distintos tenga el PR.', correct: false, why: 'Que los tests pasen no vuelve revisable un PR que mezcla temas: hay más superficie donde algo se puede escapar, y revertir un cambio obliga a deshacer los otros.'},
      {text: 'El problema es solo el número de archivos: con menos de diez estaría bien aunque mezcle una feature y dos fixes.', correct: false, why: 'Diez archivos de una misma feature son revisables; tres archivos con temas distintos no. El criterio es la relación entre los cambios, no el conteo.'},
      {text: 'Mezcla cambios sin relación: cuesta revisarlos a fondo y no se pueden revertir por separado.', correct: true, why: 'Un PR enfocado en una sola cosa se revisa más rápido y se revierte sin arrastrar cambios ajenos. El problema es el alcance, no solo el tamaño.'},
    ],
  },
  {
    question: '¿Qué es, exactamente, un Pull Request?',
    options: [
      {text: 'Un comando de Git que sube la rama directo al repositorio remoto.', correct: false, why: 'Eso es `git push`. El PR es un paso posterior, dentro de GitHub, y no existe como comando de Git.'},
      {text: 'El pedido, dentro de GitHub, de que el equipo revise los commits de tu rama antes de sumarlos a main.', correct: true, why: 'Es el mecanismo de revisión: muestra el diff completo para que el equipo comente, pida cambios o apruebe antes del merge.'},
      {text: 'Una copia del repositorio para probar cambios sin afectar el original.', correct: false, why: 'Eso describe un fork o un clon, no un PR. El PR no duplica el repositorio: propone integrar una rama existente.'},
    ],
  },
];
