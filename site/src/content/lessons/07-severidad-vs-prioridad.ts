import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';

export const SEVERITY_RULE_LABELS = ['Severidad alta con prioridad baja', 'Severidad baja con prioridad alta'];

export const SEVERITY_LINES: CodeLine[] = [
  {
    code: 'El panel de métricas redondea el total de pedidos del mes y muestra "12.480,00" en vez de "12.480"; el número que se usa para los reportes es el correcto.',
    rule: 2,
    why: 'Nada se rompe y el dato de fondo es correcto, así que la severidad es baja. Pero es la primera cifra que ve gerencia cada mañana y parece un error de cálculo: la prioridad sube por el ruido y la desconfianza que genera.',
    hint: '¿Cuánta gente mira esa cifra todos los días y qué conclusión saca al verla?',
  },
  {
    code: 'Un botón de "Guardar" tarda medio segundo más de lo esperado en el alta de usuarios, pero guarda bien; el equipo lo anota como mejora para el próximo trimestre.',
    rule: 0,
    why: 'La demora no impide completar el alta y no crece con el uso. Severidad baja y prioridad baja coinciden: postergarlo no deja nada roto.',
    hint: '¿Este defecto impide completar la tarea, y lo ve mucha gente?',
  },
  {
    code: 'Un error borra el historial de un usuario si dos pestañas guardan el mismo formulario en el mismo segundo; en 14 meses hay dos reportes.',
    rule: 1,
    why: 'Si ocurre, se pierden datos, así que la severidad es alta. La frecuencia es mínima y hay dos casos en más de un año, por eso corregirlo ya mismo compite con cosas que afectan a más gente.',
    hint: '¿Qué muestran los 14 meses de reportes sobre la probabilidad de que vuelva a pasar?',
  },
  {
    code: 'Un tooltip tapa el ícono de ayuda en pantallas de 320 px; nadie lo reportó y el equipo lo agenda para cuando rediseñen esa vista.',
    rule: 0,
    why: 'Es un detalle visual en un tamaño de pantalla poco usado y sin impacto funcional. Severidad baja y prioridad baja coinciden.',
    hint: '¿Este defecto es grave técnicamente, o lo ve mucha gente?',
  },
  {
    code: 'Una cuenta creada con un email de dominio ".museum" no puede recuperar la contraseña porque el envío falla; el equipo tiene reportes de esas 2 cuentas entre 40.000 usuarios.',
    rule: 1,
    why: 'La recuperación queda inutilizable para esas cuentas, así que la severidad es alta. Pero son 2 casos conocidos sobre 40.000: no compite con defectos que alcanzan a miles.',
    hint: '¿Cuántas cuentas concretas reportaron el problema?',
  },
  {
    code: 'El email de bienvenida saluda con el nombre viejo de la app, que cambió hace dos releases, y le llega a cada persona que se registra.',
    rule: 2,
    why: 'No rompe el registro, así que la severidad es baja. Pero lo recibe el 100% de los nuevos usuarios y contradice la marca: la prioridad sube por alcance y por imagen.',
    hint: '¿A quién le llega ese email y con qué frecuencia?',
  },
  {
    code: 'Un informe interno que solo abre el equipo de datos una vez al mes tiene una columna desalineada; queda en la lista general de pendientes.',
    rule: 0,
    why: 'El informe se lee poco, no se usa para operar y el defecto es de presentación. Severidad baja y prioridad baja coinciden.',
    hint: '¿Cuánta gente ve este informe, y qué tan grave es el defecto?',
  },
];

export const PRACTICE_RULE_LABELS = ['Copia el número de severidad en la prioridad sin analizar', 'Prioriza solo por visibilidad, ignora la gravedad real', 'Ordena por gravedad e ignora la frecuencia con la que ocurre'];

export const PRACTICE_LINES: CodeLine[] = [
  {
    code: 'El equipo ordena la lista de pendientes por severidad, de mayor a menor, y no consulta la columna de frecuencia semanal aunque está completa en cada ticket.',
    rule: 3,
    why: 'El criterio es la gravedad técnica, pero la urgencia depende también de cuánta gente lo sufre. Un defecto grave y raro puede quedar arriba de uno moderado que aparece todos los días.',
    hint: '¿Qué dato del ticket queda sin usar al ordenar la lista?',
  },
  {
    code: 'Un defecto que corrompe datos aparece una vez cada 50.000 operaciones; el equipo lo deja en prioridad media y revisa cada mes si la frecuencia subió.',
    rule: 0,
    why: 'La severidad es alta, pero la prioridad media se justifica por la frecuencia y por el seguimiento mensual. No es igualar las dos dimensiones: es decidir con el dato real.',
    hint: '¿Se está usando el dato de frecuencia para decidir, o se ignora?',
  },
  {
    code: 'En la reunión de priorización, el único criterio que se lee en voz alta es "¿qué tan grave es?"; el número de prioridad termina siendo el mismo que el de severidad en todos los tickets.',
    rule: 1,
    why: 'La urgencia se copia de la gravedad sin discutir frecuencia, alcance ni contexto de negocio. Es el atajo de asumir que grave equivale a urgente.',
    hint: '¿Qué otras preguntas de negocio no se están haciendo antes de asignar el número?',
  },
  {
    code: 'El equipo corrige un error de cálculo en el total de una factura antes que un texto desalineado en el pie de página, aunque el texto lo vean todos los usuarios.',
    rule: 0,
    why: 'La visibilidad favorece al texto, pero el impacto de un total mal calculado es mayor. Se prioriza por gravedad real, no por cuánto se nota.',
    hint: '¿Se prioriza por qué tan grave es, o por qué tan visible es?',
  },
  {
    code: 'Se posterga un defecto que duplica el importe de los pedidos con cupón porque ocurre en una pantalla interna que casi nadie ve; se prioriza el logo pixelado de la home.',
    rule: 2,
    why: 'El criterio fue exclusivamente cuánto se ve. El defecto postergado cobra de más y afecta el dinero de quien compra, aunque la pantalla sea interna.',
    hint: '¿Qué le pasa al dinero de un pedido mientras el defecto sigue abierto?',
  },
  {
    code: 'Un bug de severidad alta que ocurre en 1 de cada 200.000 inicios de sesión queda en prioridad baja, con una alerta que avisa si la frecuencia sube.',
    rule: 0,
    why: 'La gravedad es alta, pero la frecuencia real es mínima y el equipo se asegura de enterarse si cambia. Que la prioridad sea baja no significa olvidarlo.',
    hint: '¿Se ignora la gravedad, o se tiene en cuenta junto con la frecuencia?',
  },
  {
    code: 'La prioridad se decide mirando solo el daño posible del defecto; el dato de cuántas veces se repitió por semana está en el reporte, pero nadie lo abre.',
    rule: 3,
    why: 'Se evalúa el peor escenario y se ignora la probabilidad. Dos defectos igual de graves pueden merecer prioridades distintas según cuánto ocurren.',
    hint: '¿Qué información del reporte se está dejando afuera de la decisión?',
  },
];

export const CLOSING_QUIZ: QuizQuestion[] = [
  {
    question:
      'Una tienda cobra bien a todos, pero el comprobante muestra "€" en vez de "$" a los 12.000 usuarios de un país. Ninguna operación falla. ¿Cómo lo clasificás?',
    options: [
      {
        text: 'Severidad baja y prioridad alta: no rompe el cobro, pero lo ven todos los usuarios de ese país y parece un error de dinero.',
        correct: true,
        why: 'El impacto técnico es cosmético; la prioridad sube por alcance y por el tema sensible, aunque el cobro sea correcto.',
      },
      {
        text: 'Severidad alta y prioridad alta: todo lo que toca dinero es urgente.',
        correct: false,
        why: 'Ninguna operación falla y el monto debitado es correcto, así que la severidad no es alta. Lo que sube es la urgencia por la desconfianza que genera en 12.000 personas.',
      },
      {
        text: 'Severidad baja y prioridad baja: si el monto está bien, el símbolo no importa.',
        correct: false,
        why: 'Ignora que el defecto lo ve todo un país y que un símbolo equivocado en un monto genera tickets de soporte y desconfianza.',
      },
    ],
  },
  {
    question: '¿Cuál de estas frases describe una prioridad y no una severidad?',
    options: [
      {
        text: '"Si ocurre, el usuario pierde el carrito completo y tiene que volver a cargarlo."',
        correct: false,
        why: 'Describe el impacto técnico del defecto: eso es severidad, independiente de cuándo convenga arreglarlo.',
      },
      {
        text: '"Conviene arreglarlo esta semana porque lo ve cada visitante nuevo."',
        correct: true,
        why: 'Habla de cuándo corregirlo y por qué, con un argumento de negocio: eso es prioridad.',
      },
      {
        text: '"El sistema queda inutilizable hasta reiniciar el servidor."',
        correct: false,
        why: 'Describe la gravedad del malfuncionamiento en sí: severidad. La urgencia de negocio no aparece en la frase.',
      },
    ],
  },
];
