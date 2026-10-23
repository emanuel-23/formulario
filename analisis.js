// ============================================
// ANALISIS.JS: entra con correo, lee las respuestas
// de Firebase y dibuja los gráficos.
// ============================================

let respuestas = [];   // aquí guardamos todas las respuestas


// 1. INICIO DE SESIÓN
document.querySelector("#btn-entrar").addEventListener("click", function () {
  const correo = document.querySelector("#correo").value;
  const clave = document.querySelector("#clave").value;

  firebase.auth().signInWithEmailAndPassword(correo, clave)
    .catch(function () {
      alert("Correo o contraseña incorrectos.");
    });
});

document.querySelector("#btn-salir").addEventListener("click", function () {
  firebase.auth().signOut().then(function () {
    location.reload();   // recarga la página
  });
});

// Firebase avisa cuando alguien entra: mostramos el panel y cargamos datos
firebase.auth().onAuthStateChanged(function (usuario) {
  if (usuario) {
    document.querySelector("#login").style.display = "none";
    document.querySelector("#panel").style.display = "block";
    cargarRespuestas();
  }
});


// 2. LEER LAS RESPUESTAS DE FIREBASE
function cargarRespuestas() {
  db.collection("respuestas").get().then(function (resultado) {
    resultado.forEach(function (documento) {
      respuestas.push(documento.data());
    });
    mostrarResultados();
  });
}


// 3. MOSTRAR LOS RESULTADOS
function mostrarResultados() {
  document.querySelector("#total").textContent = respuestas.length;

  if (respuestas.length === 0) {
    return;   // si no hay respuestas, no hay nada que graficar
  }

  // Un gráfico por pregunta: (id del canvas, campo, valores guardados, textos)
  hacerGrafico("g1", "p1", ["nino", "madre", "cientifico", "anciano"],
               ["Niño de 8 años", "Madre de 35 años", "Científico de 50 años", "Anciano de 80 años"]);
  hacerGrafico("g2", "p2", ["denuncio", "callo"], ["Denuncia", "Se calla"]);
  hacerGrafico("g3", "p3", ["entrego", "protejo"], ["Lo entrega", "Lo protege"]);
  hacerGrafico("g4", "p4", ["denuncio", "justicia", "castigo"],
               ["Lo denuncia", "Se hace justicia", "Castigo silencioso"]);
  hacerGrafico("g5", "p5", ["cuento", "silencio"], ["Cuenta la verdad", "Guarda silencio"]);
  hacerGrafico("g6", "sinceridad", ["muy", "poco"], ["Muy sincero", "Poco sincero"]);

  // Hallazgo: protegen a su hijo (P3) pero no denunciarían al asesino (P4)
  const doble = respuestas.filter(function (r) {
    return r.p3 === "protejo" && r.p4 !== "denuncio";
  }).length;
  document.querySelector("#doble").textContent = Math.round(doble / respuestas.length * 100) + "%";
}


// 4. FUNCIÓN QUE DIBUJA UN GRÁFICO DE BARRAS
function hacerGrafico(idCanvas, campo, valores, textos) {
  const porcentajes = [];

  // Para cada opción, contamos cuántos la eligieron y sacamos el porcentaje
  for (let i = 0; i < valores.length; i++) {
    const cuantos = respuestas.filter(function (r) {
      return r[campo] === valores[i];
    }).length;
    porcentajes.push(Math.round(cuantos / respuestas.length * 100));
  }

  new Chart(document.getElementById(idCanvas), {
    type: "bar",
    data: {
      labels: textos,
      datasets: [{ data: porcentajes, backgroundColor: "#b3261e" }]
    },
    options: {
      indexAxis: "y",                    // barras horizontales
      plugins: { legend: { display: false } },
      scales: { x: { min: 0, max: 100 } }  // de 0% a 100%
    }
  });
}
