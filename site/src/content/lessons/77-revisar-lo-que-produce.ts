import type {CodeLine} from '@site/src/components/FindInCode';
import type {DecisionNode} from '@site/src/components/DecisionPath';

export const GEN_RULE_LABELS = [
  'Usa algo que no existe',
  'No verifica lo que promete el título',
  'No respeta el framework',
];
export const GEN_LINES: CodeLine[] = [
  {
    code: "test('buscar un paciente por DNI muestra su ficha', async ({ page, pacientesPage, sembrarPaciente }) => {",
    rule: 0,
    why: 'Pide el Page Object y la fixture de siembra de la suite.',
    hint: '¿Qué pide el test para trabajar?',
  },
  {
    code: "  const paciente = await sembrarPaciente(unPaciente().build());",
    rule: 0,
    why: 'Crea el paciente con la fixture, que lo borra al terminar.',
    hint: '¿Quién crea y quién borra este paciente?',
  },
  {
    code: "  await page.goto('https://staging.clinica.test/pacientes');",
    rule: 3,
    why: 'La dirección depende del entorno: va en `BASE_URL`, y la pantalla se abre con `pacientesPage.abrir()`.',
    hint: '¿De dónde sale la dirección del servidor en la suite?',
  },
  {
    code: "  await test.step('2- La recepcionista busca al paciente por su DNI', async () => {",
    rule: 0,
    why: 'Un paso numerado, con el lenguaje del negocio.',
    hint: '¿Hay algo inventado o fuera de lugar en esta línea?',
  },
  {
    code: "    await pacientesPage.buscador.fillSlowly(paciente.dni);",
    rule: 1,
    why: 'Es una alucinación: los locators no tienen `fillSlowly`. Para escribir tecla por tecla existe `pressSequentially`.',
    hint: '¿Ese método existe en Playwright?',
  },
  {
    code: "    await page.locator('.patient-card >> nth=0').click();",
    rule: 3,
    why: 'Un selector CSS por clase y posición, escrito en el test: el locator va en el Page Object, por rol y nombre, y elegido por el DNI.',
    hint: '¿Dónde viven los locators en la suite, y cómo se eligen?',
  },
  {
    code: "  });",
    rule: 0,
    why: 'Cierra el paso.',
    hint: '¿Hay algo en esta línea?',
  },
  {
    code: "  await expect(pacientesPage.ficha(paciente.dni)).toBeShown();",
    rule: 1,
    why: 'Otra alucinación: el matcher es `toBeVisible`. TypeScript lo marca antes de correr.',
    hint: '¿Ese matcher existe en Playwright?',
  },
  {
    code: "  await expect(pacientesPage.titulo).toHaveText('Pacientes');",
    rule: 2,
    why: 'Verifica el título de la lista, que se ve aunque la búsqueda no encuentre a nadie: no comprueba que se muestre la ficha del paciente, que es lo que promete el test.',
    hint: '¿Esta assertion falla si la búsqueda no encuentra al paciente?',
  },
];

export const HYP_START = 'button';
export const HYP_NODES: Record<string, DecisionNode> = {
  button: {
    id: 'button',
    situation: 'El test de reprogramar falla buscando el botón «Cambiar horario». Un asistente lee el snapshot y propone usar «Reprogramar», que es lo que muestra la página. ¿Qué hacés primero?',
    options: [
      {text: 'Aplicar el cambio en el Page Object, porque el snapshot muestra claramente qué botón hay en la página.', correct: false, why: 'El snapshot dice qué hay, no qué debería haber: puede ser un defecto de la aplicación.'},
      {text: 'Revisar en el diseño cuál es el nombre aprobado del botón.', correct: true, why: 'Si el diseño dice «Cambiar horario», el defecto es de la aplicación y el test no se toca.', next: 'pass'},
      {text: 'Pedirle al asistente que decida, porque ya leyó el snapshot y el código del test.', correct: false, why: 'El diseño aprobado no está en su contexto: no tiene cómo decidirlo.'},
    ],
  },
  pass: {
    id: 'pass',
    situation: 'El test generado de reservar pasa a la primera. Antes de integrarlo, cambiás el valor esperado de «Reservado» a «Cancelado» y vuelve a pasar. ¿Qué indica?',
    options: [
      {text: 'Que el test es muy robusto: pasa en cualquier condición.', correct: false, why: 'Un test que pasa con cualquier valor esperado no verifica nada.'},
      {text: 'Que la assertion no verifica lo que parece: le falta el `await` o apunta a otro elemento.', correct: true, why: 'Con un valor imposible tendría que fallar; si no falla, la verificación no está ocurriendo.', next: 'flaky'},
      {text: 'Que el servidor de staging devuelve los dos estados según la hora del día.', correct: false, why: 'Es muy improbable; antes hay que revisar la assertion del propio test.'},
    ],
  },
  flaky: {
    id: 'flaky',
    situation: 'Corregida la assertion, el test pasa. Lo corrés 20 veces seguidas con `--repeat-each=20 --retries=0` y falla 3. En las 3, el test lee el estado de la fila con `textContent()` justo después de reservar, antes de que la agenda lo actualice: obtiene «Libre» en lugar de «Reservado». ¿Qué hacés?',
    options: [
      {text: 'Integrarlo con `retries: 2` en la configuración, porque 17 de cada 20 veces pasa.', correct: false, why: 'Los reintentos esconden un test inestable que el equipo va a heredar.'},
      {text: 'Agregar un `waitForTimeout(1000)` antes de leer el estado con `textContent()`.', correct: false, why: 'Una espera fija funciona hasta que el servidor tarde más.'},
      {text: 'Usar `expect(...).toHaveText(\'Reservado\')`, que espera, y volver a medir.', correct: true, why: '`textContent()` lee una sola vez; la assertion de Playwright reintenta hasta que el estado cambia o vence el tiempo.'},
    ],
  },
};
export const HYP_EXPLANATION =
  'La explicación de un fallo es una hipótesis que se confirma contra el diseño; un test se rompe a propósito para ver que pueda fallar; y se mide su estabilidad antes de integrarlo.';

export const SNAP_CODE = `# Línea del test que falló
await page.getByRole('row').filter({ hasText: '09:30' }).getByRole('button', { name: 'Cancelar' }).click();

# Error details
TimeoutError: locator.click: Timeout 2000ms exceeded.
  - waiting for getByRole('row').filter({ hasText: '09:30' }).getByRole('button', { name: 'Cancelar' })

# Page snapshot
- table [ref=e3]:
  - rowgroup [ref=e4]:
    - row [ref=e10]:
      - cell "09:30" [ref=e11]
      - cell "Dra. Paz" [ref=e12]
      - cell "Reservado" [ref=e13]
      - cell [ref=e14]:
        - button "Cancelar turno" [ref=e15]
    - row [ref=e16]:
      - cell "10:00" [ref=e17]
      - cell "Dra. Paz" [ref=e18]
      - cell "Reservado" [ref=e19]
      - cell [ref=e20]:
        - button "Cancelar turno" [ref=e21]`;
export const SNAP_ACCEPTED = ["await page.getByRole('row').filter({ hasText: '09:30' }).getByRole('button', { name: 'Cancelar turno' }).click()", "await page.getByRole('row').filter({ hasText: '09:30' }).getByRole('button', { name: 'Cancelar turno' }).click();", "await page.getByRole('row').filter({hasText: '09:30'}).getByRole('button', {name: 'Cancelar turno'}).click()", "await page.getByRole('row').filter({hasText: '09:30'}).getByRole('button', {name: 'Cancelar turno'}).click();", "await page.getByRole('row').filter({ hasText: '09:30' }).getByRole(\"button\", { name: \"Cancelar turno\" }).click()", "await page.getByRole('row').filter({ hasText: '09:30' }).getByRole(\"button\", { name: \"Cancelar turno\" }).click();", "await page.getByRole('row').filter({hasText: '09:30'}).getByRole(\"button\", {name: \"Cancelar turno\"}).click()", "await page.getByRole('row').filter({hasText: '09:30'}).getByRole(\"button\", {name: \"Cancelar turno\"}).click();", "await page.getByRole('row').filter({ hasText: \"09:30\" }).getByRole('button', { name: 'Cancelar turno' }).click()", "await page.getByRole('row').filter({ hasText: \"09:30\" }).getByRole('button', { name: 'Cancelar turno' }).click();", "await page.getByRole('row').filter({hasText: \"09:30\"}).getByRole('button', {name: 'Cancelar turno'}).click()", "await page.getByRole('row').filter({hasText: \"09:30\"}).getByRole('button', {name: 'Cancelar turno'}).click();", "await page.getByRole('row').filter({ hasText: \"09:30\" }).getByRole(\"button\", { name: \"Cancelar turno\" }).click()", "await page.getByRole('row').filter({ hasText: \"09:30\" }).getByRole(\"button\", { name: \"Cancelar turno\" }).click();", "await page.getByRole('row').filter({hasText: \"09:30\"}).getByRole(\"button\", {name: \"Cancelar turno\"}).click()", "await page.getByRole('row').filter({hasText: \"09:30\"}).getByRole(\"button\", {name: \"Cancelar turno\"}).click();", "await page.getByRole(\"row\").filter({ hasText: '09:30' }).getByRole('button', { name: 'Cancelar turno' }).click()", "await page.getByRole(\"row\").filter({ hasText: '09:30' }).getByRole('button', { name: 'Cancelar turno' }).click();", "await page.getByRole(\"row\").filter({hasText: '09:30'}).getByRole('button', {name: 'Cancelar turno'}).click()", "await page.getByRole(\"row\").filter({hasText: '09:30'}).getByRole('button', {name: 'Cancelar turno'}).click();", "await page.getByRole(\"row\").filter({ hasText: '09:30' }).getByRole(\"button\", { name: \"Cancelar turno\" }).click()", "await page.getByRole(\"row\").filter({ hasText: '09:30' }).getByRole(\"button\", { name: \"Cancelar turno\" }).click();", "await page.getByRole(\"row\").filter({hasText: '09:30'}).getByRole(\"button\", {name: \"Cancelar turno\"}).click()", "await page.getByRole(\"row\").filter({hasText: '09:30'}).getByRole(\"button\", {name: \"Cancelar turno\"}).click();", "await page.getByRole(\"row\").filter({ hasText: \"09:30\" }).getByRole('button', { name: 'Cancelar turno' }).click()", "await page.getByRole(\"row\").filter({ hasText: \"09:30\" }).getByRole('button', { name: 'Cancelar turno' }).click();", "await page.getByRole(\"row\").filter({hasText: \"09:30\"}).getByRole('button', {name: 'Cancelar turno'}).click()", "await page.getByRole(\"row\").filter({hasText: \"09:30\"}).getByRole('button', {name: 'Cancelar turno'}).click();", "await page.getByRole(\"row\").filter({ hasText: \"09:30\" }).getByRole(\"button\", { name: \"Cancelar turno\" }).click()", "await page.getByRole(\"row\").filter({ hasText: \"09:30\" }).getByRole(\"button\", { name: \"Cancelar turno\" }).click();", "await page.getByRole(\"row\").filter({hasText: \"09:30\"}).getByRole(\"button\", {name: \"Cancelar turno\"}).click()", "await page.getByRole(\"row\").filter({hasText: \"09:30\"}).getByRole(\"button\", {name: \"Cancelar turno\"}).click();"];
export const SNAP_HINTS = [
  'Copiá la línea del test que falló y cambiá solo el nombre del botón.',
  'El nombre nuevo es el que aparece en el snapshot, dentro de la fila de las 09:30: «Cancelar turno».',
];
export const SNAP_EXPLANATION =
  'El snapshot muestra que el botón ahora se llama «Cancelar turno». Como el diseño aprobado lo confirma, el cambio es del test: se mantiene el filtro de la fila y se cambia solo el nombre. Si el diseño dijera «Cancelar», el defecto sería de la aplicación y el test no se tocaría.';
