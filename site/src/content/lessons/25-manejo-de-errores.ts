import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';

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

export const PRACTICE_RULE_LABELS = [
  'Envuelve código que no puede fallar, sin necesidad',
  'Muestra un mensaje genérico y descarta el error real',
  'El try abarca demasiadas operaciones, no queda claro cuál falló',
];

export const PRACTICE_LINES: CodeLine[] = [
  {
    code: "try {\n  const perfil = await obtenerPerfil(id);\n  mostrar(perfil);\n} catch (error) {\n  console.log('No se pudo cargar el perfil:', error);\n}",
    rule: 0,
    why: '`mostrar(perfil)` depende de lo que devolvió `obtenerPerfil`, así que están relacionados. El `catch` registra el error real: el manejo sirve.',
  },
  {
    code: "try {\n  const usuario = await obtenerUsuario(id);\n  const pedidos = await obtenerPedidosDe(id);\n  const resumen = calcularResumen(pedidos);\n  await guardarResumen(usuario.id, resumen);\n} catch (error) {\n  console.log('Error en el proceso:', error);\n}",
    rule: 3,
    why: "Aunque el `catch` registra el error, el `try` mezcla cuatro pasos con causas distintas: si falla, el mensaje 'Error en el proceso' no dice si fue el usuario, los pedidos o el guardado. Envolver cada operación riesgosa por separado daría un diagnóstico claro.",
    hint: 'Si algo falla, ¿el mensaje alcanza para saber cuál de los cuatro pasos fue?',
  },
  {
    code: "try {\n  await enviarFactura(pedido);\n} catch {\n  console.log('No se pudo enviar la factura');\n}",
    rule: 2,
    why: 'El mensaje dice qué operación falló, pero descarta el error real: no queda el código HTTP, el mensaje de la excepción ni el stack. Ante el mismo texto, no se puede distinguir un timeout de un rechazo del servidor.',
    hint: '¿Qué información sobre la causa del fallo queda después de este `catch`?',
  },
  {
    code: "try {\n  const datos = await obtenerDatos();\n} catch (error) {\n  console.log('Falló obtenerDatos:', error);\n}\ntry {\n  const config = JSON.parse(texto);\n} catch (error) {\n  console.log('Falló el parseo de config:', error);\n}",
    rule: 0,
    why: 'Cada operación riesgosa tiene su propio `try`/`catch` y su mensaje identifica cuál falló. Los errores se registran completos, así que el diagnóstico es directo.',
  },
  {
    code: "try {\n  const subtotal = precio * cantidad;\n  const total = subtotal * 1.21;\n  return total;\n} catch (error) {\n  console.log('Error al calcular el total:', error);\n}",
    rule: 1,
    why: 'Multiplicar números no puede fallar por un motivo externo: no hay red, ni datos con formato inesperado. El `try` sugiere un riesgo que no existe y agrega ruido al código.',
    hint: '¿Esta operación puede fallar por algo que venga de afuera, o siempre da un resultado?',
  },
  {
    code: "try {\n  return JSON.parse(texto);\n} catch (error) {\n  console.warn('El texto no es JSON válido:', error);\n  return null;\n}",
    rule: 0,
    why: '`JSON.parse` sí puede fallar con un texto inesperado, y el `catch` registra el error real antes de devolver un valor de respaldo. El manejo es necesario y específico.',
  },
  {
    code: "try {\n  const usuario = await obtenerUsuario(id);\n  const facturas = await obtenerFacturas(id);\n  await enviarRecordatorio(usuario.email, facturas);\n} catch (error) {\n  console.log('No se pudo enviar el recordatorio:', error);\n}",
    rule: 3,
    why: 'Si falla `obtenerUsuario` o `obtenerFacturas`, el mensaje igual culpa al envío del recordatorio. El `try` abarca tres pasos y el texto del `catch` solo describe el último, así que orienta mal el diagnóstico.',
    hint: '¿El mensaje del `catch` describe todas las operaciones que están adentro del `try`?',
  },
  {
    code: "try {\n  const nombreNormalizado = nombre.trim().toLowerCase();\n} catch (error) {\n  console.log('Error al normalizar el nombre:', error);\n}",
    rule: 1,
    why: '`trim` y `toLowerCase` sobre un `string` no fallan por un motivo externo. Envolverlos en `try`/`catch` no protege de nada real y hace parecer que hay un riesgo que no existe.',
    hint: '¿Qué operación de este bloque puede fallar por algo externo, como la red o un archivo?',
  },
];

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
