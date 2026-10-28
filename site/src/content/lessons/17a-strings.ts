import type {MultiSelectQuestion} from '@site/src/components/MultiSelect';
import type {SpotTokenRound} from '@site/src/components/SpotToken';
import type {TerminalStep} from '@site/src/components/Terminal';
import type {BuilderStep} from '@site/src/components/CommandBuilder';

export const COUPON_STEPS: TerminalStep[] = [
  {
    instruction: "En la consola ya existe: const cupon = ' verano25 '. Mostralo sin los espacios de los costados.",
    accepted: ['cupon.trim()', 'cupon.trim();'],
    hint: 'Es el método que quita espacios al principio y al final.',
    output: "'verano25'",
  },
  {
    instruction: 'Ahora sin espacios y en mayúsculas, como lo guarda el sistema.',
    accepted: ['cupon.trim().toUpperCase()', 'cupon.trim().toUpperCase();', 'cupon.toUpperCase().trim()', 'cupon.toUpperCase().trim();'],
    hint: 'Encadená dos métodos: el del paso anterior y el que pasa todo a mayúsculas.',
    output: "'VERANO25'",
  },
  {
    instruction: 'Comprobá si el cupón normalizado empieza con VERANO.',
    accepted: ["cupon.trim().toUpperCase().startsWith('VERANO')", 'cupon.trim().toUpperCase().startsWith("VERANO")', "cupon.trim().toUpperCase().startsWith('VERANO');", 'cupon.trim().toUpperCase().startsWith("VERANO");'],
    hint: 'Sumá a la cadena del paso anterior el método que pregunta por el comienzo del texto, con el texto entre comillas.',
    output: 'true',
  },
  {
    instruction: 'Obtené los dos últimos caracteres del cupón sin espacios: el porcentaje de descuento.',
    accepted: ['cupon.trim().slice(-2)', 'cupon.trim().slice(-2);', 'cupon.trim().slice(6)', 'cupon.trim().slice(6);', 'cupon.trim().slice(6, 8)', 'cupon.trim().slice(6, 8);'],
    hint: 'slice acepta un índice negativo que cuenta desde el final. Ojo: sin trim, el último carácter es un espacio.',
    output: "'25'",
  },
];
export const COUPON_EXPLANATION =
  'Cada método devuelve un string nuevo y el siguiente trabaja sobre ese resultado. El `trim()` tiene que ir antes de `slice(-2)`: sin él, los dos últimos caracteres serían `\'5 \'`, porque el espacio final cuenta.';

export const SLICE_CODE = `const codigo = ' AR-0042 ';
console.log(codigo.trim().slice(3));`;
export const SLICE_ACCEPTED = ['0042', "'0042'", '"0042"'];
export const SLICE_HINTS = [
  'Resolvé de a un método, de izquierda a derecha: primero qué queda después de trim().',
  'Después de trim() queda AR-0042. Contá las posiciones desde 0: A es la 0, R la 1, el guion la 2.',
  'slice(3) va desde la posición 3 hasta el final, y el resultado sigue siendo un string: los ceros no se pierden.',
];
export const SLICE_EXPLANATION =
  '`trim()` deja `\'AR-0042\'`; `slice(3)` toma desde la posición 3 hasta el final: `\'0042\'`. Es un string, así que conserva los ceros a la izquierda; `42` sería el resultado de convertirlo con `Number(...)`.';

export const EMAIL_PREFIX = 'email';
export const EMAIL_STEPS: BuilderStep[] = [
  {options: ['.trim()', '.split()', '.slice(1)'], correct: '.trim()', hint: 'Lo primero es sacar lo que se pudo haber copiado de más a los costados.'},
  {options: ['.toUpperCase()', '.toLowerCase()', '.replace(\' \', \'\')'], correct: '.toLowerCase()', hint: 'El dominio que se compara está escrito en minúsculas.'},
  {options: [".includes('@empresa.com')", ".endsWith('@empresa.com')", ".startsWith('@empresa.com')"], correct: ".endsWith('@empresa.com')", hint: 'El dominio tiene que estar en un lugar concreto del email, no en cualquier parte.'},
];
export const EMAIL_EXPLANATION =
  "`email.trim().toLowerCase().endsWith('@empresa.com')` quita los espacios, ignora las mayúsculas y exige que el email termine con el dominio. Con `includes`, un email como `ana@empresa.com.falso.net` también pasaría.";

export const STRING_BUG_PROMPT = '¿Qué parte del código hace que no cumpla lo que dice el comentario?';
export const STRING_BUG_ROUNDS: SpotTokenRound[] = [
  {
    line: "const soloNumeros = dni.replace('.', '');   // quitar todos los puntos",
    targetIndex: 3,
    why: '`replace` reemplaza solo la primera aparición: con `\'30.111.222\'` quedaría `\'30111.222\'`. Para todas, `replaceAll`.',
    hint: '¿Cuántos puntos tiene un DNI escrito con separadores, y cuántos reemplaza este método?',
  },
  {
    line: "const saludo = 'Hola, ${nombre}';   // insertar el nombre en el saludo",
    targetIndex: 3,
    why: 'Con comillas simples, `${nombre}` queda como texto literal. Para insertar el valor hacen falta comillas invertidas.',
    hint: '¿Con qué comillas se arma un template string?',
  },
  {
    line: "if (email.trim().toUpperCase() === 'ana@mail.com') {   // comparar sin distinguir mayúsculas",
    targetIndex: 1,
    why: 'Pasar a mayúsculas y comparar contra un texto en minúsculas nunca da `true`. Hay que normalizar los dos lados igual: `toLowerCase()`.',
    hint: 'Después de normalizar, ¿cómo queda el email? ¿Puede ser igual al texto de la derecha?',
  },
  {
    line: "const extension = archivo.slice(-3, -1);   // las tres letras finales, como 'pdf'",
    targetIndex: 4,
    why: 'El fin de `slice` no se incluye: con `-1` se pierde la última letra y queda `\'pd\'`. Sin segundo argumento llega hasta el final: `slice(-3)`.',
    hint: '¿El índice de fin de slice se incluye en el resultado?',
  },
  {
    line: "const aviso = 'No se encontró 'reporte.pdf'';   // mostrar el nombre entre comillas",
    targetIndex: 6,
    why: 'La comilla simple antes de `reporte` cierra el string. Hay que escaparla (`\\\'`) o usar comillas dobles para delimitar el texto.',
    hint: '¿Dónde termina el string que empezó después del igual?',
  },
];

export const TEXT_CASES_QUESTIONS: MultiSelectQuestion[] = [
  {
    prompt: 'El buscador de socios de un club compara el apellido ingresado con el guardado, después de normalizar con `trim().toLowerCase()`. El apellido guardado es `\'gomez\'`. ¿Qué entradas aportan un caso de prueba distinto? Marcá todas las que correspondan.',
    options: [
      {text: '`gomez`, tal cual está guardado.', correct: true, why: 'Es el caso base: confirma que la búsqueda funciona sin ninguna transformación.'},
      {text: '`GOMEZ`', correct: true, why: 'Ejercita el `toLowerCase()`: tiene que encontrar al socio igual.'},
      {text: '`  gomez `, con espacios a los costados.', correct: true, why: 'Ejercita el `trim()`, que es justamente lo que esa entrada pone a prueba.'},
      {text: '`Gómez`, con tilde.', correct: true, why: 'Ni `trim` ni `toLowerCase` quitan la tilde, y `===` la distingue: revela si el buscador encuentra a alguien que escribe su apellido correctamente.'},
      {text: '`Gomez`, `GoMeZ` y `gOMEZ`, como tres casos.', correct: false, why: 'Las tres prueban lo mismo que `GOMEZ`: que `toLowerCase()` unifica las mayúsculas. Sumarlas no agrega información.'},
      {text: '`   `, solo espacios.', correct: true, why: 'Después de `trim()` queda vacío: muestra qué hace el buscador con una búsqueda sin contenido.'},
    ],
  },
];
