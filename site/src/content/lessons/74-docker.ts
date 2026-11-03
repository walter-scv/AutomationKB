import type {MatchItem} from '@site/src/components/Match';
import type {OrderItem, OrderRule} from '@site/src/components/Order';
import type {TerminalStep} from '@site/src/components/Terminal';
import type {QuizQuestion} from '@site/src/components/Quiz';

export const TERM_LEFT: MatchItem[] = [
  {id: 'image', text: 'La plantilla con el sistema, Node.js y los navegadores, que no cambia.'},
  {id: 'container', text: 'Una ejecución aislada de esa plantilla, que se puede borrar al terminar.'},
  {id: 'volume', text: 'Hacer que la carpeta del proyecto aparezca dentro del contenedor.'},
  {id: 'env', text: 'Pasarle al contenedor la dirección del servidor de pruebas.'},
  {id: 'rm', text: 'Borrar el contenedor apenas termina la corrida.'},
  {id: 'run', text: 'Instalar las dependencias mientras se arma la imagen.'},
  {id: 'cmd', text: 'El comando que corre el contenedor si no se le indica otro.'},
  {id: 'ignore', text: 'Dejar .env y node_modules afuera de la imagen.'},
  {id: 'gha', text: 'Correr un job de GitHub Actions dentro de la imagen de Playwright.'},
];
export const TERM_RIGHT: MatchItem[] = [
  {id: 'cmd', text: '`CMD` en el Dockerfile'},
  {id: 'volume', text: '`-v "$PWD":/work`'},
  {id: 'container', text: 'Contenedor'},
  {id: 'rm', text: '`--rm`'},
  {id: 'image', text: 'Imagen'},
  {id: 'run', text: '`RUN npm ci` en el Dockerfile'},
  {id: 'env', text: '`-e BASE_URL=...`'},
  {id: 'gha', text: '`container:` con `image:` en el job'},
  {id: 'ignore', text: '`.dockerignore`'},
];
export const TERM_WHY: Record<string, string> = {
  image: 'La imagen es el paquete fijo del que arrancan los contenedores.',
  container: 'Cada contenedor arranca de la imagen, hace su trabajo y se descarta.',
  volume: 'Con `-v`, una carpeta de tu computadora aparece dentro del contenedor.',
  env: '`-e` define una variable de entorno dentro del contenedor.',
  rm: '`--rm` evita que se acumulen contenedores terminados.',
  run: '`RUN` ejecuta un comando durante `docker build`, y su resultado queda en la imagen.',
  cmd: '`CMD` es el comando por defecto al correr la imagen.',
  ignore: '`.dockerignore` excluye archivos del contexto que se copia a la imagen.',
  gha: 'Con `container`, todos los pasos del job corren dentro de esa imagen.',
};

export const DOCKER_ITEMS: OrderItem[] = [
  {id: 'copyall', what: 'Línea', code: 'COPY . .'},
  {id: 'from', what: 'Línea', code: 'FROM mcr.microsoft.com/playwright:v1.64.1-noble'},
  {id: 'ci', what: 'Línea', code: 'RUN npm ci'},
  {id: 'workdir', what: 'Línea', code: 'WORKDIR /agenda'},
  {id: 'copypkg', what: 'Línea', code: 'COPY package*.json ./'},
];
export const DOCKER_CORRECT = ['from', 'workdir', 'copypkg', 'ci', 'copyall'];
export const DOCKER_RULES: OrderRule[] = [
  {before: 'from', after: 'workdir', why: 'Todo Dockerfile empieza por la imagen de la que parte.'},
  {before: 'workdir', after: 'copypkg', why: '`./` es la carpeta de trabajo: tiene que estar fijada antes de copiar.'},
  {before: 'copypkg', after: 'ci', why: '`npm ci` necesita `package.json` y `package-lock.json`, que `package*.json` copia juntos.'},
  {before: 'ci', after: 'copyall', why: 'Si el resto se copia después de instalar, un cambio en un test no invalida la capa de `npm ci`, que queda en caché.'},
];

export const DOCKER_STEPS: TerminalStep[] = [
  {
    instruction: 'Antes de armar la imagen de la agenda, fijate qué imágenes de Playwright ya bajaste.',
    accepted: ['docker images mcr.microsoft.com/playwright', 'docker images', 'docker image ls', 'docker image ls mcr.microsoft.com/playwright', 'docker images mcr.microsoft.com/playwright*'],
    hint: 'Es el comando de Docker que lista las imágenes, opcionalmente con el nombre del repositorio.',
    output: 'REPOSITORY                     TAG             IMAGE ID       CREATED      SIZE\nmcr.microsoft.com/playwright   v1.64.1-noble   47b510dd9230   6 days ago   3.51GB',
  },
  {
    instruction: 'La de 1.64.1 coincide con el package.json. Con el Dockerfile en la raíz del proyecto, armá la imagen de la suite con el nombre agenda-e2e.',
    accepted: ["docker build --tag agenda-e2e .", "docker build --tag agenda-e2e ./", "docker build -t agenda-e2e .", "docker build -t agenda-e2e ./", "docker build -t agenda-e2e:latest .", "docker build . --tag agenda-e2e", "docker build . -t agenda-e2e", "docker build ./ --tag agenda-e2e", "docker build ./ -t agenda-e2e"],
    hint: 'Es `docker build`, la opción que le pone nombre a la imagen y la carpeta del proyecto.',
    output: '#5 [1/5] FROM mcr.microsoft.com/playwright:v1.64.1-noble@sha256:47b510dd...\n#6 [2/5] WORKDIR /agenda\n#7 [3/5] COPY package*.json ./\n#8 [4/5] RUN npm ci\n#9 [5/5] COPY . .\n#10 naming to docker.io/library/agenda-e2e:latest done',
  },
  {
    instruction: 'El .env no está en la imagen. Corré los tests @smoke en un contenedor que se borre al terminar, contra https://staging.clinica.test y con RECEPCIONISTA_CLAVE=clave-de-prueba.',
    accepted: ["docker run --env BASE_URL=https://staging.clinica.test --env RECEPCIONISTA_CLAVE=clave-de-prueba --rm agenda-e2e npx playwright test --grep \"@smoke\"", "docker run --env BASE_URL=https://staging.clinica.test --env RECEPCIONISTA_CLAVE=clave-de-prueba --rm agenda-e2e npx playwright test --grep '@smoke'", "docker run --env BASE_URL=https://staging.clinica.test --env RECEPCIONISTA_CLAVE=clave-de-prueba --rm agenda-e2e npx playwright test --grep @smoke", "docker run --env BASE_URL=https://staging.clinica.test --env RECEPCIONISTA_CLAVE=clave-de-prueba --rm agenda-e2e npx playwright test --grep=@smoke", "docker run --env BASE_URL=https://staging.clinica.test --env RECEPCIONISTA_CLAVE=clave-de-prueba --rm agenda-e2e npx playwright test -g \"@smoke\"", "docker run --env BASE_URL=https://staging.clinica.test --env RECEPCIONISTA_CLAVE=clave-de-prueba --rm agenda-e2e npx playwright test -g @smoke", "docker run --env BASE_URL=https://staging.clinica.test --rm --env RECEPCIONISTA_CLAVE=clave-de-prueba agenda-e2e npx playwright test --grep \"@smoke\"", "docker run --env BASE_URL=https://staging.clinica.test --rm --env RECEPCIONISTA_CLAVE=clave-de-prueba agenda-e2e npx playwright test --grep '@smoke'", "docker run --env BASE_URL=https://staging.clinica.test --rm --env RECEPCIONISTA_CLAVE=clave-de-prueba agenda-e2e npx playwright test --grep @smoke", "docker run --env BASE_URL=https://staging.clinica.test --rm --env RECEPCIONISTA_CLAVE=clave-de-prueba agenda-e2e npx playwright test --grep=@smoke", "docker run --env BASE_URL=https://staging.clinica.test --rm --env RECEPCIONISTA_CLAVE=clave-de-prueba agenda-e2e npx playwright test -g \"@smoke\"", "docker run --env BASE_URL=https://staging.clinica.test --rm --env RECEPCIONISTA_CLAVE=clave-de-prueba agenda-e2e npx playwright test -g @smoke", "docker run --env RECEPCIONISTA_CLAVE=clave-de-prueba --env BASE_URL=https://staging.clinica.test --rm agenda-e2e npx playwright test --grep \"@smoke\"", "docker run --env RECEPCIONISTA_CLAVE=clave-de-prueba --env BASE_URL=https://staging.clinica.test --rm agenda-e2e npx playwright test --grep '@smoke'", "docker run --env RECEPCIONISTA_CLAVE=clave-de-prueba --env BASE_URL=https://staging.clinica.test --rm agenda-e2e npx playwright test --grep @smoke", "docker run --env RECEPCIONISTA_CLAVE=clave-de-prueba --env BASE_URL=https://staging.clinica.test --rm agenda-e2e npx playwright test --grep=@smoke", "docker run --env RECEPCIONISTA_CLAVE=clave-de-prueba --env BASE_URL=https://staging.clinica.test --rm agenda-e2e npx playwright test -g \"@smoke\"", "docker run --env RECEPCIONISTA_CLAVE=clave-de-prueba --env BASE_URL=https://staging.clinica.test --rm agenda-e2e npx playwright test -g @smoke", "docker run --env RECEPCIONISTA_CLAVE=clave-de-prueba --rm --env BASE_URL=https://staging.clinica.test agenda-e2e npx playwright test --grep \"@smoke\"", "docker run --env RECEPCIONISTA_CLAVE=clave-de-prueba --rm --env BASE_URL=https://staging.clinica.test agenda-e2e npx playwright test --grep '@smoke'", "docker run --env RECEPCIONISTA_CLAVE=clave-de-prueba --rm --env BASE_URL=https://staging.clinica.test agenda-e2e npx playwright test --grep @smoke", "docker run --env RECEPCIONISTA_CLAVE=clave-de-prueba --rm --env BASE_URL=https://staging.clinica.test agenda-e2e npx playwright test --grep=@smoke", "docker run --env RECEPCIONISTA_CLAVE=clave-de-prueba --rm --env BASE_URL=https://staging.clinica.test agenda-e2e npx playwright test -g \"@smoke\"", "docker run --env RECEPCIONISTA_CLAVE=clave-de-prueba --rm --env BASE_URL=https://staging.clinica.test agenda-e2e npx playwright test -g @smoke", "docker run --rm --env BASE_URL=https://staging.clinica.test --env RECEPCIONISTA_CLAVE=clave-de-prueba agenda-e2e npx playwright test --grep \"@smoke\"", "docker run --rm --env BASE_URL=https://staging.clinica.test --env RECEPCIONISTA_CLAVE=clave-de-prueba agenda-e2e npx playwright test --grep '@smoke'", "docker run --rm --env BASE_URL=https://staging.clinica.test --env RECEPCIONISTA_CLAVE=clave-de-prueba agenda-e2e npx playwright test --grep @smoke", "docker run --rm --env BASE_URL=https://staging.clinica.test --env RECEPCIONISTA_CLAVE=clave-de-prueba agenda-e2e npx playwright test --grep=@smoke", "docker run --rm --env BASE_URL=https://staging.clinica.test --env RECEPCIONISTA_CLAVE=clave-de-prueba agenda-e2e npx playwright test -g \"@smoke\"", "docker run --rm --env BASE_URL=https://staging.clinica.test --env RECEPCIONISTA_CLAVE=clave-de-prueba agenda-e2e npx playwright test -g @smoke", "docker run --rm --env RECEPCIONISTA_CLAVE=clave-de-prueba --env BASE_URL=https://staging.clinica.test agenda-e2e npx playwright test --grep \"@smoke\"", "docker run --rm --env RECEPCIONISTA_CLAVE=clave-de-prueba --env BASE_URL=https://staging.clinica.test agenda-e2e npx playwright test --grep '@smoke'", "docker run --rm --env RECEPCIONISTA_CLAVE=clave-de-prueba --env BASE_URL=https://staging.clinica.test agenda-e2e npx playwright test --grep @smoke", "docker run --rm --env RECEPCIONISTA_CLAVE=clave-de-prueba --env BASE_URL=https://staging.clinica.test agenda-e2e npx playwright test --grep=@smoke", "docker run --rm --env RECEPCIONISTA_CLAVE=clave-de-prueba --env BASE_URL=https://staging.clinica.test agenda-e2e npx playwright test -g \"@smoke\"", "docker run --rm --env RECEPCIONISTA_CLAVE=clave-de-prueba --env BASE_URL=https://staging.clinica.test agenda-e2e npx playwright test -g @smoke", "docker run --rm -e BASE_URL=https://staging.clinica.test -e RECEPCIONISTA_CLAVE=clave-de-prueba agenda-e2e npx playwright test --grep \"@smoke\"", "docker run --rm -e BASE_URL=https://staging.clinica.test -e RECEPCIONISTA_CLAVE=clave-de-prueba agenda-e2e npx playwright test --grep '@smoke'", "docker run --rm -e BASE_URL=https://staging.clinica.test -e RECEPCIONISTA_CLAVE=clave-de-prueba agenda-e2e npx playwright test --grep @smoke", "docker run --rm -e BASE_URL=https://staging.clinica.test -e RECEPCIONISTA_CLAVE=clave-de-prueba agenda-e2e npx playwright test --grep=@smoke", "docker run --rm -e BASE_URL=https://staging.clinica.test -e RECEPCIONISTA_CLAVE=clave-de-prueba agenda-e2e npx playwright test -g \"@smoke\"", "docker run --rm -e BASE_URL=https://staging.clinica.test -e RECEPCIONISTA_CLAVE=clave-de-prueba agenda-e2e npx playwright test -g @smoke", "docker run --rm -e RECEPCIONISTA_CLAVE=clave-de-prueba -e BASE_URL=https://staging.clinica.test agenda-e2e npx playwright test --grep \"@smoke\"", "docker run --rm -e RECEPCIONISTA_CLAVE=clave-de-prueba -e BASE_URL=https://staging.clinica.test agenda-e2e npx playwright test --grep '@smoke'", "docker run --rm -e RECEPCIONISTA_CLAVE=clave-de-prueba -e BASE_URL=https://staging.clinica.test agenda-e2e npx playwright test --grep @smoke", "docker run --rm -e RECEPCIONISTA_CLAVE=clave-de-prueba -e BASE_URL=https://staging.clinica.test agenda-e2e npx playwright test --grep=@smoke", "docker run --rm -e RECEPCIONISTA_CLAVE=clave-de-prueba -e BASE_URL=https://staging.clinica.test agenda-e2e npx playwright test -g \"@smoke\"", "docker run --rm -e RECEPCIONISTA_CLAVE=clave-de-prueba -e BASE_URL=https://staging.clinica.test agenda-e2e npx playwright test -g @smoke", "docker run -e BASE_URL=https://staging.clinica.test --rm -e RECEPCIONISTA_CLAVE=clave-de-prueba agenda-e2e npx playwright test --grep \"@smoke\"", "docker run -e BASE_URL=https://staging.clinica.test --rm -e RECEPCIONISTA_CLAVE=clave-de-prueba agenda-e2e npx playwright test --grep '@smoke'", "docker run -e BASE_URL=https://staging.clinica.test --rm -e RECEPCIONISTA_CLAVE=clave-de-prueba agenda-e2e npx playwright test --grep @smoke", "docker run -e BASE_URL=https://staging.clinica.test --rm -e RECEPCIONISTA_CLAVE=clave-de-prueba agenda-e2e npx playwright test --grep=@smoke", "docker run -e BASE_URL=https://staging.clinica.test --rm -e RECEPCIONISTA_CLAVE=clave-de-prueba agenda-e2e npx playwright test -g \"@smoke\"", "docker run -e BASE_URL=https://staging.clinica.test --rm -e RECEPCIONISTA_CLAVE=clave-de-prueba agenda-e2e npx playwright test -g @smoke", "docker run -e BASE_URL=https://staging.clinica.test -e RECEPCIONISTA_CLAVE=clave-de-prueba --rm agenda-e2e npx playwright test --grep \"@smoke\"", "docker run -e BASE_URL=https://staging.clinica.test -e RECEPCIONISTA_CLAVE=clave-de-prueba --rm agenda-e2e npx playwright test --grep '@smoke'", "docker run -e BASE_URL=https://staging.clinica.test -e RECEPCIONISTA_CLAVE=clave-de-prueba --rm agenda-e2e npx playwright test --grep @smoke", "docker run -e BASE_URL=https://staging.clinica.test -e RECEPCIONISTA_CLAVE=clave-de-prueba --rm agenda-e2e npx playwright test --grep=@smoke", "docker run -e BASE_URL=https://staging.clinica.test -e RECEPCIONISTA_CLAVE=clave-de-prueba --rm agenda-e2e npx playwright test -g \"@smoke\"", "docker run -e BASE_URL=https://staging.clinica.test -e RECEPCIONISTA_CLAVE=clave-de-prueba --rm agenda-e2e npx playwright test -g @smoke", "docker run -e RECEPCIONISTA_CLAVE=clave-de-prueba --rm -e BASE_URL=https://staging.clinica.test agenda-e2e npx playwright test --grep \"@smoke\"", "docker run -e RECEPCIONISTA_CLAVE=clave-de-prueba --rm -e BASE_URL=https://staging.clinica.test agenda-e2e npx playwright test --grep '@smoke'", "docker run -e RECEPCIONISTA_CLAVE=clave-de-prueba --rm -e BASE_URL=https://staging.clinica.test agenda-e2e npx playwright test --grep @smoke", "docker run -e RECEPCIONISTA_CLAVE=clave-de-prueba --rm -e BASE_URL=https://staging.clinica.test agenda-e2e npx playwright test --grep=@smoke", "docker run -e RECEPCIONISTA_CLAVE=clave-de-prueba --rm -e BASE_URL=https://staging.clinica.test agenda-e2e npx playwright test -g \"@smoke\"", "docker run -e RECEPCIONISTA_CLAVE=clave-de-prueba --rm -e BASE_URL=https://staging.clinica.test agenda-e2e npx playwright test -g @smoke", "docker run -e RECEPCIONISTA_CLAVE=clave-de-prueba -e BASE_URL=https://staging.clinica.test --rm agenda-e2e npx playwright test --grep \"@smoke\"", "docker run -e RECEPCIONISTA_CLAVE=clave-de-prueba -e BASE_URL=https://staging.clinica.test --rm agenda-e2e npx playwright test --grep '@smoke'", "docker run -e RECEPCIONISTA_CLAVE=clave-de-prueba -e BASE_URL=https://staging.clinica.test --rm agenda-e2e npx playwright test --grep @smoke", "docker run -e RECEPCIONISTA_CLAVE=clave-de-prueba -e BASE_URL=https://staging.clinica.test --rm agenda-e2e npx playwright test --grep=@smoke", "docker run -e RECEPCIONISTA_CLAVE=clave-de-prueba -e BASE_URL=https://staging.clinica.test --rm agenda-e2e npx playwright test -g \"@smoke\"", "docker run -e RECEPCIONISTA_CLAVE=clave-de-prueba -e BASE_URL=https://staging.clinica.test --rm agenda-e2e npx playwright test -g @smoke"],
    hint: 'Es `docker run` con la opción que borra el contenedor, un `-e` por cada variable, el nombre de la imagen y el comando de Playwright.',
    output: 'Running 3 tests using 2 workers\n  ✓  1 [setup] › tests/auth.setup.ts:2:6 › ingresar como recepcionista (0ms)\n  ✓  3 [chromium] › tests/pacientes.spec.ts:4:7 › Pacientes › buscar un paciente por DNI @smoke @p0 @pacientes (43ms)\n  ✓  2 [chromium] › tests/agenda.spec.ts:4:7 › Agenda › reservar el primer horario libre @smoke @p0 @agenda (41ms)\n  3 passed (507ms)',
  },
];
export const DOCKER_EXPLANATION =
  '`docker images` muestra qué versiones ya están bajadas; `docker build -t` arma la imagen de la suite; y `docker run --rm -e` la corre con las variables que no viajan en la imagen. El comando del final reemplaza al `CMD` del Dockerfile.';

export const DOCKER_QUIZ: QuizQuestion[] = [
  {
    question: 'Para probar rápido, corriste la suite en la imagen de Playwright con -v "$PWD":/work, usando tu node_modules de macOS. Un paquete de la suite falla con: You installed esbuild for another platform than the one you\'re currently using. ¿Qué corresponde?',
    options: [
      {text: 'Reinstalar las dependencias en tu Mac con `npm ci` y volver a montar la carpeta.', correct: false, why: 'Se vuelven a instalar para macOS: el contenedor sigue siendo Linux.'},
      {text: 'Instalar las dependencias dentro de la imagen, con `RUN npm ci` en un Dockerfile, y dejar node_modules en el .dockerignore.', correct: true, why: 'Los paquetes con partes nativas se instalan para el sistema donde corren: dentro de la imagen, Linux.'},
      {text: 'Cambiar a una imagen de Playwright más nueva.', correct: false, why: 'El problema no es la versión de Playwright: es un node_modules instalado para otro sistema operativo.'},
    ],
  },
  {
    question: 'Actualizaste @playwright/test a 1.65.0 y CI, que usa la imagen v1.64.1-noble, falla con Executable doesn\'t exist y el aviso Please update docker image as well. ¿Qué corresponde?',
    options: [
      {text: 'Volver a 1.64.1, porque la imagen nueva todavía no es estable.', correct: false, why: 'El aviso no dice nada de estabilidad: solo que las versiones no coinciden.'},
      {text: 'Agregar `npx playwright install` en el workflow.', correct: false, why: 'Funcionaría, pero se pierde lo que da la imagen: un entorno fijo y la misma versión en todas partes.'},
      {text: 'Cambiar la imagen a v1.65.0-noble, en el mismo cambio que actualizó el paquete.', correct: true, why: 'Cada versión de Playwright usa sus navegadores: la etiqueta de la imagen acompaña a la del paquete.'},
    ],
  },
  {
    question: 'El test visual del comprobante pasa en tu Mac y en CI falla con: A snapshot doesn\'t exist at .../comprobante-chromium-linux.png, writing actual. ¿Qué falta?',
    options: [
      {text: 'Bajar el umbral de diferencia permitido.', correct: false, why: 'No hay ninguna comparación que tolerar: la referencia de Linux no existe.'},
      {text: 'Generar la referencia -linux dentro del contenedor, con --update-snapshots, y versionarla.', correct: true, why: 'CI corre en Linux y compara contra `-linux.png`. Generarla en el contenedor da exactamente lo que CI va a ver.'},
      {text: 'Renombrar comprobante-chromium-darwin.png a -linux.png.', correct: false, why: 'macOS y Linux dibujan distinto: la imagen renombrada fallaría la comparación.'},
    ],
  },
];
