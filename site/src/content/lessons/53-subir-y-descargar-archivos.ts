import type {ClassifyItem} from '@site/src/components/Classify';
import type {FillBlankSlot} from '@site/src/components/FillBlank';
import type {OrderItem, OrderRule} from '@site/src/components/Order';
import type {SpotTokenRound} from '@site/src/components/SpotToken';

export const FILE_COLUMNS = ['setInputFiles en el campo', 'Evento filechooser', 'Evento download'];
export const FILE_ITEMS: ClassifyItem[] = [
  {
    code: 'Cargar la orden médica en el campo «Orden médica», un input de tipo file con su etiqueta.',
    column: 0,
    why: 'El campo existe y tiene etiqueta: `getByLabel(...).setInputFiles(...)` carga el archivo directamente.',
    hint: '¿El campo de archivo se puede encontrar con un locator?',
  },
  {
    code: 'Bajar el comprobante del turno con el enlace «Descargar comprobante».',
    column: 2,
    why: 'Es una descarga: se espera el evento `download` antes del click y se guarda con `saveAs`.',
    hint: '¿El archivo entra a la página o sale de ella?',
  },
  {
    code: 'Adjuntar estudios con el botón «Agregar estudios», que abre la ventana de selección por código; el input real está oculto y sin etiqueta.',
    column: 1,
    why: 'Sin un locator útil para el campo oculto, se espera el evento `filechooser` que provoca el botón.',
    hint: '¿Hay un campo de archivo que el test pueda encontrar por su etiqueta?',
  },
  {
    code: 'Quitar la foto que se había elegido para el perfil del paciente.',
    column: 0,
    why: '`setInputFiles([])` con una lista vacía quita los archivos del campo.',
    hint: '¿Hace falta abrir alguna ventana para quitar el archivo?',
  },
  {
    code: 'Exportar la agenda del mes a una planilla y comprobar que contiene el turno del 12/11.',
    column: 2,
    why: 'La exportación genera un archivo que sale de la página: evento `download`, `saveAs` y lectura del contenido.',
    hint: '¿Quién genera el archivo, el test o la aplicación?',
  },
  {
    code: 'Probar que la aplicación rechaza un archivo .exe en el campo «Orden médica», sin guardar un .exe en el repositorio.',
    column: 0,
    why: 'Se carga en el campo un archivo creado en memoria, con `name`, `mimeType` y `buffer`.',
    hint: '¿El archivo tiene que existir en disco para cargarlo en el campo?',
  },
];

export const UPLOAD_TEMPLATE = `import {{a}} from 'path';

await page.getByLabel('Estudios previos').{{b}}([
  path.join({{c}}, '../archivos/radiografia.png'),
  path.join(__dirname, '../archivos/ecografia.png'),
]);
await expect(page.getByRole('listitem'))
  .toHaveText(['radiografia.png', 'ecografia.png']);

// el paciente se arrepiente y quita los dos
await page.getByLabel('Estudios previos')
  .setInputFiles({{d}});`;
export const UPLOAD_SLOTS: FillBlankSlot[] = [
  {id: 'a', answer: 'path'},
  {id: 'b', answer: 'setInputFiles'},
  {id: 'c', answer: '__dirname'},
  {id: 'd', answer: '[]'},
];
export const UPLOAD_BANK = ['fs', '[]', 'fill', 'setInputFiles', 'null', '__dirname', 'path', "'/Users/ana'"];
export const UPLOAD_EXPLANATION =
  '`path.join(__dirname, ...)` arma la ruta desde la carpeta del test, igual en cualquier computadora. `setInputFiles` recibe una lista para varios archivos, y una lista vacía los quita.';

export const DOWNLOAD_ITEMS: OrderItem[] = [
  {id: 'save', what: 'Línea', code: 'await descarga.saveAs(destino);'},
  {id: 'click', what: 'Línea', code: "await page.getByRole('link', { name: 'Descargar comprobante' }).click();"},
  {id: 'read', what: 'Línea', code: "const contenido = fs.readFileSync(destino, 'utf-8');"},
  {id: 'goto', what: 'Línea', code: "await page.goto('/turnos/12-11');"},
  {id: 'path', what: 'Línea', code: 'const destino = testInfo.outputPath(descarga.suggestedFilename());'},
  {id: 'wait', what: 'Línea', code: "const descargaPromise = page.waitForEvent('download');"},
  {id: 'check', what: 'Línea', code: "expect(contenido).toContain('Dermatología');"},
  {id: 'await', what: 'Línea', code: 'const descarga = await descargaPromise;'},
];
export const DOWNLOAD_CORRECT = ['goto', 'wait', 'click', 'await', 'path', 'save', 'read', 'check'];
export const DOWNLOAD_RULES: OrderRule[] = [
  {before: 'goto', after: 'wait', why: 'Primero se abre la pantalla del turno.'},
  {before: 'wait', after: 'click', why: 'La descarga empieza durante el click: hay que esperarla antes.'},
  {before: 'click', after: 'await', why: 'La Promise se resuelve con la descarga que provoca el click.'},
  {before: 'await', after: 'path', why: 'El nombre sugerido sale de la descarga: primero hay que tenerla.'},
  {before: 'path', after: 'save', why: '`saveAs` necesita la ruta de destino.'},
  {before: 'save', after: 'read', why: 'Se lee el archivo recién después de guardarlo.'},
  {before: 'read', after: 'check', why: 'La verificación usa el contenido leído.'},
];

export const FILE_PROMPT = '¿Qué parte de esta línea causa el problema?';
export const FILE_ROUNDS: SpotTokenRound[] = [
  {
    line: "await page.getByLabel('Orden médica').setInputFiles('/Users/ana/Escritorio/orden.pdf');",
    targetIndex: 2,
    why: 'La ruta apunta al escritorio de una persona: en otra computadora o en CI no existe, y el test falla con ENOENT.',
    hint: '¿Ese archivo existe en la computadora de otra persona del equipo?',
  },
  {
    line: "const descarga = await page.waitForEvent('download'); await page.getByRole('link', { name: 'Descargar comprobante' }).click();",
    targetIndex: 3,
    why: 'Con `await` delante, el test se detiene a esperar una descarga antes de hacer el click que la provoca: el click nunca ocurre y el test falla por timeout. La espera se crea sin `await` y se espera después del click.',
    hint: 'Antes del click, ¿el test tiene que esperar la descarga o solo empezar a esperarla?',
  },
  {
    line: "const descarga = await descargaPromise; await descarga.saveAs('comprobante.pdf');",
    targetIndex: 6,
    why: 'Una ruta relativa guarda el archivo en la carpeta desde donde se corre el comando, dentro del repositorio. Se usa `testInfo.outputPath(...)`.',
    hint: '¿Dónde queda guardado el archivo con esa ruta?',
  },
];
