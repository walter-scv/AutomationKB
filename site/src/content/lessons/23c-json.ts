import type {ClassifyItem} from '@site/src/components/Classify';
import type {SpotTokenRound} from '@site/src/components/SpotToken';
import type {MultiSelectQuestion} from '@site/src/components/MultiSelect';

export const JSON_TOKEN_PROMPT = '¿Qué parte de esta línea hace que el JSON sea inválido?';
export const JSON_TOKEN_ROUNDS: SpotTokenRound[] = [
  {
    line: '{ "nombre": "Luis Paz", "activo": True }',
    targetIndex: 5,
    why: 'En JSON los booleanos se escriben en minúscula: `true`. `True` no es ningún valor válido.',
    hint: 'Revisá cómo se escribe cada valor, no solo las comillas.',
  },
  {
    line: '{ "sucursal": 14, \'estado\': "abierta" }',
    targetIndex: 3,
    why: 'Los nombres de propiedad van siempre entre comillas dobles; las simples no son válidas en JSON.',
    hint: 'Compará cómo están escritos los dos nombres de propiedad.',
  },
  {
    line: '{ "dias": ["lunes", "martes", "jueves",] }',
    targetIndex: 4,
    why: 'Después del último elemento de un array no puede haber coma.',
    hint: 'Fijate qué hay justo antes de que se cierre el array.',
  },
  {
    line: '{ "id": 88, "observaciones": undefined }',
    targetIndex: 4,
    why: '`undefined` no existe en JSON. Un valor ausente se representa con `null` o directamente omitiendo la propiedad.',
    hint: '¿Todos los valores de la línea están entre los seis tipos que admite JSON?',
  },
];

export const PATH_CODE = `const texto = \`{
  "reserva": 5521,
  "huespedes": [
    { "nombre": "Inés Vega", "documento": { "tipo": "DNI", "numero": "30111222" } },
    { "nombre": "Tomás Vega", "documento": { "tipo": "pasaporte", "numero": "AB998877" } }
  ]
}\`;
const datos = JSON.parse(texto);`;
export const PATH_ACCEPTED = [
  'datos.huespedes[1].documento.tipo',
  'datos.huespedes[1].documento.tipo;',
  "datos['huespedes'][1]['documento']['tipo']",
  'datos["huespedes"][1]["documento"]["tipo"]',
];
export const PATH_HINTS = [
  'Empezá por `datos` y entrá de a un nivel: primero la propiedad que tiene la lista de huéspedes.',
  'Tomás es el segundo huésped del array, y los índices empiezan en 0.',
  'Dentro de ese huésped, entrá al objeto `documento` y después a la propiedad que dice qué documento es.',
];
export const PATH_EXPLANATION =
  '`datos.huespedes[1].documento.tipo` entra a la propiedad `huespedes` (un array), toma el segundo elemento con `[1]`, entra a su objeto `documento` y lee `tipo`: `\'pasaporte\'`.';

export const STRINGIFY_QUESTIONS: MultiSelectQuestion[] = [
  {
    prompt: 'Antes de enviarlo a la API, el formulario de alta convierte este objeto con `JSON.stringify(alta)`: `{ email: \'ivega@mail.com\', telefono: undefined, newsletter: false, referido: null, nacimiento: new Date(Date.UTC(1991, 2, 14)), validar() { ... } }`. ¿Qué propiedades aparecen en el texto que se envía? Marcá todas las que estén.',
    options: [
      {text: '`email`', correct: true, why: 'Es un string: se conserva tal cual.'},
      {text: '`telefono`', correct: false, why: 'Vale `undefined`, y las propiedades con `undefined` desaparecen del texto: la API no recibe el campo.'},
      {text: '`newsletter`', correct: true, why: '`false` es un valor válido en JSON; no se descarta por ser "falso".'},
      {text: '`referido`', correct: true, why: '`null` existe en JSON: el campo llega, presente y sin valor.'},
      {text: '`nacimiento`', correct: true, why: 'Una fecha se convierte en un string con formato ISO, como `"1991-03-14T00:00:00.000Z"`.'},
      {text: '`validar`', correct: false, why: 'Es una función: las funciones no son datos y `stringify` las omite.'},
    ],
  },
];

export const CONTRACT_CODE = `// Respuesta de GET /socios/{id}
interface Socio {
  id: number;
  nombre: string;
  email: string;
  // null si no cargó teléfono
  telefono: string | null;
  // [] si no debe ninguna cuota
  cuotasAdeudadas: number[];
}`;
export const CONTRACT_COLUMNS = ['Cumple', 'Tipo incorrecto', 'Falta un campo'];
export const CONTRACT_ITEMS: ClassifyItem[] = [
  {code: '{ "id": 2201, "nombre": "Raúl Ortiz", "email": "rortiz@mail.com", "telefono": null, "cuotasAdeudadas": [] }', column: 0, why: 'Todos los campos están y con su tipo: `telefono` en `null` y `cuotasAdeudadas` vacío son exactamente lo que dice la interface para quien no cargó teléfono ni debe cuotas.'},
  {code: '{ "id": "2201", "nombre": "Raúl Ortiz", "email": "rortiz@mail.com", "telefono": null, "cuotasAdeudadas": [] }', column: 1, why: '`"2201"` entre comillas es un string, y la interface pide un número. `JSON.parse` no lo detecta: el error aparecería más adelante.', hint: 'Mirá las comillas de cada valor.'},
  {code: '{ "id": 2202, "nombre": "Eva Luna", "telefono": "341 555-0110", "cuotasAdeudadas": [3, 4] }', column: 2, why: 'No está la propiedad `email`, que es obligatoria.', hint: 'Contá las propiedades y compará con la interface.'},
  {code: '{ "id": 2203, "nombre": "Tito Sosa", "email": "tsosa@mail.com", "telefono": null, "cuotasAdeudadas": null }', column: 1, why: 'La interface pide un array (vacío si no debe nada); `null` es otro tipo, y el código que haga `cuotasAdeudadas.length` va a fallar.', hint: '¿Qué tipo pide la interface para las cuotas, y qué valor usa cuando no hay ninguna?'},
  {code: '{ "id": 2204, "nombre": "Ana Ruiz", "email": "aruiz@mail.com", "cuotasAdeudadas": [] }', column: 2, why: 'Falta `telefono`. La interface dice que, si no lo cargó, viene en `null`: un campo ausente no es lo mismo que un campo con `null`.', hint: '¿Un dato que no se cargó tiene que faltar, o venir con algún valor?'},
  {code: '{ "id": 2205, "nombre": "Luz Paz", "email": "lpaz@mail.com", "telefono": "11 5555-0123", "cuotasAdeudadas": [7] }', column: 0, why: 'Todos los campos, con sus tipos: el teléfono es un string y las cuotas, un array con un número.'},
  {code: '{ "id": 2206, "nombre": "Juan Gil", "email": "jgil@mail.com", "telefono": null, "cuotasAdeudadas": ["5"] }', column: 1, why: 'El array tiene un string (`"5"`) donde la interface pide números.', hint: 'Revisá también lo que hay adentro del array.'},
];
