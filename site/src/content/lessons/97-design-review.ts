import type {OrderItem, OrderRule} from '@site/src/components/Order';
import type {DecisionNode} from '@site/src/components/DecisionPath';
import type {MatchItem} from '@site/src/components/Match';

export const PASS_ITEMS: OrderItem[] = [
  {id: 'before', what: 'Paso', code: 'Cambiar a la rama base, reconstruir y capturar las pantallas modificadas.'},
  {id: 'publish', what: 'Paso', code: 'Publicar el documento con los pares antes y después en el ticket de diseño.'},
  {id: 'setup', what: 'Paso', code: 'Levantar el entorno, sembrar los datos y listar desde el diff las pantallas cambiadas, con su camino en el mapa de navegación.'},
  {id: 'status', what: 'Paso', code: 'Actualizar el comentario del Pull Request a «listo», con el enlace.'},
  {id: 'after', what: 'Paso', code: 'Capturar cada pantalla en la rama del Pull Request.'},
];
export const PASS_CORRECT = ['setup', 'after', 'before', 'publish', 'status'];
export const PASS_RULES: OrderRule[] = [
  {before: 'setup', after: 'after', why: 'Sin el entorno y la lista de pantallas con sus caminos, no se sabe qué capturar.'},
  {before: 'after', after: 'before', why: 'La pasada «después» define qué pantallas capturar; la «antes» repite los mismos caminos en la rama base.'},
  {before: 'before', after: 'publish', why: 'El documento necesita los dos lados de cada par.'},
  {before: 'publish', after: 'status', why: 'El comentario enlaza al documento ya publicado.'},
];

export const TRIGGER_START = 'title';
export const TRIGGER_NODES: Record<string, DecisionNode> = {
  title: {
    id: 'title',
    situation: 'Se abre el Pull Request «DES-214: nuevo diseño de la tarjeta de turno», no borrador. ¿Se dispara el design review?',
    options: [
      {text: 'No, porque el Pull Request no toca ninguna de las rutas que disparan la suite funcional.', correct: false, why: 'El design review no tiene filtro por rutas: un cambio visual puede no tocarlas.'},
      {text: 'Sí: tiene el prefijo de ticket de diseño y no es borrador.', correct: true, why: 'El identificador dice dónde publicar el documento.', next: 'push'},
      {text: 'Solo si alguien le pone a mano la etiqueta design-review.', correct: false, why: 'La etiqueta es para volver a correrlo; el prefijo en el título ya lo dispara.'},
    ],
  },
  push: {
    id: 'push',
    situation: 'Una hora después, se suben dos commits más al mismo Pull Request. ¿Se vuelve a correr?',
    options: [
      {text: 'Sí, automáticamente, para que el documento muestre siempre la última versión de la rama.', correct: false, why: 'Corre una vez por Pull Request: cada corrida es cara.'},
      {text: 'Sí, pero solo sobre las pantallas que tocaron los dos commits nuevos.', correct: false, why: 'No se dispara en un push nuevo.'},
      {text: 'No; si hace falta, se saca y se vuelve a poner la etiqueta.', correct: true, why: 'La etiqueta es el mecanismo para volver a correrlo a pedido.', next: 'none'},
    ],
  },
  none: {
    id: 'none',
    situation: 'Otro Pull Request, «Ajustes de estilos en la agenda», sin identificador de ticket, cambia colores. ¿Qué pasa?',
    options: [
      {text: 'No se dispara: no hay un ticket donde publicar el documento.', correct: true, why: 'Sin el identificador, el job lo registra y lo saltea.'},
      {text: 'Se dispara y publica el documento en el Pull Request, ya que no tiene ticket asociado.', correct: false, why: 'El documento va al ticket de diseño: sin ticket, no corre.'},
      {text: 'Se dispara y crea un ticket nuevo de diseño para poder publicar el documento.', correct: false, why: 'No crea tickets: sin identificador, se saltea.'},
    ],
  },
};
export const TRIGGER_EXPLANATION =
  'Dispara con el prefijo de ticket o la etiqueta, una vez por Pull Request, y sin identificador no corre porque no hay dónde publicar.';

export const RESULT_LEFT: MatchItem[] = [
  {id: 'done', text: 'El comentario dice «listo», con el enlace al documento.'},
  {id: 'fail', text: 'El comentario dice «no se pudo completar»: la rama no compiló.'},
  {id: 'stuck', text: 'El comentario quedó en «iniciado» desde hace dos horas.'},
  {id: 'wrong', text: 'El documento muestra la pantalla de pacientes, pero el cambio era en la agenda.'},
];
export const RESULT_RIGHT: MatchItem[] = [
  {id: 'wrong', text: 'Avisar en el ticket que faltó la pantalla de la agenda y capturarla a mano'},
  {id: 'stuck', text: 'Abrir el enlace al registro de la ejecución y ver en qué paso se cortó'},
  {id: 'done', text: 'Abrir el documento, comparar cada par y marcar en el ticket de diseño lo que cambió sin querer'},
  {id: 'fail', text: 'Leer el motivo, reintentar una vez y, si vuelve a fallar, capturar a mano'},
];
export const RESULT_WHY: Record<string, string> = {
  done: 'Las regresiones visuales se marcan en el ticket de diseño, no en el diff.',
  fail: 'Un reintento puede alcanzar; si no, las capturas se hacen a mano.',
  stuck: 'La tarea murió antes de poder actualizar el comentario.',
  wrong: 'La lista armada desde el diff no coincidió con lo que cambió, o el mapa llevó a otra pantalla.',
};
