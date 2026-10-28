import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';
import type {DecisionNode} from '@site/src/components/DecisionPath';
import type {SpotTokenRound} from '@site/src/components/SpotToken';

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

export const TRIAGE_START = 'criterio';
export const TRIAGE_NODES: Record<string, DecisionNode> = {
  criterio: {
    id: 'criterio',
    situation: 'Arranca la reunión de priorización: hay 30 defectos abiertos y tiempo para corregir 5 esta semana. Cada ticket tiene severidad, frecuencia semanal y en qué pantalla ocurre. ¿Con qué criterio ordenan?',
    options: [
      {
        text: 'Ponerle a cada uno la misma prioridad que su severidad, así nadie discute.',
        correct: false,
        why: 'Copiar el número de severidad en la prioridad es igualarlas por default: se pierde justamente la decisión de negocio.',
      },
      {
        text: 'Combinar gravedad, frecuencia y visibilidad, y dejar escrito el porqué de cada prioridad.',
        correct: true,
        why: 'La prioridad es una decisión de negocio que pesa varias cosas a la vez, y queda justificada para quien la lea después.',
        next: 'importe',
      },
      {
        text: 'Empezar por lo que más usuarios ven, porque es lo que más se nota.',
        correct: false,
        why: 'Priorizar solo por visibilidad deja atrás defectos graves pero poco visibles, hasta que causan un problema serio.',
      },
    ],
  },
  importe: {
    id: 'importe',
    situation: 'Quedan dos candidatos para el último lugar de la semana: uno duplica el importe de los pedidos con cupón en una pantalla interna que usa poca gente; el otro es el logo pixelado de la home. ¿Cuál entra?',
    options: [
      {
        text: 'El logo: lo ve cada visitante y daña la imagen.',
        correct: false,
        why: 'Es más visible, pero el otro cobra mal: un error de dinero que sigue ocurriendo aunque pocos lo vean pesa más.',
      },
      {
        text: 'Ninguno: los dos esperan a la semana que viene para no tomar una decisión apurada.',
        correct: false,
        why: 'Postergar sin criterio no es priorizar: el importe duplicado sigue cobrando mal mientras tanto.',
      },
      {
        text: 'El importe duplicado: ocurre de verdad y afecta dinero, aunque pocos lo vean.',
        correct: true,
        why: 'Gravedad real alta y frecuencia concreta: es urgente aunque la pantalla sea poco visible.',
        next: 'raro',
      },
    ],
  },
  raro: {
    id: 'raro',
    situation: 'Último ticket: un defecto corrompe datos, pero aparece una vez cada 50.000 operaciones. ¿Qué hacen con él?',
    options: [
      {
        text: 'Prioridad media o baja, con el motivo escrito y una revisión periódica de su frecuencia.',
        correct: true,
        why: 'La severidad es alta pero la frecuencia hoy es muy baja; dejarlo justificado y vigilado permite subirlo si las condiciones cambian.',
      },
      {
        text: 'Prioridad máxima: si corrompe datos, va primero que todo.',
        correct: false,
        why: 'Ordenar solo por gravedad ignora la frecuencia: puede consumir la semana algo que casi nunca ocurre, mientras esperan defectos frecuentes.',
      },
      {
        text: 'Prioridad baja y cerrar el tema: casi nunca pasa.',
        correct: false,
        why: 'No volver a mirarlo es el riesgo: si la frecuencia sube (más usuarios, otro contexto), nadie se entera hasta que el daño ya ocurrió.',
      },
    ],
  },
};
export const TRIAGE_EXPLANATION =
  'La prioridad combina gravedad, frecuencia y visibilidad, y se deja escrita: lo visible no siempre va primero, lo grave no siempre es urgente, y lo que hoy es raro se vuelve a mirar.';

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

export const LEVEL_PROMPT = '¿Qué palabra de esta línea está mal asignada?';
export const LEVEL_ROUNDS: SpotTokenRound[] = [
  {
    line: 'Severidad alta: el logo de la home se ve pixelado en pantallas grandes.',
    targetIndex: 1,
    why: 'No rompe ninguna funcionalidad: la severidad es baja. Que lo vea mucha gente puede subirle la prioridad, pero eso es otra dimensión.',
    hint: 'Si esto falla, ¿qué funcionalidad deja de andar?',
  },
  {
    line: 'Prioridad baja: el cobro duplica el importe en cada compra con tarjeta.',
    targetIndex: 1,
    why: 'Pasa en cada compra y afecta dinero: es urgente corregirlo. La prioridad es alta.',
    hint: '¿Qué tan seguido pasa, y qué le cuesta al negocio cada vez que pasa?',
  },
  {
    line: 'Severidad baja: si dos pestañas guardan a la vez, se borra el historial del usuario.',
    targetIndex: 1,
    why: 'Pierde datos del usuario: la severidad es alta aunque casi nunca ocurra. Lo poco frecuente puede bajar la prioridad, no la severidad.',
    hint: 'Cuando ocurre, ¿qué tan grave es el daño?',
  },
];
