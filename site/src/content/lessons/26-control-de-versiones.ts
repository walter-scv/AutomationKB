import type {FillBlankSlot} from '@site/src/components/FillBlank';
import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';
import type {DecisionNode} from '@site/src/components/DecisionPath';

export const GIT_VS_GITHUB_RULE_LABELS = ['Es una función de GitHub (la plataforma)'];

export const GIT_VS_GITHUB_LINES: CodeLine[] = [
  {
    code: 'Hacer tres commits en una rama mientras viajás en un avión, sin conexión a internet.',
    rule: 0,
    why: 'Crear ramas y confirmar commits son operaciones sobre el repositorio local: Git no necesita consultar ningún servidor para eso. La conexión recién hace falta para subir el trabajo.',
    hint: '¿Confirmar un commit necesita contactar algún servidor?',
  },
  {
    code: 'Aprobar el cambio de un compañero desde la pestaña "Files changed" del repositorio, antes de mergearlo.',
    rule: 1,
    why: 'La revisión y aprobación de un cambio en una pestaña web es una función de la plataforma que aloja el repositorio. Git, en tu máquina, no tiene pestañas ni un botón de aprobar.',
    hint: '¿Esa pestaña existe en la terminal, o solo en el sitio web donde está alojado el repositorio?',
  },
  {
    code: 'Crear la etiqueta `v1.2.0` sobre el último commit con `git tag v1.2.0`, antes de conectarse a internet.',
    rule: 0,
    why: '`git tag` crea una referencia sobre el repositorio local; no se publica en ningún lado hasta hacer `git push --tags`.',
    hint: '¿Crear un tag local necesita conexión a algún servidor?',
  },
  {
    code: 'Abrir un Issue para reportar un bug que encontraste en producción, antes de empezar a arreglarlo.',
    rule: 1,
    why: 'Los Issues son un sistema de seguimiento que agrega la plataforma para registrar bugs y tareas. Un repositorio Git por sí solo no tiene Issues.',
    hint: '¿Ese sistema de reporte de bugs existe en un repositorio Git sin plataforma encima, o es algo que suma el sitio?',
  },
  {
    code: 'Borrar con `git branch -d feature/login` una rama que ya se mergeó, sin abrir el navegador.',
    rule: 0,
    why: '`git branch -d` trabaja sobre las ramas del repositorio local. Que la rama ya esté mergeada es lo que hace segura la operación; el navegador no participa.',
    hint: '¿Borrar una rama local requiere abrir el navegador?',
  },
  {
    code: 'Asignarle un bug a un compañero desde la lista de tareas del proyecto, para que le llegue la notificación.',
    rule: 1,
    why: 'La lista de tareas, las asignaciones y las notificaciones son herramientas de colaboración que agrega la plataforma. Un repositorio Git por sí solo no tiene usuarios ni tareas a los que asignar.',
    hint: '¿Esa lista de tareas y esas notificaciones existen en un repositorio Git sin plataforma encima?',
  },
  {
    code: 'Deshacer el último commit con `git reset --soft HEAD~1`, mientras el router sigue reiniciando.',
    rule: 0,
    why: '`git reset` reescribe el historial del repositorio local: no publica ni descarga nada del remoto, así que funciona igual con o sin conexión.',
    hint: '¿`git reset` sube o baja algo del servidor, o solo reescribe el historial que ya tenías guardado?',
  },
  {
    code: 'Configurar una regla para que nadie pueda hacer push directo a `main` sin pasar por un Pull Request.',
    rule: 1,
    why: 'Las reglas de protección de rama son una configuración de la plataforma sobre el repositorio alojado. Git, en tu máquina, no tiene ningún concepto de "rama protegida".',
    hint: '¿Esa regla vive en un archivo de tu repositorio local, o en la configuración del repositorio en la plataforma?',
  },
  {
    code: 'Ver con `git log --oneline` los últimos commits de un archivo, en la terminal y sin conexión.',
    rule: 0,
    why: 'El historial de commits está en el repositorio local. `git log` lo lee de ahí, así que funciona igual con o sin internet.',
    hint: '¿`git log` necesita contactar algún servidor para mostrar el historial?',
  },
];

export const START_START = 'cuando';
export const START_NODES: Record<string, DecisionNode> = {
  cuando: {
    id: 'cuando',
    situation: 'Arrancás un proyecto nuevo: por ahora son dos archivos y una idea. ¿Cuándo empezás a usar control de versiones?',
    options: [
      {
        text: 'Cuando el proyecto esté más armado; mientras tanto, guardo copias como `app_v1.ts` y `app_v2.ts`.',
        correct: false,
        why: 'Lo que pasa antes de empezar a versionar no se puede reconstruir después, y las copias con nombre no dicen qué cambió entre una y otra.',
      },
      {
        text: 'Ahora: inicializo el repositorio con estos dos archivos.',
        correct: true,
        why: 'El historial solo cubre lo que pasa después de empezar: cuanto antes, más historia útil.',
        next: 'env',
      },
      {
        text: 'Cuando se sume otra persona al proyecto, que es cuando hace falta compartir.',
        correct: false,
        why: 'El control de versiones sirve aunque trabajes solo: para volver a un estado anterior o saber qué cambió y cuándo.',
      },
    ],
  },
  env: {
    id: 'env',
    situation: 'Antes del primer commit, aparece un archivo `.env` con la clave real de la API de pagos. ¿Qué hacés?',
    options: [
      {
        text: 'Lo incluyo en el commit y lo borro en el siguiente, cuando el proyecto ya esté andando.',
        correct: false,
        why: 'Una vez que algo entra al historial, queda ahí aunque se borre después: cualquiera con acceso al repo puede recuperar la clave.',
      },
      {
        text: 'Lo agrego al `.gitignore` y versiono un `.env.example` con las claves vacías.',
        correct: true,
        why: 'La credencial nunca entra al historial, y quien clone el repo sabe qué variables tiene que completar.',
        next: 'remoto',
      },
      {
        text: 'Lo renombro a `env.txt` para que Git no lo reconozca como configuración.',
        correct: false,
        why: 'Git versiona cualquier archivo que no esté excluido, se llame como se llame. Renombrarlo no lo protege.',
      },
    ],
  },
  remoto: {
    id: 'remoto',
    situation: 'Terminás el día con cinco commits nuevos, que por ahora solo existen en tu laptop. ¿Qué hacés?',
    options: [
      {
        text: 'Los subo al repositorio remoto.',
        correct: true,
        why: 'El remoto es el respaldo: si la laptop se rompe o se pierde, el historial sigue a salvo y el equipo lo puede ver.',
      },
      {
        text: 'Además de commitear, le mando un `.zip` del proyecto al equipo por chat, por las dudas.',
        correct: false,
        why: 'Compartir "por las dudas" por otro canal es no confiar en el control de versiones como fuente de verdad, y crea copias que nadie sabe cuál es la buena.',
      },
      {
        text: 'Nada: los subo todos juntos cuando termine la funcionalidad, dentro de unas semanas.',
        correct: false,
        why: 'Mientras tanto, todo el trabajo vive en una sola máquina, sin respaldo.',
      },
    ],
  },
};
export const START_EXPLANATION =
  'Versionar desde el primer archivo, dejar afuera del historial lo que no tiene que estar (credenciales, archivos generados) y subir el trabajo al remoto con frecuencia: así el control de versiones es la única fuente de verdad del proyecto.';

export const CLOSING_QUIZ: QuizQuestion[] = [
  {
    question: 'Estás en un avión sin wifi y necesitás ver exactamente qué líneas cambiaron entre dos commits que ya tenés descargados. ¿Qué podés hacer?',
    options: [
      {text: 'Nada hasta tener conexión: `git diff` necesita consultar GitHub para comparar commits.', correct: false, why: 'Git compara los commits contra el historial local; no necesita GitHub para eso. La conexión solo haría falta para traer commits que no tenés.'},
      {text: 'Usar `git log` para ver el listado y esperar a tener conexión para ver las líneas.', correct: false, why: '`git log` muestra autores y mensajes, pero el contenido línea por línea de un cambio también está en el repositorio local: `git diff` lo puede mostrar sin conexión.'},
      {text: 'Correr `git diff <commit1> <commit2>`: los dos commits ya están en tu repositorio local.', correct: true, why: '`git diff` compara dos estados que ya tenés guardados. Si los commits fueron descargados antes, la comparación funciona sin red.'},
    ],
  },
];

export const SETUP_TEMPLATE = `$ {{donde}}
/Users/tomas
$ {{mover}} proyectos
$ git {{cfg}} --global user.email "tomas@estudio.com"
$ git {{traer}} https://github.com/estudio/turnos-web.git
Cloning into 'turnos-web'...
$ cd turnos-web`;
export const SETUP_SLOTS: FillBlankSlot[] = [
  {id: 'donde', answer: 'pwd'},
  {id: 'mover', answer: 'cd'},
  {id: 'cfg', answer: 'config'},
  {id: 'traer', answer: 'clone'},
];
export const SETUP_BANK = ['ls', 'clone', 'pwd', 'init', 'cd', 'pull', 'config', '--version'];
export const SETUP_EXPLANATION =
  '`pwd` muestra en qué carpeta está la terminal, y `cd` entra a otra. `git config --global` guarda la identidad que va a quedar grabada en cada commit. `git clone` descarga el proyecto con todo su historial en una carpeta nueva; `init` crearía un repositorio vacío y `pull` necesita un repositorio que ya exista.';
