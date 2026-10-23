import type {QuizQuestion} from '@site/src/components/Quiz';
import type {OrderItem, OrderRule} from '@site/src/components/Order';
import type {CodeLine} from '@site/src/components/FindInCode';

export const FLOW_ORDER_ITEMS: OrderItem[] = [
  {id: 'commit', what: 'Paso', code: 'git commit -m "Agregar validación de longitud de contraseña"'},
  {id: 'edit', what: 'Paso', code: 'export function validarLongitud(valor: string): boolean {\n  return valor.length >= 8;\n}'},
  {id: 'stage', what: 'Paso', code: 'git add validarContraseña.ts'},
];

export const FLOW_ORDER_CORRECT = ['edit', 'stage', 'commit'];

export const FLOW_ORDER_RULES: OrderRule[] = [
  {before: 'edit', after: 'stage', why: 'el archivo tiene que existir con el cambio hecho antes de que `git add` pueda ponerlo en el staging area.'},
  {before: 'stage', after: 'commit', why: '`git commit` confirma lo que está en el staging area; si el archivo no se agregó antes, no entra en el commit.'},
];

export const AREA_RULE_LABELS = [
  'Cree que el staging area ya es un respaldo permanente',
  'Confirma sin revisar qué está incluyendo',
  'Dejó cambios sin agregar ni confirmar por mucho tiempo',
  'Confunde guardar el archivo con confirmarlo',
];

export const AREA_LINES: CodeLine[] = [
  {
    code: 'Guardás el archivo en el editor, corrés `git status` y el cambio aparece como modificado, todavía sin agregar.',
    rule: 0,
    why: 'Es el comportamiento esperado: guardar deja el cambio en el working directory. `git status` lo muestra ahí justamente para que decidas si lo agregás.',
    hint: '¿Guardar en el editor ya mueve el cambio al staging area?',
  },
  {
    code: 'Apretás Ctrl+S, cerrás la laptop y le decís al equipo que el cambio ya quedó confirmado en el historial.',
    rule: 4,
    why: 'Guardar solo escribe el archivo en el working directory. Sin `git add` y `git commit`, el cambio no está ni en staging ni en el historial.',
    hint: '¿Qué falta entre guardar el archivo y que el cambio quede en el historial?',
  },
  {
    code: 'Un cambio quedó sin confirmar desde el lunes; el viernes ya tiene encima tres arreglos más y nadie recuerda cuál era el original.',
    rule: 3,
    why: 'Cuantos más días y cambios se acumulan encima, más difícil es separar qué pertenece a cada cosa. Confirmar seguido evita esa mezcla.',
    hint: '¿Cuántos cambios distintos se apilaron sobre este sin confirmar?',
  },
  {
    code: 'Después de `git add`, alguien dice que los cambios ya están respaldados por si se rompe la laptop.',
    rule: 1,
    why: 'El staging area es una selección temporal de lo que va al próximo commit. Hasta que no se confirma, no hay una foto guardada en el historial.',
    hint: '¿Qué comando convierte esa selección en algo guardado en el historial?',
  },
  {
    code: 'Antes de confirmar, corrés `git status` y ves dos archivos en staging y uno modificado sin agregar; confirmás solo los dos primeros.',
    rule: 0,
    why: 'Elegir qué entra es exactamente para lo que sirve el staging area. Los dos archivos seleccionados forman el commit; el tercero queda para después.',
    hint: '¿El commit tiene que incluir todo lo modificado, o solo lo que está en staging?',
  },
  {
    code: 'Guardás el archivo con Ctrl+S: `git status` lo muestra como modificado y recién después de `git add` pasa al staging area.',
    rule: 0,
    why: 'Es la secuencia correcta: guardar escribe en el working directory, `git add` selecciona el cambio para el próximo commit y `git commit` lo confirma. Cada paso mueve el cambio a una etapa distinta.',
    hint: '¿Este orden salta algún paso del flujo working directory → staging → commit?',
  },
  {
    code: 'Se corre `git add .` y `git commit -m "avances"` sin abrir `git status`; entra también un `debug.log` local.',
    rule: 2,
    why: 'Sin revisar qué se estaba agregando, un archivo que no correspondía entra al commit. `git status` antes del add muestra exactamente qué iba a incluirse.',
    hint: '¿Se miró qué archivos estaban entrando antes de confirmar?',
  },
  {
    code: 'Un commit incluye solo los dos archivos que estaban en staging; el tercero sigue modificado para el próximo commit.',
    rule: 0,
    why: 'El commit toma exactamente lo que estaba en staging en ese momento. Lo que quedó sin agregar no se pierde: sigue en el working directory.',
    hint: '¿El archivo que quedó sin agregar se pierde, o sigue disponible para después?',
  },
];

export const CLOSING_QUIZ: QuizQuestion[] = [
  {
    question: 'Un commit que hiciste hace un mes ya no aparece en `git log`. Nadie corrió `rebase`, `reset` ni `amend`. ¿Qué explicación es más plausible?',
    options: [
      {text: 'Que Git borra los commits de más de 30 días para ahorrar espacio.', correct: false, why: 'Git conserva el historial completo salvo que alguien lo reescriba a propósito; no hay una limpieza automática por fecha.'},
      {text: 'Que estés mirando otra rama o con un filtro: un commit no desaparece solo del historial.', correct: true, why: 'Git no elimina commits por antigüedad. Si no aparece, es más probable que estés en otra rama o filtrando la salida; un merge normal no lo borra.'},
      {text: 'Que la rama se borró después del merge y eso eliminó también sus commits.', correct: false, why: 'Borrar una rama solo mueve una referencia: los commits siguen en el historial y se pueden recuperar. No desaparecen por borrar la rama.'},
    ],
  },
];
