# Otras formas de escribir tests

POM organiza *cómo se estructura el código* de la suite. Es independiente
de *cómo se redacta* el caso que el test verifica — y ahí hay más de una
convención instalada en la industria, vale la pena conocerlas de nombre:

- **BDD / Gherkin (Given-When-Then).** El caso se escribe primero en
  lenguaje de negocio ("Dado... Cuando... Entonces..."), y el código es una
  traducción de esos pasos. Lo eligen equipos que necesitan que alguien sin
  perfil técnico pueda leer o escribir el caso. El
  [`docs/specs/portfolio.md`](../../project/docs/specs/portfolio.md) real de
  esta app no usa Gherkin, pero cumple la misma función: cada Use Case ahí
  (UC-3, por ejemplo: "Comprar un activo ya existente") es lo que después se
  tradujo en el test `buy existing portfolio asset increases units...`.
- **Data-driven testing.** Un mismo test corre varias veces con distintos
  sets de datos de entrada (parametrización), en vez de copiar el mismo
  test una vez por cada valor a probar.
- **Keyword-driven testing.** El caso se arma como una tabla de acciones
  ("abrir pantalla", "completar campo", "verificar mensaje"), pensada para
  que alguien sin saber programar pueda componer casos nuevos combinando
  palabras clave ya definidas.
- **Screenplay.** Modela actores con habilidades, en vez de pantallas con
  selectores. Se desarrolla en
  [Screenplay](./13-screenplay.md).

Ninguna de estas reemplaza a POM — convive con él. POM sigue resolviendo
cómo se organiza el código; estas convenciones resuelven cómo se redacta
el caso que ese código termina ejecutando.

**Siguiente:** [Screenplay](./13-screenplay.md)
