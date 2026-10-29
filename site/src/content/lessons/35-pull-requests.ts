import type {OrderRule} from '@site/src/components/Order';
import type {OrderItem} from '@site/src/components/Order';
import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';
import type {BuilderStep} from '@site/src/components/CommandBuilder';

export const PR_BUILD_PREFIX = 'Pull Request: fix/redondeo-cupon → main';
export const PR_BUILD_STEPS: BuilderStep[] = [
  {
    options: [
      '\nTítulo: Ajustes',
      '\nTítulo: Corregir el redondeo del total cuando se aplica un cupón',
      '\nTítulo: Redondeo del cupón, README actualizado y nueva versión de la librería de fechas',
    ],
    correct: '\nTítulo: Corregir el redondeo del total cuando se aplica un cupón',
    hint: '¿El título deja claro qué cambia, y es un solo cambio que se pueda revisar y revertir por su cuenta?',
  },
  {
    options: [
      '\nDescripción: El total redondeaba dos veces con cupón (pedido de $1000 con 15% daba $849). Se corrige en calcularTotal y se agrega un test. Para verificar: aplicar VERANO15 a un pedido de $1000; el total debe ser $850.',
      '\nDescripción: (vacía; el diff ya muestra todo)',
      '\nDescripción: Ver los commits.',
    ],
    correct: '\nDescripción: El total redondeaba dos veces con cupón (pedido de $1000 con 15% daba $849). Se corrige en calcularTotal y se agrega un test. Para verificar: aplicar VERANO15 a un pedido de $1000; el total debe ser $850.',
    hint: '¿Quien revisa sabe, sin preguntarte, qué problema se resolvió y cómo comprobarlo?',
  },
  {
    options: [
      '\nEstado: listo para revisión, aunque todavía falta terminar el test.',
      '\nEstado: draft mientras falta el test; se marca listo y se pide revisión cuando pasa la suite.',
      '\nEstado: listo para revisión y mergeado apenas pasan los tests, sin esperar aprobación.',
    ],
    correct: '\nEstado: draft mientras falta el test; se marca listo y se pide revisión cuando pasa la suite.',
    hint: '¿Tiene sentido pedirle a alguien que revise algo que todavía no está terminado? ¿Y mergear sin que nadie lo revise?',
  },
];
export const PR_BUILD_EXPLANATION =
  'Un buen PR tiene un solo cambio con un título que lo dice, una descripción con el problema, la solución y cómo verificarla, y se abre como draft hasta que está listo: recién ahí se pide revisión, y se mergea con aprobación.';

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

export const PR_LIFE_ITEMS: OrderItem[] = [
  {id: 'merge', what: 'Paso', code: 'Con la aprobación y las verificaciones en verde, integrar con «Squash and merge».'},
  {id: 'ready', what: 'Paso', code: 'Terminadas las pruebas, marcar el PR como «Ready for review».'},
  {id: 'fix', what: 'Paso', code: 'Subir un commit con las correcciones a la misma rama y marcar cada conversación como resuelta.'},
  {id: 'clean', what: 'Paso', code: 'git switch main, git pull y git branch -d fix/recargo-cuotas.'},
  {id: 'draft', what: 'Paso', code: 'Abrir el PR como draft para mostrar el avance, con las pruebas todavía pendientes.'},
  {id: 'update', what: 'Paso', code: 'Con el PR ya aprobado, GitHub avisa que main cambió en los mismos archivos: git merge origin/main, resolver, probar y git push.'},
  {id: 'changes', what: 'Paso', code: 'La revisora deja «Request changes» con dos comentarios.'},
  {id: 'approve', what: 'Paso', code: 'La revisora revisa las correcciones y deja «Approve».'},
];
export const PR_LIFE_CORRECT = ['draft', 'ready', 'changes', 'fix', 'approve', 'update', 'merge', 'clean'];
export const PR_LIFE_RULES: OrderRule[] = [
  {before: 'draft', after: 'ready', why: 'un PR se marca como listo después de haberse abierto como borrador.'},
  {before: 'ready', after: 'changes', why: 'la revisión se pide recién cuando el PR está listo.'},
  {before: 'changes', after: 'fix', why: 'las correcciones responden a los comentarios de la revisión.'},
  {before: 'fix', after: 'approve', why: 'la aprobación llega después de revisar las correcciones.'},
  {before: 'approve', after: 'update', why: 'el aviso de conflictos llega cuando el PR ya estaba aprobado.'},
  {before: 'update', after: 'merge', why: 'una rama con conflictos con main no se puede integrar: primero se actualiza.'},
  {before: 'approve', after: 'merge', why: 'sin aprobación, la protección de main no deja integrar.'},
  {before: 'merge', after: 'clean', why: 'la rama local se borra cuando su trabajo ya está en main.'},
];
