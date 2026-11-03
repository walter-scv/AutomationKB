import type {FillBlankSlot} from '@site/src/components/FillBlank';
import type {MultiSelectQuestion} from '@site/src/components/MultiSelect';

export const CMD_TEMPLATE = `---
{{a}}: Revisa un Page Object de la agenda contra las reglas de la suite
{{b}}: "<archivo del Page Object>"
---

Revisá el Page Object {{c}}.

1. Leé las reglas de {{d}}.
2. Listá cada incumplimiento con la línea y la regla.
3. No edites el archivo: solo reportá.`;
export const CMD_SLOTS: FillBlankSlot[] = [
  {id: 'a', answer: 'description'},
  {id: 'b', answer: 'argument-hint'},
  {id: 'c', answer: '$ARGUMENTS'},
  {id: 'd', answer: '.claude/rules/page-objects.md'},
];
export const CMD_BANK = ['name', 'description', 'argument-hint', 'arguments-list', '$ARGUMENTS', '$FILE', '.claude/rules/page-objects.md', 'la documentación de Playwright'];
export const CMD_EXPLANATION =
  '`description` aparece en el menú y `argument-hint` dice qué se espera. `$ARGUMENTS` recibe lo que se escribe al invocarlo, y el paso 1 apunta a las reglas del repositorio en lugar de copiarlas.';

export const INVOKE_ACCEPTED = ["/qa:revisar-pom pages/AgendaPage.ts", "/qa:revisar-pom ./pages/AgendaPage.ts", "/qa:revisar-pom \"pages/AgendaPage.ts\"", "/qa:revisar-pom 'pages/AgendaPage.ts'", "/qa:revisar-pom \"./pages/AgendaPage.ts\""];
export const INVOKE_HINTS = [
  'El archivo está en una subcarpeta de .claude/commands/: eso agrega un prefijo al nombre.',
  'Es la barra, el nombre de la subcarpeta, dos puntos, el nombre del archivo sin .md y el argumento.',
];
export const INVOKE_EXPLANATION =
  '`.claude/commands/qa/revisar-pom.md` se invoca como `/qa:revisar-pom`, y lo que sigue reemplaza a `$ARGUMENTS`.';
export const INVOKE_CODE = `.claude/commands/
└── qa/
    └── revisar-pom.md`;

export const CONTENT_QUESTIONS: MultiSelectQuestion[] = [
  {
    prompt: 'El equipo de turnos está escribiendo el comando /qa:reportar-defecto. ¿Qué cosas tiene que contener? Marcá todas las que correspondan.',
    options: [
      {text: 'Los pasos numerados para armar el reporte.', correct: true, why: 'Un comando es un pedido bien escrito: los pasos en orden.'},
      {text: 'Una referencia a docs/guia-de-defectos.md para el formato.', correct: true, why: 'Se referencia el documento del repositorio en lugar de copiarlo.'},
      {text: 'El token de la API de Jira, para que el agente pueda crear el ticket.', correct: false, why: 'Es un secreto: el archivo se versiona.'},
      {text: 'Un paso que muestre el borrador y espere confirmación antes de crear el ticket.', correct: true, why: 'Crear un ticket cambia algo afuera: conviene confirmar antes.'},
      {text: 'Las reglas de toda la suite, como no usar waitForTimeout, por las dudas.', correct: false, why: 'Esas reglas van en las instrucciones del proyecto, que se cargan siempre.'},
      {text: 'Una explicación de qué es un defecto, para que el agente la tenga presente.', correct: false, why: 'Es conocimiento general que el agente ya tiene.'},
      {text: 'Qué datos recibe: el test que falló y el ticket del Pull Request, como argumentos.', correct: true, why: 'Un comando dice qué recibe, con $0 y $1 o $ARGUMENTS.'},
    ],
  },
];
