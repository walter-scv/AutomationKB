import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';
import type {DecisionNode} from '@site/src/components/DecisionPath';
import type {OrderItem} from '@site/src/components/Order';
import type {OrderRule} from '@site/src/components/Order';

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

export const CONFLICT_START = 'aparece';
export const CONFLICT_NODES: Record<string, DecisionNode> = {
  aparece: {
    id: 'aparece',
    situation: 'Traés `main` a tu rama `feature/envio-gratis` y Git marca un conflicto en `envio.ts`. ¿Qué hacés?',
    options: [
      {
        text: 'Dejar la rama sin mergear un par de semanas, hasta que `main` se calme.',
        correct: false,
        why: 'Postergar por miedo solo agranda el problema: en dos semanas `main` va a tener más cambios y el conflicto va a ser más grande.',
      },
      {
        text: 'Abrir `envio.ts` y leer las dos versiones en conflicto antes de decidir nada.',
        correct: true,
        why: 'Un conflicto es una decisión pendiente: para tomarla hay que entender qué hace cada versión.',
        next: 'combinar',
      },
      {
        text: 'Cancelar el merge y volver a crear la rama desde cero.',
        correct: false,
        why: 'Volver a empezar no hace desaparecer el conflicto: las mismas líneas siguen cambiadas en `main`, y el trabajo de la rama se pierde.',
      },
    ],
  },
  combinar: {
    id: 'combinar',
    situation: 'En `main`, alguien subió el umbral de envío pesado de 10 a 12 kg; en tu rama, agregaste envío gratis para compras desde $5000. Los dos cambios tocan la misma línea. ¿Cómo lo resolvés?',
    options: [
      {
        text: 'Quedarte con tu versión ("Accept Current Change"): sos quien está trabajando en el envío.',
        correct: false,
        why: 'Elegir una versión sin considerar la otra borra el cambio del umbral a 12 kg, que también es necesario.',
      },
      {
        text: 'Quedarte con la de `main` ("Accept Incoming Change"): lo que ya está integrado manda.',
        correct: false,
        why: 'Eso borra tu envío gratis desde $5000, que es justamente el objetivo de la rama.',
      },
      {
        text: 'Editar la línea a mano para que tenga los dos cambios: umbral de 12 kg y envío gratis desde $5000.',
        correct: true,
        why: 'Los dos cambios son válidos y no se contradicen: la resolución correcta los combina.',
        next: 'probar',
      },
    ],
  },
  probar: {
    id: 'probar',
    situation: 'El archivo ya no tiene marcas de conflicto y compila. Los tests habían pasado en verde antes del merge. ¿Qué hacés antes de confirmar?',
    options: [
      {
        text: 'Correr los tests de nuevo y probar el cálculo de envío con los dos cambios juntos.',
        correct: true,
        why: 'La combinación a mano es código nuevo que ningún test probó todavía: hay que volver a probar.',
      },
      {
        text: 'Confirmar directamente: los tests ya habían pasado antes del conflicto.',
        correct: false,
        why: 'Esos tests probaron cada versión por separado, no la combinación que acabás de escribir a mano.',
      },
      {
        text: 'Confirmar y avisar al equipo que pruebe el envío si tiene tiempo.',
        correct: false,
        why: 'Delegar la prueba "si hay tiempo" deja sin verificar justo la línea que se tocó a mano.',
      },
    ],
  },
};
export const CONFLICT_EXPLANATION =
  'Un conflicto se resuelve en el momento, leyendo las dos versiones, combinándolas cuando las dos son válidas y volviendo a probar antes de confirmar: la línea resuelta a mano es código nuevo.';

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

export const MERGE_ORDER_ITEMS: OrderItem[] = [
  {id: 'add', what: 'Paso', code: 'git add carrito.ts'},
  {id: 'merge', what: 'Paso', code: 'git merge fix/total-con-envio'},
  {id: 'push', what: 'Paso', code: 'git push'},
  {id: 'checkout', what: 'Paso', code: 'git checkout main'},
  {id: 'resolve', what: 'Paso', code: '// resolver el conflicto en carrito.ts y volver a correr los tests'},
  {id: 'commit', what: 'Paso', code: 'git commit'},
  {id: 'pull', what: 'Paso', code: 'git pull'},
];
export const MERGE_ORDER_CORRECT = ['checkout', 'pull', 'merge', 'resolve', 'add', 'commit', 'push'];
export const MERGE_ORDER_RULES: OrderRule[] = [
  {before: 'checkout', after: 'pull', why: '`git pull` actualiza la rama en la que estás parado: primero hay que estar en `main`.'},
  {before: 'pull', after: 'merge', why: 'la rama se integra sobre el `main` más reciente, no sobre uno desactualizado.'},
  {before: 'merge', after: 'resolve', why: 'el conflicto aparece recién al mergear.'},
  {before: 'resolve', after: 'add', why: 'el archivo se marca como resuelto después de resolverlo y probarlo, no antes.'},
  {before: 'add', after: 'commit', why: 'el commit confirma lo que está en staging, incluido el archivo resuelto.'},
  {before: 'commit', after: 'push', why: 'se sube el merge ya confirmado: sin commit, no hay nada nuevo que compartir.'},
];
