import type {CodeLine} from '@site/src/components/FindInCode';

export const COMMAND_RULE_LABELS = [
  'Usa `git fetch` cuando la situación pedía compartir commits (`push`)',
  'Usa `git fetch` cuando la situación pedía traer y mezclar (`pull`)',
  'Usa `git pull` cuando la situación pedía `git fetch`',
];

export const COMMAND_LINES: CodeLine[] = [
  {
    code: 'Para revisar qué trae el remoto antes de mezclarlo con su rama, alguien corre `git pull origin main`.',
    rule: 3,
    why: '`git pull` no solo descarga: también mezcla lo que trajo con la rama local. Si el objetivo era revisar primero, la rama ya cambió antes de que la persona pudiera mirar nada.',
    hint: '¿La rama local sigue igual después de este comando, o ya incorporó lo que había en el remoto?',
  },
  {
    code: 'Para partir del último estado del remoto antes de empezar a trabajar, se corre `git pull` sobre main.',
    rule: 0,
    why: 'Antes de arrancar, traer y mezclar los cambios del remoto es lo esperado: se parte de la versión más reciente. `git pull` hace exactamente eso en un paso.',
    hint: '¿Hacía falta solo revisar, o también mezclar los cambios del remoto?',
  },
  {
    code: 'Para compartir tres commits locales con el resto del equipo, alguien corre `git fetch origin`.',
    rule: 1,
    why: '`git fetch` solo baja información del remoto; no sube nada. Los tres commits siguen en la máquina y el equipo no los ve. Para compartirlos hace falta `git push`.',
    hint: '¿Qué dirección tomó el cambio con este comando: de tu máquina al remoto, o al revés?',
  },
  {
    code: 'Después de un `git fetch`, alguien revisa con `git log main..origin/main` qué commits nuevos llegaron y recién ahí decide mergear.',
    rule: 0,
    why: '`git fetch` deja los cambios nuevos en las referencias remotas sin tocar la rama local; después se pueden mirar con `git log main..origin/main` (los commits que están en el remoto y no en tu rama) y decidir. Es el uso seguro de fetch.',
    hint: '¿Este uso de fetch mezcla algo automáticamente, o deja la decisión para después?',
  },
  {
    code: 'Para bajar los commits nuevos del remoto y dejarlos integrados en la rama local en un solo paso, se corre `git fetch`.',
    rule: 2,
    why: '`git fetch` solo descarga: la rama local sigue sin los cambios y no quedaron mezclados. El escenario pedía el paso completo, que es `git pull` (fetch más merge).',
    hint: '¿Después de este comando, la rama local ya tiene los commits nuevos aplicados?',
  },
  {
    code: 'Un push es rechazado porque el remoto avanzó; la persona corre `git pull`, resuelve el conflicto y vuelve a pushear.',
    rule: 0,
    why: 'Cuando el remoto avanzó, el push se rechaza porque quedarían commits afuera. Traerlos con `pull`, resolver lo que choque y volver a pushear es el camino correcto.',
    hint: '¿Este camino integra los cambios del remoto antes de reintentar el push?',
  },
  {
    code: 'Para ver si hay commits nuevos sin tocar el working directory, alguien corre `git pull --rebase`.',
    rule: 3,
    why: '`git pull --rebase` descarga, reescribe los commits locales sobre lo nuevo y puede abrir conflictos: no es una operación de solo lectura. Para mirar sin tocar nada, `git fetch` alcanza.',
    hint: '¿Esta variante deja los commits locales exactamente como estaban?',
  },
];

export const PRACTICE_RULE_LABELS = [
  'Pasó días sin traer los cambios del remoto',
  'Acumuló muchos commits sin compartirlos (`push`)',
  'Confundió "hice commit" con "ya lo compartí"',
  'Forzó el push sin entender por qué fue rechazado',
];

export const PRACTICE_LINES: CodeLine[] = [
  {
    code: 'El push es rechazado porque el remoto tiene commits nuevos; la persona corre `git push --force` para que suba igual.',
    rule: 4,
    why: '`--force` sobrescribe la rama remota con la copia local y puede borrar los commits que llegaron mientras tanto. El rechazo avisa que hay que integrar esos commits primero: `git pull`, resolver y volver a pushear.',
    hint: '¿Qué commits del remoto pueden desaparecer con este comando?',
  },
  {
    code: 'Antes de empezar a trabajar, se corre `git pull` y se revisa que no haya conflictos pendientes.',
    rule: 0,
    why: 'Partir de la última versión del remoto evita descubrir los cambios ajenos recién al hacer push. El chequeo de conflictos cierra el arranque.',
    hint: '¿Se partió de la última versión del remoto antes de seguir trabajando?',
  },
  {
    code: 'Alguien trabaja tres días sin hacer push y acumula doce commits que solo existen en su máquina.',
    rule: 2,
    why: 'Doce commits en un solo lugar: si el disco falla no hay copia en el remoto, y el equipo no puede ver ni revisar el avance. Subirlos seguido evita las dos cosas.',
    hint: '¿Dónde existe ese trabajo además de esa máquina?',
  },
  {
    code: 'Alguien hace commit de un cambio chico y lo deja en local hasta terminar la tarea, que calcula le lleva dos horas.',
    rule: 0,
    why: 'Dos horas de trabajo local no es acumular durante días: el commit existe y se va a compartir dentro de la misma jornada. No hay riesgo relevante de perder días de trabajo.',
    hint: '¿Dos horas sin compartir es lo mismo que acumular varios días de trabajo?',
  },
  {
    code: 'Alguien dice "listo, ya está en el repo" después de hacer `git commit`, sin haber corrido `git push`.',
    rule: 3,
    why: 'El commit vive en el repositorio local; para el resto del equipo todavía no existe. La palabra "repo" tapa la diferencia entre guardado en tu máquina y publicado en el remoto.',
    hint: '¿Qué falta para que ese commit esté en el remoto?',
  },
  {
    code: 'El equipo pasa cuatro días sin `fetch` ni `pull`; al quinto, el primer push de cada uno es rechazado.',
    rule: 1,
    why: 'Cuatro días de commits ajenos se acumularon sin que nadie los mirara. El rechazo es la consecuencia: hay que integrar todo junto, y cualquier conflicto va a ser más grande.',
    hint: '¿Cuánto avanzó el remoto mientras nadie lo miraba?',
  },
  {
    code: 'Después de revisar un commit propio, alguien corre `git push` para compartirlo y avisa en el canal del equipo qué cambió.',
    rule: 0,
    why: 'El push publica el commit en el remoto y el aviso permite que el resto sepa qué hay nuevo. Es el uso esperado: compartir lo propio y no dejar que se acumule.',
    hint: '¿Este commit queda compartido con el equipo, o solo en la máquina local?',
  },
  {
    code: 'Se hace `git push` de cada commit apenas está revisado, aunque la feature siga en progreso en otros archivos.',
    rule: 0,
    why: 'En una rama propia, compartir commits chicos y seguido no publica la feature: deja respaldo y visibilidad. El trabajo incompleto no llega a main hasta el PR.',
    hint: '¿Publicar commits chicos seguido publica la feature incompleta en main?',
  },
];

