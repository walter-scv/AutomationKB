// Ejemplo real: prueba mal/bien de una actividad de cada tipo. Correr: node site/scripts/browser/example-all-types.cjs
const L=require('./lib.cjs');
async function classify(p, pairs){
  for (const [t,col] of pairs){
    const chip=p.getByRole('group',{name:'Elementos sin clasificar'}).locator('[draggable]').filter({hasText:t}).first();
    const box=p.locator('[class*=box_]').filter({has:p.locator('[class*=boxLabel]',{hasText:col})}).first();
    await chip.dragTo(box);
  }
  console.log('  cl:', await L.fb(p));
}
async function typedIn(p, ph, wrong, right){ const i=p.getByPlaceholder(ph).first();
  for (const w of wrong){ await i.fill(w); await i.press('Enter'); console.log('  ta ERR:', await L.fb(p)); }
  await i.fill(right); await i.press('Enter'); console.log('  ta end:', await L.fb(p)); }
async function dom(p,label){ const n=await p.locator('[class*=doneMsg], .akb-feedback--ok').count(); console.log('  ['+label+']'); }
(async()=>{
  const {b,p,errs}=await L.open(); const T='testing/', P='programming/', G='git/';
  console.log('01'); await L.go(p,T+'01-que-es-testing','¿Estático, dinámico o del proceso?');
  await classify(p,[['Antes de que se programe','Testing dinámico'],['Antes de que se programe','Testing estático'],['Con la versión de prueba','Testing dinámico'],['Después de tres sprints','Aseguramiento'],['En la revisión del código','Testing estático'],['Se carga una reserva','Testing dinámico'],['El equipo incorpora','Aseguramiento'],['Al revisar el diseño','Testing estático']]);
  console.log('02 match'); await L.go(p,T+'02-testing-vs-debugging','¿En qué estado queda el reporte?');
  await L.match(p,[['Desarrollo subió la corrección','Reabierto'],['El reporte dice que el turno','Rechazado'],['El mismo fallo','Duplicado'],['La corrección ya está','Resuelto'],['Con los pasos y datos','No reproducible']],['La corrección ya está','Reabierto']);
  console.log('02 ms'); await L.go(p,T+'02-testing-vs-debugging','Aislá el fallo y elegí la regresión');
  await L.multi(p,['todos los teléfonos de Movistar'],['sin el prefijo','No depende del código']);
  await L.multi(p,['Repetir la prueba 1'],['ya estaba cargado','Claro y Personal','WhatsApp']);
  console.log('06'); await L.go(p,T+'06-proceso-de-testing','Leé la matriz de trazabilidad');
  await typedIn(p,'Regla sin casos',['R2'],'R3');
  console.log('08'); await L.go(p,T+'08-anatomia-caso-test','Del caso lógico al concreto');
  await L.fill(p,['una cuenta con saldo','$ 10.000','$ 8.000','un mensaje de error'],['0001-5520','$ 10.000','$ 12.000','«Saldo insuficiente»']);
  console.log('09'); await L.go(p,T+'09-caracteristicas-buen-caso','¿Por qué dio distinto?');
  await L.decision(p,[['Que sea repetible','Que sea claro'],['Que sea independiente','Que sea verificable'],['Repetibilidad: da','Independencia'],['Independencia: otro','Repetibilidad: depende']]);
  console.log('12'); await L.go(p,T+'12-decision-table-testing','De la regla a los casos');
  await L.decision(p,[['Asumir que se rechaza','Consultarlo'],['Se eliminan','Se unen en una sola'],['Una sola','Al menos dos'],['Rechazado, porque','Confirmado, con recargo']]);
  console.log('15'); await L.go(p,T+'15-risk-based-testing','¿Cómo se responde a cada riesgo?');
  await L.match(p,[['La fórmula','Mitigar'],['En el modo oscuro','Aceptarlo'],['Los pagos de inscripción','Transferirlo'],['El cambio del servidor','contingencia'],['La única persona','riesgo de proyecto'],['A mitad del ciclo','Volver a evaluar']],['La única persona','Mitigar']);
  console.log('15b'); await L.go(p,T+'15b-repaso-integrador-testing','Las notas del proyecto');
  await L.spot(p,[['Revisar','dinámico.'],[null,'baja.'],['corrección',"Cerrado."],[null,'cualquiera'],[null,'cubierta.']]);
  console.log('16a'); await L.go(p,P+'16a-como-se-ejecuta-el-codigo','¿Quién informa este error?');
  await classify(p,[['reserva.ts:3:7','Lo informa Node'],['reserva.ts:3:7','Lo informa tsc'],['TypeError','Lo informa Node'],['Found 2','Lo informa tsc'],['> const ciudad','Lo informa Node'],['envio.ts:12:5','Lo informa tsc'],['ReferenceError','Lo informa Node']]);
  console.log('16a term'); await L.go(p,P+'16a-como-se-ejecuta-el-codigo','Revisá y ejecutá un archivo');
  await L.term(p,[[null,'node -v'],['npm start','npm install'],[null,'npx tsc --noEmit cuotas.ts'],[null,'npx tsc --noEmit cuotas.ts'],[null,'npx tsx cuotas.ts']]);
  console.log('17'); await L.go(p,P+'17-operadores','Calculá en la consola');
  await L.term(p,[['stock + 5','Number(stock) + 5'],[null,'mesas % 2 === 0'],['envio + seguro','Math.round((envio + seguro) * 100) / 100'],[null,'!codigo']]);
  console.log('17a st'); await L.go(p,P+'17a-strings','El detalle que lo rompe');
  await L.spot(p,[['soloNumeros',"dni.replace('.',"],[null,"'Hola,"],[null,'(email.trim().toUpperCase()'],['archivo.slice(-3,','-1);'],[null,"'reporte.pdf'';"]]);
  console.log('17a ms'); await L.go(p,P+'17a-strings','¿Qué probar en el buscador?');
  await L.multi(p,['GoMeZ'],['tal cual','^GOMEZ$','espacios a los costados','con tilde','solo espacios']);
  console.log('18'); await L.go(p,P+'18-condicionales','¿Qué imprime el switch?');
  await typedIn(p,'Lo que imprime',['B simple'],'BC doble');
  console.log('19'); await L.go(p,P+'19-funciones','Diseñá la función de la etiqueta');
  await L.decision(p,[["sucursal\\?: string",'nombre: string, sucursal: string = .Central.\\): string$'],['Usando texto','Devolviéndolo'],['=> \\{','string => nombre'],['Una sola','armarEtiqueta\\(.Rosa Díaz.\\) y']]);
  console.log('20'); await L.go(p,P+'20-arrays','Cada pregunta con su método');
  await L.match(p,[["¿El talle 'XL'",'talles.includes'],['¿Hay al menos una nota','notas.some'],['¿Son mayores de edad','edades.every'],['La primera temperatura','temperaturas.find'],['Todas las temperaturas','temperaturas.filter'],['Las cantidades','[...cantidades]']],['¿Hay al menos una nota','edades.every']);
  console.log('22'); await L.go(p,P+'22-objetos','Leé la reserva en la consola');
  await L.term(p,[['reserva.cochera.lugar','reserva.cochera?.lugar'],[null,"reserva.cochera?.lugar ?? 'Sin cochera'"],[null,'const {codigo, noches} = reserva'],['reserva === copiaDelSistema','reserva.codigo === copiaDelSistema.codigo']]);
  console.log('23'); await L.go(p,P+'23-interfaces-y-type-aliases','Completá la interface');
  await L.fill(p,['string','?:','number','implements'.replace('implements','|')],['EstadoDeEnvio','?:','number','extends']);
  console.log('23a'); await L.go(p,P+'23a-clases','Cada error con su corrección');
  await L.match(p,[['const prestamo = Prestamo','new Prestamo'],['En el método','this.dias'],['prestamo.multa = 0','pagarMulta'],['prestamo.codigoLibro = ','No reasignarla'],['class PrestamoDigital','super(codigoLibro']],['prestamo.multa = 0','No reasignarla']);
  console.log('23c'); await L.go(p,P+'23c-json','¿La respuesta cumple?');
  await classify(p,[['"id": 2201, "nombre": "Raúl','Tipo incorrecto'],['"id": 2201, "nombre": "Raúl','Cumple'],['"id": "2201"','Tipo incorrecto'],['"id": 2202','Falta un campo'],['"id": 2203','Tipo incorrecto'],['"id": 2204','Falta un campo'],['"id": 2205','Cumple'],['"id": 2206','Tipo incorrecto']]);
  console.log('24'); await L.go(p,P+'24-funciones-asincronas','Mirá la Promise en la consola');
  await L.term(p,[['const consulta = await obtenerEnvio()','const consulta = obtenerEnvio()'],[null,'consulta'],[null,'const envio = await consulta'],['envio','envio.estado']]);
  console.log('25'); await L.go(p,P+'25-manejo-de-errores','Leé la traza');
  await typedIn(p,'Nombre de la función',['validarMonto','procesarCuota'],'registrarPago');
  console.log('25b'); await L.go(p,P+'25b-repaso-integrador-programming','Del síntoma a la causa');
  await L.match(p,[['Con el método de envío','break'],['Donde tendría que verse','antes de la operación'],['La comparación','decimales'],['Al abrir el carrito','Se lee una propiedad'],['Un carrito sin ningún','con un array vacío'],['El encabezado','comillas simples']],['La comparación','antes de la operación']);
  console.log('g26'); await L.go(p,G+'26-control-de-versiones','Prepará la computadora');
  await L.fill(p,['ls','cd','config','init'],['pwd','cd','config','clone']);
  console.log('g27'); await L.go(p,G+'27-como-funciona-git','¿Qué te está diciendo Git?');
  await L.match(p,[['git status lista turnos.ts','preparado: entra completo'],['git status lista README.md','si se confirma ahora'],['git status lista borrador.txt','Es nuevo'],['git status lista agenda.ts','Se agregó con'],['git log muestra','Es el commit sobre'],['Un comando se refiere','commit anterior']],['git status lista agenda.ts','Tiene un cambio']);
  console.log('g30'); await L.go(p,G+'30-ramas','Ordená tus ramas en la terminal');
  await L.term(p,[[null,'git branch'],[null,'git switch main'],[null,'git add reporte.ts'],[null,'git commit -m "Agregar el pie de página al reporte en PDF"'],[null,'git branch -m feature/exportar-pdf feature/exportar-reporte-pdf'],[null,'git switch main'],['git branch -D fix/fecha-vencida','git branch -d fix/fecha-vencida']]);
  console.log('g32'); await L.go(p,G+'32-repositorio-remoto-github','¿Cómo te autenticás?');
  await L.multi(p,['Escribir la contraseña'],['token de acceso personal','Git Credential Manager','ssh-keygen']);
  console.log('g35'); await L.go(p,G+'35-pull-requests','La vida de un Pull Request');
  await L.solveOrder(p,['Abrir el PR como draft para mostrar el avance, con las pruebas todavía pendientes.','Terminadas las pruebas, marcar el PR como «Ready for review».','La revisora deja «Request changes» con dos comentarios.','Subir un commit con las correcciones a la misma rama y marcar cada conversación como resuelta.','La revisora revisa las correcciones y deja «Approve».','Con el PR ya aprobado, GitHub avisa que main cambió en los mismos archivos: git merge origin/main, resolver, probar y git push.','Con la aprobación y las verificaciones en verde, integrar con «Squash and merge».','git switch main, git pull y git branch -d fix/recargo-cuotas.']);
  console.log('g35b'); await L.go(p,G+'35b-repaso-integrador-git','Cerrá la versión');
  await L.fill(p,['fetch','-D','-m','main'],['pull','-d','-a','v2.3.0']);
  console.log('ERRS', errs); await b.close();
})();
