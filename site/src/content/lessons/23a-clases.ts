import type {MatchItem} from '@site/src/components/Match';
import type {FillBlankSlot} from '@site/src/components/FillBlank';
import type {DecisionNode} from '@site/src/components/DecisionPath';

export const QUEUE_TEMPLATE = `{{kw}} ListaDeEspera {
  private personas: string[] = [];

  {{ctor}}(readonly local: string) {}

  agregar(nombre: string): void {
    {{self}}.personas.push(nombre);
  }

  cantidad(): number {
    return this.personas.length;
  }
}

const espera = {{nuevo}} ListaDeEspera('Sucursal Centro');
espera.agregar('Rosa Díaz');`;
export const QUEUE_SLOTS: FillBlankSlot[] = [
  {id: 'kw', answer: 'class'},
  {id: 'ctor', answer: 'constructor'},
  {id: 'self', answer: 'this'},
  {id: 'nuevo', answer: 'new'},
];
export const QUEUE_BANK = ['interface', 'new', 'function', 'this', 'class', 'constructor', 'super', 'espera'];
export const QUEUE_EXPLANATION =
  '`class` declara el molde; `constructor` recibe el local y, por llevar `readonly`, lo convierte en propiedad; `this.personas` es la lista de esta instancia; y `new` crea el objeto ejecutando el constructor. `interface` no puede tener métodos con código, y `espera.personas` dentro de la clase solo funcionaría para esa instancia en particular.';

export const SCORE_CODE = `class Marcador {
  private puntos = 0;

  sumar(cantidad: number): void {
    this.puntos = this.puntos + cantidad;
  }

  total(): number {
    return this.puntos;
  }
}

const local = new Marcador();
const visitante = new Marcador();
local.sumar(3);
visitante.sumar(2);
local.sumar(1);
console.log(local.total(), visitante.total());`;
export const SCORE_ACCEPTED = ['4 2', '4, 2', '4,2'];
export const SCORE_HINTS = [
  'console.log con dos argumentos imprime los dos valores separados por un espacio. Calculá cada uno por separado.',
  'Cada new Marcador() crea un objeto con sus propios puntos, que empiezan en 0. ¿Qué llamadas recibió cada uno?',
  'local recibió sumar(3) y sumar(1); visitante, solo sumar(2).',
];
export const SCORE_EXPLANATION =
  'Cada instancia tiene su propia propiedad `puntos`: `local` acumula 3 + 1 = 4 y `visitante` tiene 2. Las llamadas sobre una instancia no afectan a la otra, aunque las dos usen los mismos métodos.';

export const DESIGN_START = 'actual';
export const DESIGN_NODES: Record<string, DecisionNode> = {
  actual: {
    id: 'actual',
    situation: 'Vas a escribir la clase `Turnero` de una sucursal bancaria: entrega números consecutivos. El número actual empieza en 0 y solo debería avanzar de a uno. ¿Cómo se declara?',
    options: [
      {text: '`actual = 0;` como propiedad pública.', correct: false, why: 'Cualquier parte del código podría hacer `turnero.actual = 500` y saltear números: nada garantiza que avance de a uno.'},
      {text: '`private actual = 0;` dentro de la clase.', correct: true, why: 'Solo los métodos de la clase pueden cambiarlo, así que la única forma de avanzar es la que la clase ofrezca.', next: 'sucursal'},
      {text: '`const actual = 0;` fuera de la clase, arriba del archivo.', correct: false, why: 'Una variable fuera de la clase no pertenece a ninguna instancia: todos los turneros compartirían el mismo número (y con `const` ni siquiera podría avanzar).'},
    ],
  },
  sucursal: {
    id: 'sucursal',
    situation: 'Cada turnero pertenece a una sucursal, que se indica al crearlo, se muestra en pantalla y no cambia nunca. ¿Cómo se declara?',
    options: [
      {text: '`constructor(readonly sucursal: string) {}`', correct: true, why: 'Se recibe al crear el objeto, queda como propiedad que se puede leer desde afuera, y `readonly` impide cambiarla después.', next: 'siguiente'},
      {text: '`constructor(private sucursal: string) {}`', correct: false, why: 'Con `private` no se podría leer desde afuera para mostrarla en pantalla.'},
      {text: '`sucursal = \'\';`, para asignarla después de crear el turnero.', correct: false, why: 'El turnero quedaría un momento sin sucursal, y cualquiera podría cambiarla más tarde.'},
    ],
  },
  siguiente: {
    id: 'siguiente',
    situation: 'Falta el método que avanza y devuelve el número a llamar. ¿Cuál es correcto?',
    options: [
      {text: '`siguiente(): number { actual = actual + 1; return actual; }`', correct: false, why: 'Sin `this`, `actual` no se refiere a la propiedad: TypeScript informa TS2663 y sugiere `this.actual`.'},
      {text: '`siguiente(): number { this.actual = this.actual + 1; return this.actual; }`', correct: true, why: '`this.actual` es el número de este turnero: lo avanza y lo devuelve.', next: 'prueba'},
      {text: '`function siguiente(): number { this.actual = this.actual + 1; return this.actual; }`', correct: false, why: 'Los métodos de una clase se declaran sin la palabra `function`; así es un error de sintaxis.'},
    ],
  },
  prueba: {
    id: 'prueba',
    situation: 'La clase está lista. Ya probaste que un turnero nuevo devuelve 1 en su primera llamada. ¿Qué caso aporta información que ese no da?',
    options: [
      {text: 'Crear otro turnero y comprobar que su primera llamada también devuelve 1.', correct: false, why: 'Es el mismo caso con otro objeto: no prueba nada nuevo sobre el estado.'},
      {text: 'Llamar a `siguiente()` en un turnero y comprobar que el resultado es un `number`.', correct: false, why: 'TypeScript ya garantiza el tipo de retorno: el caso no puede fallar.'},
      {text: 'Crear dos turneros, llamar tres veces al primero y una al segundo, y comprobar que devuelven 3 y 1.', correct: true, why: 'Prueba a la vez la secuencia (el número se acumula) y la independencia entre instancias (un turnero no afecta al otro).'},
    ],
  },
};
export const DESIGN_EXPLANATION =
  'El estado que solo debe cambiar por los métodos va `private`; lo que se fija al crear y no cambia, `readonly` en el constructor; cada método usa `this` para trabajar sobre su instancia; y la prueba que vale es la que ejercita secuencias e instancias separadas.';

export const CLASS_ERR_LEFT: MatchItem[] = [
  {id: 'new', text: "`const prestamo = Prestamo('LIB-201', 14);` → TS2348: Value of type 'typeof Prestamo' is not callable. Did you mean to include 'new'?"},
  {id: 'this', text: "En el método `renovar()`: `dias = dias + 7;` → TS2663: Cannot find name 'dias'. Did you mean the instance member 'this.dias'?"},
  {id: 'private', text: "`prestamo.multa = 0;` → TS2341: Property 'multa' is private and only accessible within class 'Prestamo'."},
  {id: 'readonly', text: "`prestamo.codigoLibro = 'LIB-999';` → TS2540: Cannot assign to 'codigoLibro' because it is a read-only property."},
  {id: 'super', text: "`class PrestamoDigital extends Prestamo` → TS2377: Constructors for derived classes must contain a 'super' call."},
];
export const CLASS_ERR_RIGHT: MatchItem[] = [
  {id: 'super', text: 'Llamar a `super(codigoLibro, dias)` al principio del constructor de la clase hija.'},
  {id: 'private', text: 'Usar el método de la clase que corresponda (por ejemplo, `pagarMulta()`) en lugar de tocar la propiedad desde afuera.'},
  {id: 'new', text: 'Crear la instancia con `new Prestamo(...)`.'},
  {id: 'readonly', text: 'No reasignarla: si el libro es otro, se crea un préstamo nuevo.'},
  {id: 'this', text: 'Escribir `this.dias = this.dias + 7;`.'},
];
export const CLASS_ERR_WHY: Record<string, string> = {
  new: 'Una clase no se llama como una función: `new` crea la instancia y ejecuta el constructor.',
  this: 'Dentro de un método, las propiedades de la instancia se leen y se escriben con `this`.',
  private: '`private` existe justamente para que la multa solo cambie a través de los métodos de la clase, que son los que validan.',
  readonly: '`readonly` se asigna una sola vez, en el constructor: el préstamo de un libro no se convierte en el préstamo de otro.',
  super: 'Una clase que hereda tiene que ejecutar primero el constructor de la clase original, con `super(...)`, antes de usar `this`.',
};
