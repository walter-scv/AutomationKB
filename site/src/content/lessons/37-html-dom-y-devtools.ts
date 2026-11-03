import type {MatchItem} from '@site/src/components/Match';
import type {SpotTokenRound} from '@site/src/components/SpotToken';
import type {FillBlankSlot} from '@site/src/components/FillBlank';
import type {MultiSelectQuestion} from '@site/src/components/MultiSelect';
import type {QuizQuestion} from '@site/src/components/Quiz';

export const ROLE_LEFT: MatchItem[] = [
  {id: 'link', text: '`<a href="/turnos">Mis turnos</a>`'},
  {id: 'select', text: '`<label for="esp">Especialidad</label>` y `<select id="esp">`'},
  {id: 'noname', text: '`<input type="text" id="os">` con `<span>Obra social</span>` al lado'},
  {id: 'div', text: '`<div class="btn" onclick="cancelar()">Cancelar</div>`'},
  {id: 'close', text: '`<button aria-label="Semana siguiente">›</button>`'},
  {id: 'search', text: '`<input type="search" placeholder="Buscar profesional">`'},
  {id: 'radio', text: '`<input type="checkbox" id="sms">` y `<label for="sms">Aviso por SMS</label>`'},
];
export const ROLE_RIGHT: MatchItem[] = [
  {id: 'close', text: '`button "Semana siguiente"`'},
  {id: 'noname', text: '`textbox`, sin nombre'},
  {id: 'radio', text: '`checkbox "Aviso por SMS"`'},
  {id: 'search', text: '`searchbox "Buscar profesional"`'},
  {id: 'div', text: '`text: Cancelar`'},
  {id: 'link', text: '`link "Mis turnos"`'},
  {id: 'select', text: '`combobox "Especialidad"`'},
];
export const ROLE_WHY: Record<string, string> = {
  link: 'Un `<a>` con `href` es un `link`, y su contenido le da el nombre.',
  select: 'Un `<select>` es un `combobox`, y el `<label for="esp">` asociado a su `id` le da el nombre «Especialidad».',
  noname: 'El `<span>` está al lado pero no asociado al campo: el `textbox` queda sin nombre.',
  div: 'Un `<div>` no tiene rol propio aunque responda a un click: en el árbol figura como texto suelto, no como `button`.',
  close: 'Es un `button`, y `aria-label` le da el nombre «Semana siguiente» en lugar de «›».',
  search: 'Un `<input type="search">` es un `searchbox`. Sin label ni `aria-label`, el placeholder es el nombre.',
  radio: 'Un `<input type="checkbox">` es un `checkbox`, y el label asociado por `for` e `id` le da el nombre.',
};

export const NAME_PROMPT = '¿Qué parte de esta línea le da al elemento su nombre accesible?';
export const NAME_ROUNDS: SpotTokenRound[] = [
  {
    line: '<input type="date" aria-label="Fecha">',
    targetIndex: 2,
    why: 'El campo no tiene `<label>` asociado: su nombre sale de `aria-label`, y se llama «Fecha».',
    hint: 'Sin `<label>`, ¿cuál de las otras fuentes del nombre aparece en esta línea?',
  },
  {
    line: '<label for="m">Mañana</label> <input type="radio" name="franja" id="m">',
    targetIndex: 1,
    why: 'El `<label>` con `for="m"` se asocia con el campo de `id="m"`, y el contenido del label, «Mañana», es el nombre. `name="franja"` agrupa las opciones, pero no nombra a ninguna.',
    hint: '¿Qué texto vería una persona al lado de la opción?',
  },
  {
    line: '<input id="afil" type="text" placeholder="0000-0000" aria-label="Afiliado">',
    targetIndex: 4,
    why: 'El campo tiene `aria-label` y `placeholder`. El placeholder solo da el nombre como último recurso, cuando no hay nada más: acá el nombre es «Afiliado».',
    hint: 'Hay dos candidatos. ¿Cuál es el último recurso?',
  },
  {
    line: '<button><img alt="Buscar" src="lupa.svg"></button>',
    targetIndex: 1,
    why: 'El botón no tiene texto: solo contiene una imagen. El `alt` de esa imagen le da el nombre al botón, «Buscar».',
    hint: 'El botón no tiene texto propio. ¿Qué describe a la imagen que contiene?',
  },
  {
    line: '<textarea name="motivo" placeholder="Síntomas"></textarea>',
    targetIndex: 2,
    why: 'Sin `<label>` ni `aria-label`, el último recurso es el `placeholder`. `name` es el nombre con el que se envía el valor, no el nombre accesible.',
    hint: '¿Cuál de los dos atributos es un texto que la persona ve en pantalla?',
  },
];

export const LABEL_TEMPLATE = `<label {{a}}="dni">DNI</label>
<input type="text" {{b}}="dni">

<button {{c}}="Cerrar">×</button>

<button>
  <img src="lupa.svg" {{d}}="Buscar">
</button>`;
export const LABEL_SLOTS: FillBlankSlot[] = [
  {id: 'a', answer: 'for'},
  {id: 'b', answer: 'id'},
  {id: 'c', answer: 'aria-label'},
  {id: 'd', answer: 'alt'},
];
export const LABEL_BANK = ['name', 'alt', 'class', 'for', 'src', 'id', 'aria-label', 'type'];
export const LABEL_EXPLANATION =
  '`for` en el `<label>` apunta al `id` del campo, y así el campo se llama «DNI». El botón de la cruz necesita `aria-label`, porque «×» no describe qué hace. El botón con la lupa toma el nombre del `alt` de su imagen. `name` no sirve para asociar el label: es el nombre con el que se envía el valor.';

export const VISIBLE_HTML = `<style>
  .fade { opacity: 0; }
  .oculto { display: none; }
  .reservado { visibility: hidden; }
</style>

<p class="fade">Cargando agenda</p>
<div class="oculto">
  <p>Recordatorio enviado</p>
</div>
<p>Dra. Paz · 10:00</p>
<p class="reservado">Sin cupo</p>
<p class="aviso">Turno confirmado</p>`;

export const VISIBLE_QUESTIONS: MultiSelectQuestion[] = [
  {
    prompt: 'Con el HTML y los estilos de arriba, ¿qué párrafos considera visibles Playwright? Marcá todos los que correspondan.',
    options: [
      {
        text: '«Cargando agenda»',
        correct: true,
        why: 'La clase `fade` le da `opacity: 0`: es transparente, pero ocupa su espacio y no tiene `visibility: hidden`, así que para Playwright es visible.',
      },
      {
        text: '«Recordatorio enviado»',
        correct: false,
        why: 'El párrafo no tiene estilos, pero está dentro de un `<div>` con `display: none`. Si el contenedor no ocupa espacio, lo que tiene adentro tampoco.',
      },
      {
        text: '«Dra. Paz · 10:00»',
        correct: true,
        why: 'No tiene nada que lo oculte: ocupa su espacio y se muestra.',
      },
      {
        text: '«Sin cupo»',
        correct: false,
        why: 'La clase `reservado` le da `visibility: hidden`: ocupa su espacio, pero queda excluido de la regla de visibilidad.',
      },
      {
        text: '«Turno confirmado»',
        correct: true,
        why: 'Tiene la clase `aviso`, pero los estilos no definen ninguna regla para esa clase: se muestra normalmente.',
      },
    ],
  },
];

export const DOM_TREE = `ul.agenda
├── li
│   ├── span "10:00"
│   └── button "Reservar"
└── li
    ├── span "10:30"
    └── button "Reservar"`;

export const DOM_QUIZ: QuizQuestion[] = [
  {
    question: 'En la pantalla de turnos, al presionar «Confirmar turno» aparece «Turno confirmado». Lo buscás con Ver código fuente y no está. ¿Por qué?',
    options: [
      {text: 'El código fuente no muestra el contenido de los elementos `<p>`.', correct: false, why: 'El código fuente muestra todo el HTML que llegó, incluido el texto de los párrafos.'},
      {text: 'El mensaje lo agregó JavaScript después de la carga, y el código fuente muestra el HTML tal como llegó del servidor.', correct: true, why: 'El DOM cambia mientras la persona usa la página. Para ver el estado actual hay que mirar el panel Elements.'},
      {text: 'El mensaje está en una imagen, y por eso no figura como texto.', correct: false, why: 'Nada indica que sea una imagen. La diferencia es entre el HTML original y el DOM actual.'},
    ],
  },
  {
    question: 'Con el panel Elements abierto, buscás `.turno-libre` y DevTools muestra «1 of 6». ¿Qué significa?',
    options: [
      {text: 'Que el primer elemento de la página tiene seis clases.', correct: false, why: 'La búsqueda cuenta elementos que coinciden, no clases de un elemento.'},
      {text: 'Que hay un turno libre de seis posibles.', correct: false, why: 'DevTools no sabe qué es un turno: cuenta los elementos que coinciden con el selector.'},
      {text: 'Que seis elementos tienen la clase `turno-libre`, y está resaltado el primero.', correct: true, why: 'El selector `.turno-libre` coincide con seis elementos; el «1» indica cuál está resaltado.'},
    ],
  },
  {
    question: 'En este fragmento del DOM de la agenda, ¿qué relación hay entre el `span` «10:30» y el `button` «Reservar» que lo sigue?',
    options: [
      {text: 'Son hermanos: los dos son hijos del mismo `li`.', correct: true, why: 'Comparten el mismo padre, el segundo `li`.'},
      {text: 'El `span` es el padre del `button`.', correct: false, why: 'El `button` no está dentro del `span`: los dos están dentro del `li`.'},
      {text: 'Son hijos directos de `ul.agenda`.', correct: false, why: 'Los hijos directos de la `ul` son los dos `li`. El `span` y el `button` están un nivel más abajo.'},
    ],
  },
  {
    question: 'Un test no encuentra «el campo llamado Especialidad». Lo seleccionás con DevTools y la pestaña Accessibility muestra rol `combobox` y ningún nombre. Al lado del campo se lee «Especialidad». ¿Qué concluís?',
    options: [
      {text: 'El campo está oculto, por eso no tiene nombre.', correct: false, why: 'El campo figura en la pestaña Accessibility con su rol, y lo oculto no forma parte del árbol de accesibilidad. El problema es otro.'},
      {text: 'El campo no está en el DOM todavía.', correct: false, why: 'DevTools lo seleccionó y muestra su rol: está en el DOM.'},
      {text: 'El texto «Especialidad» no está asociado al campo, y eso es un defecto de accesibilidad para reportar.', correct: true, why: 'Sin `<label for>` ni `aria-label`, el campo no tiene nombre. El problema está en la página, no en el test.'},
    ],
  },
];
