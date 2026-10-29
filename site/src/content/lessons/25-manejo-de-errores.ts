import type {CodeLine} from '@site/src/components/FindInCode';
import type {DecisionNode} from '@site/src/components/DecisionPath';
import type {QuizQuestion} from '@site/src/components/Quiz';
import type {BuilderStep} from '@site/src/components/CommandBuilder';

export const TRYCATCH_RULE_LABELS = [
  'Lanza un error nuevo que descarta el original',
  'El `catch` deja seguir el flujo como si no hubiera fallado',
];

export const TRYCATCH_LINES: CodeLine[] = [
  {
    code: "try {\n  const datos = await obtenerDatos();\n  procesar(datos);\n} catch {\n  console.log('seguimos');\n}",
    rule: 2,
    why: "El `catch` no recibe ni registra el error: si `obtenerDatos()` falla, el programa sigue como si nada y el mensaje 'seguimos' no deja rastro de qué pasó. Diagnosticar después es imposible.",
    hint: '¿Queda registrado en algún lado qué falló y por qué?',
  },
  {
    code: 'try {\n  const datos = await obtenerDatos();\n  procesar(datos);\n} catch (error) {\n  throw error;\n}',
    rule: 0,
    why: 'El `catch` no agrega información, pero tampoco la pierde: relanza el error original para que lo maneje quien llamó a esta función. El error real sigue siendo visible.',
  },
  {
    code: 'try {\n  await enviarEmail(destinatario);\n} catch (error) {\n  console.debug(error);\n  return true;\n}',
    rule: 2,
    why: 'Registrar el error y después devolver `true` esconde el fallo: quien llama cree que el email se envió y sigue adelante. El error aparece en la consola, pero el flujo miente.',
    hint: '¿Qué le está diciendo esta función a quien la llama sobre el resultado del envío?',
  },
  {
    code: 'try {\n  await enviarEmail(destinatario);\n} catch (error) {\n  await registrarFallo(error);\n  throw error;\n}',
    rule: 0,
    why: 'Registra el error real para diagnóstico y después lo relanza: quien llamó se entera del fallo y el detalle no se pierde. Es un manejo completo.',
  },
  {
    code: "try {\n  await sincronizarPedidos();\n} catch (error) {\n  throw new Error('No se pudo sincronizar');\n}",
    rule: 1,
    why: 'El error original se descarta: el nuevo mensaje no dice si fue un timeout, un 500 o un problema de datos. Sin `cause` ni el error original, el stack y el detalle se pierden.',
    hint: '¿El error que se lanza conserva la información del que llegó al `catch`?',
  },
  {
    code: "try {\n  const respuesta = await fetch('/api/perfil');\n  if (!respuesta.ok) throw new Error('HTTP ' + respuesta.status);\n  return await respuesta.json();\n} catch (error) {\n  console.log('Falló la carga del perfil:', error);\n}",
    rule: 0,
    why: 'Envuelve operaciones que pueden fallar por red o por una respuesta HTTP con error, y registra el error real con contexto. El mensaje permite saber qué pasó.',
  },
  {
    code: "try {\n  await marcarComoEnviado(pedido.id);\n} catch (error) {\n  console.log('Pedido actualizado');\n}",
    rule: 2,
    why: 'El mensaje afirma que el pedido se actualizó justo en el caso en que la actualización falló. No solo oculta el error: deja un registro que dice lo contrario de lo que pasó.',
    hint: '¿Ese mensaje describe lo que realmente ocurrió cuando se entra al `catch`?',
  },
  {
    code: "try {\n  const config = JSON.parse(texto);\n  aplicar(config);\n} catch (error) {\n  console.warn('Configuración inválida:', error);\n}",
    rule: 0,
    why: '`JSON.parse` puede fallar con un texto inesperado y el `catch` registra el error real. El `try` abarca justo el parseo y la aplicación de lo que salió de él.',
  },
];

export const SAFE_PREFIX = '// enviar la factura; quien llama necesita saber si falló';
export const SAFE_STEPS: BuilderStep[] = [
  {
    options: [
      '\ntry {\n  const total = pedido.subtotal * 1.21;\n  await enviarFactura(pedido, total);\n  await guardarHistorial(pedido);\n  actualizarPantalla();',
      '\nconst total = pedido.subtotal * 1.21;\ntry {\n  await enviarFactura(pedido, total);',
      '\ntry {\n  const total = pedido.subtotal * 1.21;',
    ],
    correct: '\nconst total = pedido.subtotal * 1.21;\ntry {\n  await enviarFactura(pedido, total);',
    hint: '¿Qué línea puede fallar por un motivo externo? El `try` envuelve solo eso.',
  },
  {
    options: [
      "\n} catch {\n  console.log('Algo salió mal');",
      "\n} catch (error) {\n  console.error('No se pudo enviar la factura:', error);",
      '\n} catch (error) {\n  // TODO: manejar esto después',
    ],
    correct: "\n} catch (error) {\n  console.error('No se pudo enviar la factura:', error);",
    hint: 'Si mañana alguien lee el registro, ¿sabe qué falló y por qué?',
  },
  {
    options: ['\n  return;\n}', '\n}', '\n  throw error;\n}'],
    correct: '\n  throw error;\n}',
    hint: 'Releé el comentario de arriba: ¿qué tiene que enterarse quien llamó a esta función?',
  },
];
export const SAFE_EXPLANATION =
  'El cálculo con números no puede fallar por algo externo, así que queda afuera; el `try` envuelve solo el envío. El `catch` registra qué falló con el error real, y `throw error` hace que quien llamó se entere: sin eso, la función terminaría como si hubiera funcionado.';

export const CLOSING_QUIZ: QuizQuestion[] = [
  {
    question: '¿Para qué sirve un bloque `try`/`catch`?',
    options: [
      {
        text: 'Para capturar un fallo en una operación riesgosa sin que el programa entero se detenga.',
        correct: true,
        why: 'El `try` contiene el código que puede fallar; si falla, el `catch` recibe el control y decide qué hacer en vez de cortar la ejecución completa.',
      },
      {
        text: 'Para hacer que una operación riesgosa nunca falle.',
        correct: false,
        why: '`try`/`catch` no evita la falla: la operación sigue pudiendo fallar. Lo que cambia es que el programa tiene una oportunidad de manejarla.',
      },
      {
        text: 'Para que TypeScript revise los tipos de las operaciones que están adentro.',
        correct: false,
        why: 'El chequeo de tipos es independiente de `try`/`catch`. Envolver código no agrega ni quita verificación de tipos.',
      },
    ],
  },
];

export const FLOW_CODE = `async function exportarReporte(): Promise<void> {
  await abrirArchivo();
  try {
    const datos = await obtenerDatos();
    await escribir(datos);
  } catch (error) {
    console.error('Falló la exportación:', error);
    throw error;
  } finally {
    await cerrarArchivo();
  }
}`;
export const FLOW_START = 'falla';
export const FLOW_NODES: Record<string, DecisionNode> = {
  falla: {
    id: 'falla',
    situation: '`abrirArchivo()` funciona, pero `obtenerDatos()` falla. ¿Qué se ejecuta a continuación?',
    options: [
      {
        text: '`await escribir(datos);`',
        correct: false,
        why: 'Cuando una línea del `try` falla, el resto del `try` no se ejecuta: el control salta directo afuera del bloque. Además, `datos` nunca llegó a tener un valor.',
      },
      {
        text: "`console.error('Falló la exportación:', error);`",
        correct: true,
        why: 'El fallo dentro del `try` hace saltar el control al `catch`, que recibe el error en `error`.',
        next: 'relanza',
      },
      {
        text: '`await cerrarArchivo();`',
        correct: false,
        why: 'El `finally` se ejecuta siempre, pero después del `catch`, no en su lugar. Si hay un `catch`, primero se maneja el error ahí.',
      },
    ],
  },
  relanza: {
    id: 'relanza',
    situation: 'Ya se registró el error y se llega a `throw error;`. ¿Qué pasa ahora?',
    options: [
      {
        text: 'Se ejecuta `cerrarArchivo()` y después el error sigue hacia quien llamó a la función.',
        correct: true,
        why: 'El `finally` corre siempre, incluso cuando el `catch` relanza: primero cierra el archivo y recién después el error sale de la función.',
        next: 'llamador',
      },
      {
        text: 'La función se corta en el `throw` y `cerrarArchivo()` no llega a ejecutarse.',
        correct: false,
        why: 'Eso pasaría si no hubiera `finally`. Justamente para esto existe: se ejecuta haya error o no, aunque el `catch` vuelva a lanzar.',
      },
      {
        text: 'El error ya quedó manejado en el `catch`, así que la función termina normalmente.',
        correct: false,
        why: '`throw error` vuelve a lanzar el mismo error: el `catch` lo registró, pero no lo "resolvió". Sigue viaje hacia arriba.',
      },
    ],
  },
  llamador: {
    id: 'llamador',
    situation: 'Otra función hizo `await exportarReporte()`. ¿Qué recibe?',
    options: [
      {
        text: 'Nada, porque la función declara `Promise<void>`.',
        correct: false,
        why: '`void` describe lo que devuelve cuando termina bien. Si la función termina con un error, la Promise se rechaza con ese error, sin importar el tipo de retorno.',
      },
      {
        text: 'Un mensaje genérico, porque el `catch` ya escribió en la consola.',
        correct: false,
        why: 'El `console.error` solo deja registro; no cambia el error. Lo que sale de la función es lo que se lanzó con `throw`.',
      },
      {
        text: 'El mismo error que lanzó `obtenerDatos()`, que puede atrapar con su propio `try/catch`.',
        correct: true,
        why: '`throw error` relanza el error original sin perder la causa, así que quien llamó recibe exactamente ese error.',
      },
    ],
  },
};
export const FLOW_EXPLANATION =
  'El recorrido completo: el fallo corta el `try` y salta al `catch`; el `catch` registra y relanza; el `finally` se ejecuta igual (el archivo queda cerrado); y el error original llega a quien llamó. Así la función limpia lo que abrió sin esconder que falló.';

export const TRACE_CODE = `Error: El monto de la cuota tiene que ser mayor a 0
    at validarMonto (src/pagos/validar.ts:6:11)
    at registrarPago (src/pagos/registrar.ts:23:5)
    at procesarCuota (src/cuotas/procesar.ts:41:9)
    at procesarVencimientos (src/cuotas/vencimientos.ts:12:7)`;
export const STACK_ACCEPTED = ['registrarPago', 'registrarPago()'];
export const STACK_HINTS = [
  'La primera línea «at» es donde ocurrió el error. ¿En qué función está?',
  'El error ocurrió en validarMonto. La traza va de lo más reciente a lo más antiguo: la línea de abajo es quien la llamó.',
  'Escribí solo el nombre de la función de la segunda línea «at».',
];
export const STACK_EXPLANATION =
  'El `throw` ocurrió en `validarMonto` (`validar.ts`, línea 6), y a esa función la llamó `registrarPago` desde la línea 23 de `registrar.ts`. Leída de abajo hacia arriba, la traza cuenta el recorrido: `procesarVencimientos` → `procesarCuota` → `registrarPago` → `validarMonto`. Para debuggear, lo útil es mirar qué monto le pasó `registrarPago`.';
