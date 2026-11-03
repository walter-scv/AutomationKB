import type {OrderItem, OrderRule} from '@site/src/components/Order';
import type {FillBlankSlot} from '@site/src/components/FillBlank';
import type {SpotTokenRound} from '@site/src/components/SpotToken';
import type {QuizQuestion} from '@site/src/components/Quiz';

export const STEP_ITEMS: OrderItem[] = [
  {id: 'run', what: 'Paso', code: 'run: npx playwright test'},
  {id: 'node', what: 'Paso', code: 'uses: actions/setup-node@v4  (with: cache: npm)'},
  {id: 'ci', what: 'Paso', code: 'run: npm ci'},
  {id: 'checkout', what: 'Paso', code: 'uses: actions/checkout@v4'},
  {id: 'upload', what: 'Paso', code: 'if: ${{ !cancelled() }} → uses: actions/upload-artifact@v4'},
  {id: 'browsers', what: 'Paso', code: 'run: npx playwright install --with-deps chromium'},
];
export const STEP_CORRECT = ['checkout', 'node', 'ci', 'browsers', 'run', 'upload'];
export const STEP_RULES: OrderRule[] = [
  {before: 'checkout', after: 'node', why: 'Con `cache: npm`, setup-node busca `package-lock.json` para armar la caché: el código tiene que estar bajado.'},
  {before: 'node', after: 'ci', why: '`npm ci` necesita Node.js instalado.'},
  {before: 'ci', after: 'browsers', why: '`npx playwright install` usa el Playwright que instaló `npm ci`, con su versión.'},
  {before: 'browsers', after: 'run', why: 'Los tests necesitan el navegador instalado.'},
  {before: 'run', after: 'upload', why: 'El reporte existe recién después de correr los tests.'},
];

export const NIGHT_TEMPLATE = `on:
  {{a}}:
    - cron: '0 9 * * 1-5'
  workflow_dispatch:
jobs:
  e2e:
    runs-on: ubuntu-latest
    env:
      BASE_URL: \${{ {{b}}.BASE_URL }}
      RECEPCIONISTA_CLAVE: \${{ {{c}}.RECEPCIONISTA_CLAVE }}
    steps:
      # ... checkout, node, npm ci, navegadores, tests ...
      - uses: actions/upload-artifact@v4
        if: \${{ {{d}} }}
        with:
          name: playwright-report
          path: playwright-report/
      - name: Avisar en Slack
        if: {{e}}
        run: ./avisar.sh`;
export const NIGHT_SLOTS: FillBlankSlot[] = [
  {id: 'a', answer: 'schedule'},
  {id: 'b', answer: 'vars'},
  {id: 'c', answer: 'secrets'},
  {id: 'd', answer: '!cancelled()'},
  {id: 'e', answer: 'failure()'},
];
export const NIGHT_BANK = ['push', 'secrets', 'failure()', 'always()', 'schedule', 'cancelled()', '!cancelled()', 'vars', 'env'];
export const NIGHT_EXPLANATION =
  '`schedule` con `cron` corre de lunes a viernes a las 9 UTC. La dirección del servidor es una variable (`vars`) y la contraseña, un secreto (`secrets`). El reporte se guarda salvo que se cancele la corrida, y el aviso sale solo si algo falló.';

export const YAML_PROMPT = '¿Qué parte de esta línea causa el problema?';
export const YAML_ROUNDS: SpotTokenRound[] = [
  {
    line: "if: ${{ secrets.SLACK_WEBHOOK_URL != '' }} # condición de un paso; actionlint: context is not allowed here",
    targetIndex: 2,
    why: 'En la condición `if` de un paso no se puede leer `secrets`. El secreto se pasa al paso por `env`, y la condición usa otra cosa, como `failure()`.',
    hint: '¿Qué contexto menciona el error de actionlint?',
  },
  {
    line: 'RECEPCIONISTA_CLAVE: Marta2024! # dentro de env: en el workflow',
    targetIndex: 1,
    why: 'La contraseña queda escrita en el repositorio. Va como secreto: `${{ secrets.RECEPCIONISTA_CLAVE }}`.',
    hint: '¿Quién puede leer este archivo?',
  },
  {
    line: 'runs_on: ubuntu-latest # actionlint: "runs-on" section is missing in job',
    targetIndex: 0,
    why: 'La clave es `runs-on`, con guion: con guion bajo, GitHub no la reconoce y el job queda sin máquina.',
    hint: 'Compará la clave con el nombre que espera el error.',
  },
  {
    line: 'run: npx playwright test --grep "${{ inputs.tag }}" # el tag lo escribe quien dispara el workflow a mano',
    targetIndex: 6,
    why: 'Un valor que escribe una persona queda pegado dentro del comando y podría ejecutarse como parte de él. Se pasa por `env` y se usa como `"$TAG"`.',
    hint: '¿Quién controla el texto que se pega en el comando?',
  },
];

export const CI_QUIZ: QuizQuestion[] = [
  {
    question: 'En el workflow de shards de turnos, el aviso a Slack es el último paso del job reporte, con if: failure(). Ayer fallaron 6 tests en los shards y no llegó ningún aviso. ¿Por qué?',
    options: [
      {text: 'Porque el secreto del webhook no se puede leer dentro de `run`.', correct: false, why: 'Se puede, a través de `env`: el paso ni siquiera llegó a correr.'},
      {text: 'Porque `failure()` en un paso mira solo los pasos de su job, y en el job reporte no falló ninguno.', correct: true, why: 'El aviso va en un job propio con `needs: [tests, reporte]` e `if: failure()`: a nivel de job, mira los jobs de los que depende.'},
      {text: 'Porque `fail-fast: false` impide que el workflow falle.', correct: false, why: '`fail-fast: false` solo evita que un shard que falla cancele a los otros.'},
    ],
  },
  {
    question: 'Los tests fallaron en CI y en la corrida no hay ningún artefacto playwright-report. El paso que lo sube es uses: actions/upload-artifact@v4, sin if. ¿Por qué?',
    options: [
      {text: 'Porque cuando un paso falla, GitHub saltea los siguientes que no tienen una condición como `!cancelled()`.', correct: true, why: 'Sin condición, un paso solo corre si los anteriores pasaron: justo cuando hace falta el reporte, no se sube.'},
      {text: 'Porque los artefactos solo se guardan cuando el job termina en verde.', correct: false, why: 'Se guardan en cualquier caso, si el paso que los sube corre.'},
      {text: 'Porque Playwright no genera el reporte HTML cuando hay tests fallados.', correct: false, why: 'Lo genera igual: el reporte existe en la máquina, pero el paso que lo sube no corrió.'},
    ],
  },
  {
    question: 'La regresión de turnos tiene cron: \'0 6 * * *\'. La responsable de calidad, en Buenos Aires, quiere los resultados antes de entrar a las 8. ¿A qué hora de Buenos Aires empieza la corrida?',
    options: [
      {text: 'A las 6:00.', correct: false, why: 'La hora del cron es UTC, no la hora local.'},
      {text: 'A las 9:00.', correct: false, why: 'Buenos Aires está tres horas detrás de UTC, no adelante.'},
      {text: 'A las 3:00.', correct: true, why: 'Las 6:00 UTC son las 3:00 en Buenos Aires: los resultados están antes de las 8.'},
    ],
  },
  {
    question: 'La matriz de 3 shards no tiene fail-fast: false. El shard 1 falla a los 2 minutos. ¿Qué pasa con los otros dos?',
    options: [
      {text: 'Siguen corriendo y suben su resultado igual.', correct: false, why: 'Eso pasa con `fail-fast: false`. Sin esa línea, GitHub cancela los demás.'},
      {text: 'GitHub los cancela, y el reporte unido queda con un solo shard.', correct: true, why: 'Por defecto, la matriz corta todo al primer job que falla: `fail-fast: false` evita perder los otros resultados.'},
      {text: 'Esperan a que el shard 1 se reintente.', correct: false, why: 'Los jobs de la matriz no se esperan entre sí, ni se reintentan solos.'},
    ],
  },
];
