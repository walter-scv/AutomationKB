import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';

export const MERGE_RULE_LABELS = [
  'Trae los cambios de main recién al final',
  'La rama lleva demasiado tiempo sin integrarse',
  'Mergea un cambio grande sin avisar al equipo',
];

export const MERGE_LINES: CodeLine[] = [
  {
    code: 'Se mergea a main una migración de base de datos que toca doce archivos, sin avisar al equipo hasta que el merge ya está hecho.',
    rule: 3,
    why: 'Doce archivos de esquema cambian la base sobre la que todos trabajan. Avisar antes permite que nadie tenga a mano un cambio incompatible en curso; el problema no es el tamaño en sí, sino que nadie pudo prepararse.',
    hint: '¿Alguien del equipo sabía que la base iba a cambiar hoy?',
  },
  {
    code: 'Un fix de dos líneas vive en su rama tres días y se mergea recién cuando el bug está verificado en un entorno de pruebas.',
    rule: 0,
    why: 'Tres días para un fix chico es justamente el ritmo que evita conflictos grandes, y además se verifica antes de integrar. No hay nada para objetar.',
    hint: '¿Tres días para un cambio chico, verificado antes de integrar, es un ritmo riesgoso?',
  },
  {
    code: 'La rama del rediseño del panel está abierta desde marzo; el equipo siguió sumando commits a main y nadie la tocó desde entonces.',
    rule: 2,
    why: 'Desde marzo main cambió sin que la rama se enterara: al integrar, Git tiene que reconciliar meses de cambios de los dos lados. Cuanto más se estira, más caro sale el conflicto.',
    hint: '¿Cuántos commits de main entraron desde que esta rama se separó?',
  },
  {
    code: 'Una rama que ya lleva dos semanas trae los cambios de main cada mañana, aunque eso le agregue un commit de merge por día.',
    rule: 0,
    why: 'Traer main seguido hace que los conflictos aparezcan chicos y de a uno. Los commits de merge diarios son el costo visible de esa costumbre, no un problema de higiene.',
    hint: '¿Traer main seguido agranda o achica los conflictos futuros?',
  },
  {
    code: 'Para no ensuciar la rama con merges intermedios, se evita traer main hasta el día de la integración final; para entonces main acumuló cuarenta commits.',
    rule: 1,
    why: 'Cuarenta commits de diferencia se resuelven de una sola vez, en un conflicto grande. Traerlos de a poco habría repartido ese trabajo en conflictos chicos.',
    hint: '¿Cuántos cambios de main se juntan de golpe en esa integración final?',
  },
  {
    code: 'Antes de mergear un cambio que toca el módulo de pagos, el autor avisa en el canal del equipo que lo va a integrar esa tarde.',
    rule: 0,
    why: 'Avisar antes le da al resto la chance de terminar o resguardar lo que tenga sobre esos archivos. Es justo lo que faltó en el caso de la migración de base de datos.',
    hint: '¿El equipo tuvo chance de prepararse antes de este merge?',
  },
  {
    code: 'El equipo decide no mergear feature/reportes hasta después del lanzamiento, para no arriesgar conflictos en la semana del release; la rama ya lleva seis semanas.',
    rule: 2,
    why: 'La intención de proteger el release es razonable, pero el efecto es seis semanas más de divergencia. Integrar en partes antes del congelamiento reduce el conflicto futuro en vez de acumularlo.',
    hint: '¿Qué pasa con la distancia entre esa rama y main mientras espera?',
  },
];

export const PRACTICE_RULE_LABELS = [
  'Resuelve el conflicto eligiendo una versión sin leer la otra',
  'Posterga el merge por miedo, en vez de integrar en partes',
  'No vuelve a probar después de resolver el conflicto a mano',
];

export const PRACTICE_LINES: CodeLine[] = [
  {
    code: 'El conflicto en `validarPedido.ts` se resolvió combinando las dos versiones a mano; como los tests automáticos ya habían pasado en verde antes del conflicto, se confirma el merge sin volver a correrlos.',
    rule: 3,
    why: 'Ese resultado verde es de antes de la combinación manual: no dice nada sobre el código que quedó después. Es justo el caso donde una mezcla introduce un error que ningún conflicto marca.',
    hint: '¿Ese resultado verde corresponde al código que quedó después de combinar las dos versiones?',
  },
  {
    code: 'En un conflicto de tres bloques, se resuelve cada bloque por separado, se corre la suite completa y recién ahí se confirma el merge.',
    rule: 0,
    why: 'Se combinó entendiendo parte por parte y se verificó el resultado antes de cerrar: cubre las dos precauciones importantes.',
    hint: '¿Se entendió cada bloque y se verificó el resultado antes de confirmar?',
  },
  {
    code: 'Ante el primer conflicto, la rama de `feature/exportar` se queda sin mergear dos semanas más, "hasta que main se calme".',
    rule: 2,
    why: 'main no se va a calmar: sigue recibiendo commits. Esperar agranda el conflicto que se quería evitar, en vez de resolverlo ahora que es chico.',
    hint: '¿Qué hace main mientras la rama espera?',
  },
  {
    code: 'Se mergea `fix/typo` el mismo día, con un solo commit que otra persona revisó antes.',
    rule: 0,
    why: 'Rama corta, cambio revisado y merge inmediato: el conflicto no tiene tiempo de crecer.',
    hint: '¿Este conflicto tuvo tiempo de crecer?',
  },
  {
    code: 'Ante un conflicto en `carrito.ts`, se elige "Accept Current Change" en los cuatro bloques porque el autor es quien más conoce ese archivo.',
    rule: 1,
    why: 'Conocer el archivo no equivale a saber qué agregó la otra rama: alguno de esos bloques podía traer un cambio necesario. Elegir en bloque sin mirar el otro lado es lo que hay que evitar.',
    hint: '¿Qué cambio de la otra rama pudo quedar afuera de esa elección?',
  },
  {
    code: 'Un conflicto en la configuración se resuelve combinando ambas listas de valores y verificando que la app levante antes de commitear.',
    rule: 0,
    why: 'Se conservó lo de los dos lados y se comprobó el resultado: la combinación no quedó librada a la suerte.',
    hint: '¿Se descartó alguna versión sin mirarla, o se combinaron ambas?',
  },
  {
    code: 'Se resuelve un conflicto borrando la versión de la otra rama y dejando solo la propia, sin abrir el historial para ver qué agregaba.',
    rule: 1,
    why: 'Descartar una versión sin leerla puede borrar trabajo real de otra persona; el conflicto se resuelve comparando, no eligiendo por descarte.',
    hint: '¿Se revisó qué aportaba la versión que se borró?',
  },
];

export const CLOSING_QUIZ: QuizQuestion[] = [
  {
    question:
      'Un compañero dice que su Pull Request "está roto" porque GitHub marca un conflicto de merge. ¿Qué le pasó en realidad?',
    options: [
      {text: 'GitHub no pudo decidir entre dos versiones de las mismas líneas; alguien tiene que elegir o combinar a mano.', correct: true, why: 'Eso es un conflicto: una decisión pendiente sobre dos cambios que se pisan, no un defecto del código. Se resuelve editando el archivo y confirmando el merge.'},
      {text: 'La rama quedó mal creada y hay que descartarla, porque un conflicto no se puede resolver sin empezar de nuevo.', correct: false, why: 'La rama y sus commits están intactos: el conflicto se resuelve en los archivos marcados y el trabajo sigue. Descartarla sería perder cambios que no tienen ningún problema.'},
      {text: 'Falta subir la rama al remoto: el conflicto desaparece apenas se hace push.', correct: false, why: 'El push no toca el conflicto; incluso puede ser rechazado por la misma razón. Lo que falta es integrar los cambios y resolver las líneas marcadas.'},
    ],
  },
];
