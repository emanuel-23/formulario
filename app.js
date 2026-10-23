// ============================================
// APP.JS: la lógica del formulario
// Hace 3 cosas: cambiar de pantalla, mover la barra
// y revisar que la persona haya respondido.
// ============================================

// 1. VARIABLES: buscamos los elementos del HTML y los guardamos
const pantallas = document.querySelectorAll(".pantalla");      // todas las pantallas
const botonesSiguiente = document.querySelectorAll(".btn-siguiente"); // todos los botones "Siguiente"
const barra = document.querySelector("#barra-progreso");       // la barra roja
const formulario = document.querySelector("#formulario");      // el formulario completo

let pantallaActual = 0; // número de la pantalla que se ve (0 = bienvenida)


// 2. FUNCIÓN: mostrar una pantalla
function mostrarPantalla(numero) {
  // Primero le quitamos "activa" a todas
  pantallas.forEach(function (pantalla) {
    pantalla.classList.remove("activa");
  });

  // Luego se la ponemos solo a la que queremos ver
  pantallas[numero].classList.add("activa");
  pantallaActual = numero;

  // Y actualizamos la barra de progreso
  moverBarra();

  // Subimos al inicio de la página (útil en el celular)
  window.scrollTo(0, 0);
}


// 3. FUNCIÓN: mover la barra de progreso
function moverBarra() {
  // La última pantalla (gracias) es el 100%
  const ultima = pantallas.length - 1;
  const porcentaje = (pantallaActual / ultima) * 100;
  barra.style.width = porcentaje + "%";
}


// 4. FUNCIÓN: revisar que la pantalla actual esté bien respondida
function pantallaCompleta() {
  // Buscamos todos los campos "required" dentro de la pantalla actual
  const campos = pantallas[pantallaActual].querySelectorAll("[required]");

  for (let i = 0; i < campos.length; i++) {
    const campo = campos[i];

    // Caja de texto (el nombre): no puede estar vacía
    if (campo.type === "text" && campo.value.trim() === "") {
      campo.focus();
      alert("Escribe tu nombre o apodo para continuar.");
      return false;
    }

    // Opciones (radio): tiene que haber una marcada con ese mismo nombre
    if (campo.type === "radio") {
      const marcada = pantallas[pantallaActual].querySelector(
        'input[name="' + campo.name + '"]:checked'
      );
      if (marcada === null) {
        alert("Elige una opción para continuar.");
        return false;
      }
    }
  }

  return true; // todo bien
}


// 5. EVENTO: al tocar "Siguiente" o "Empezar"
botonesSiguiente.forEach(function (boton) {
  boton.addEventListener("click", function () {
    if (pantallaCompleta()) {
      mostrarPantalla(pantallaActual + 1);
    }
  });
});


// 6. EVENTO: al enviar el formulario (botón "Enviar respuestas")
formulario.addEventListener("submit", function (evento) {
  evento.preventDefault(); // evita que la página se recargue

  if (!pantallaCompleta()) {
    return; // si falta algo, no seguimos
  }

  // Reunimos todas las respuestas en un solo objeto
  const datos = new FormData(formulario);
  const respuestas = Object.fromEntries(datos);
  respuestas.fecha = new Date().toISOString(); // cuándo respondió

  // Desactivamos el botón para que no envíen dos veces
  const botonEnviar = document.querySelector("#btn-enviar");
  botonEnviar.disabled = true;

  // Guardamos en la colección "respuestas" de Firestore
  db.collection("respuestas").add(respuestas)
    .then(function () {
      mostrarPantalla(pantallaActual + 1); // pantalla de gracias
    })
    .catch(function (error) {
      console.error("Error al guardar:", error);
      alert("No se pudo enviar. Revisa tu internet e inténtalo de nuevo.");
      botonEnviar.disabled = false;
    });
});
