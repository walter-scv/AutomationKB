import type {MatchItem} from '@site/src/components/Match';
import type {ClassifyItem} from '@site/src/components/Classify';
import type {FillBlankSlot} from '@site/src/components/FillBlank';

export const RULE_LEFT: MatchItem[] = [
  {id: 'button', text: '`button-name`: el botón del carrito solo contiene un ícono `<svg>`.'},
  {id: 'image', text: '`image-alt`: la foto del producto no tiene texto alternativo.'},
  {id: 'contrast', text: '`color-contrast`: el precio tachado se ve gris claro sobre fondo blanco.'},
  {id: 'label', text: '`label`: el campo de cupón no tiene etiqueta ni placeholder.'},
  {id: 'lang', text: '`html-has-lang`: la página no declara su idioma.'},
  {id: 'link', text: '`link-name`: el enlace a la ficha es solo una flecha dibujada con CSS.'},
];
export const RULE_RIGHT: MatchItem[] = [
  {id: 'lang', text: 'Agregar `lang="es"` a la etiqueta `<html>`.'},
  {id: 'link', text: 'Darle al enlace un texto o un `aria-label` que diga a dónde lleva.'},
  {id: 'image', text: 'Agregar un `alt` que describa la foto.'},
  {id: 'button', text: 'Darle al botón un texto visible o un `aria-label`.'},
  {id: 'label', text: 'Asociarle un `<label>` con `for` e `id`.'},
  {id: 'contrast', text: 'Oscurecer el color del texto hasta alcanzar el contraste mínimo.'},
];
export const RULE_WHY: Record<string, string> = {
  button: 'Un botón necesita un nombre accesible: un texto o un `aria-label` que diga qué hace.',
  image: 'El `alt` es lo que leen los lectores de pantalla en lugar de la imagen.',
  contrast: 'La regla mide el contraste entre el texto y el fondo: se corrige con colores más contrastados.',
  label: 'Un campo sin etiqueta ni placeholder no tiene nombre: la etiqueta asociada lo resuelve.',
  lang: 'El lector de pantalla usa el idioma declarado para pronunciar el texto.',
  link: 'Un enlace sin texto no dice a dónde lleva.',
};

export const DETECT_COLUMNS = ['Lo detecta axe', 'Requiere revisión manual'];
export const DETECT_ITEMS: ClassifyItem[] = [
  {
    code: 'La foto del producto no tiene atributo alt.',
    column: 0,
    why: 'Es una regla fija del HTML: `image-alt` la detecta.',
    hint: '¿Se puede decidir mirando solo el HTML?',
  },
  {
    code: 'La foto del producto tiene alt="imagen", que no describe nada.',
    column: 1,
    why: 'El `alt` existe, así que la regla se cumple. Saber si describe la imagen requiere el juicio de una persona.',
    hint: 'El atributo está. ¿Una regla puede saber si lo que dice es útil?',
  },
  {
    code: 'El botón Pagar solo tiene un ícono, sin texto ni aria-label.',
    column: 0,
    why: '`button-name` detecta un botón sin nombre accesible.',
    hint: '¿Tiene el botón algún nombre accesible?',
  },
  {
    code: 'Al recorrer el checkout con Tab, el foco salta del email al pie de página y después vuelve al pago.',
    column: 1,
    why: 'El orden del foco se comprueba recorriendo la pantalla con el teclado: ninguna regla de axe lo evalúa por sí sola.',
    hint: '¿Hay que recorrer la pantalla para notarlo?',
  },
  {
    code: 'El texto del precio tachado es gris claro sobre blanco.',
    column: 0,
    why: '`color-contrast` calcula el contraste entre texto y fondo.',
    hint: '¿Se puede medir con una fórmula?',
  },
  {
    code: 'Con la pantalla ampliada al 200%, el botón Confirmar queda cortado.',
    column: 1,
    why: 'Se detecta ampliando la pantalla y mirando: un análisis de la página en su tamaño normal no lo ve.',
    hint: '¿El análisis se hace con la pantalla ampliada?',
  },
  {
    code: 'El botón para cerrar el aviso tiene aria-label="botón".',
    column: 1,
    why: 'Tiene nombre, así que `button-name` se cumple. Que «botón» no diga qué hace lo detecta una persona.',
    hint: 'La regla pide que exista un nombre. ¿Pide que sea útil?',
  },
];

export const AXE_TEMPLATE = `import AxeBuilder from '{{a}}';

test('el checkout no tiene problemas detectables', async ({ page }) => {
  await page.goto('/checkout');
  const resultados = await new AxeBuilder({ {{b}} })
    .{{c}}(['wcag2a', 'wcag2aa'])
    .include('#formulario-pago')
    .{{d}}();
  expect(resultados.{{e}}).toEqual([]);
});`;
export const AXE_SLOTS: FillBlankSlot[] = [
  {id: 'a', answer: '@axe-core/playwright'},
  {id: 'b', answer: 'page'},
  {id: 'c', answer: 'withTags'},
  {id: 'd', answer: 'analyze'},
  {id: 'e', answer: 'violations'},
];
export const AXE_BANK = ['analyze', 'violations', 'disableRules', '@playwright/test', 'page', 'withTags', 'passes', '@axe-core/playwright', 'exclude', 'browser'];
export const AXE_EXPLANATION =
  '`AxeBuilder` se importa de `@axe-core/playwright` y recibe la `page`. `withTags` limita las reglas a WCAG A y AA, `include` acota el análisis al formulario de pago, `analyze()` lo corre, y `violations` tiene que quedar vacía.';
