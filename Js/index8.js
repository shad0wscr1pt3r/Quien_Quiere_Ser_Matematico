// Configuración del juego
let preguntas_aleatorias = true;
let mostrar_pantalla_juego_terminado = true;
let reiniciar_puntos_al_reiniciar_el_juego = true;

// Variables para almacenar preguntas
let base_preguntas;
let interprete_bp;

// Acciones al cargar la ventana
window.onload = function () {
  // Lee el archivo de preguntas y lo interpreta como JSON
  base_preguntas = readText("Json/base-preguntas-8.json");
  interprete_bp = JSON.parse(base_preguntas);
  
  // Inicia el juego con una pregunta aleatoria
  escogerPreguntaAleatoria();
};

// Variables de juego y preguntas
let pregunta;
let posibles_respuestas;
let btn_correspondiente = [
  select_id("btn1"),
  select_id("btn2"),
  select_id("btn3"),
  select_id("btn4")
];
let npreguntas = [];

let preguntas_hechas = 0;
let preguntas_correctas = 0;
let fiftyFiftyUsed = false;

let preguntasRespondidas = [];

// Función para escoger una pregunta aleatoria
function escogerPreguntaAleatoria() {
  // Verifica si se han respondido todas las preguntas
  if (preguntasRespondidas.length === interprete_bp.length) {
    // Muestra un mensaje de juego finalizado
    swal.fire({
      title: "Juego finalizado",
      text: "Puntuación: " + preguntas_correctas + "/" + preguntasRespondidas.length,
      icon: "success"
    });
    
    // Reinicia el contador de preguntas correctas y respondidas
    preguntas_correctas = 0;
    preguntasRespondidas = [];
  } else {
    let n;
    // Lógica para escoger una pregunta aleatoria o reiniciar desde el principio
    if (preguntas_aleatorias) {
      n = Math.floor(Math.random() * interprete_bp.length);
    } else {
      n = 0;
    }

    // Lógica para evitar repetir preguntas
    while (npreguntas.includes(n) || preguntasRespondidas.includes(n)) {
      n++;
      if (n >= interprete_bp.length) {
        n = 0;
      }
      if (npreguntas.length === interprete_bp.length) {
        // Muestra la pantalla de juego finalizado si se han respondido todas las preguntas
        if (mostrar_pantalla_juego_terminado) {
          swal.fire({
            title: "Juego finalizado",
            text: "Puntuación: " + preguntas_correctas + "/" + preguntasRespondidas.length,
            icon: "success",
          });
        }
        
        // Reinicia los puntos si se ha configurado
        if (reiniciar_puntos_al_reiniciar_el_juego) {
          preguntas_correctas = 0;
          preguntas_hechas = 0;
        }
        
        // Reinicia la lista de preguntas para evitar repeticiones
        npreguntas = [];
      }
    }
    
    // Almacena la pregunta actual en la lista para evitar repeticiones
    npreguntas.push(n);
    preguntas_hechas++;
    fiftyFiftyUsed = false;

    // Llama a la función para mostrar la pregunta en la interfaz
    escogerPregunta(n);
  }
}

// Función para mostrar una pregunta en la pantalla
function escogerPregunta(n) {
  // Obtiene la pregunta actual del conjunto de preguntas
  pregunta = interprete_bp[n];
  // Actualiza la interfaz con la información de la pregunta
  select_id("categoria").innerHTML = pregunta.categoria;
  select_id("pregunta").innerHTML = pregunta.pregunta;
  select_id("numero").innerHTML = n;
  
  // Actualiza el puntaje en la interfaz
  let pc = preguntas_correctas;
  if (preguntas_hechas > 1) {
    select_id("puntaje").innerHTML = pc + "/" + (preguntas_hechas - 1);
  } else {
    select_id("puntaje").innerHTML = "";
  }

  // Desordena las respuestas para mostrarlas de manera aleatoria
  desordenarRespuestas(pregunta);
}

// Función para desordenar las respuestas
function desordenarRespuestas(pregunta) {
  posibles_respuestas = [
    pregunta.respuesta,
    pregunta.incorrecta1,
    pregunta.incorrecta2,
    pregunta.incorrecta3
  ];
  posibles_respuestas.sort(() => Math.random() - 0.5);

  // Actualiza los botones de respuesta en la interfaz
  select_id("btn1").innerHTML = posibles_respuestas[0];
  select_id("btn2").innerHTML = posibles_respuestas[1];
  select_id("btn3").innerHTML = posibles_respuestas[2];
  select_id("btn4").innerHTML = posibles_respuestas[3];
}

// Variable para suspender los botones temporalmente
let suspender_botones = false;

// Función que se ejecuta al hacer clic en un botón de respuesta
function oprimir_btn(i) {
  if (suspender_botones) {
    return;
  }
  suspender_botones = true;
  
  // Verifica si la respuesta es correcta y actualiza la interfaz
  if (posibles_respuestas[i] === pregunta.respuesta) {
    preguntas_correctas++;
    btn_correspondiente[i].style.background = "#00bb2d";
    btn_correspondiente[i].style.border = "2px solid #00bb2d";
    document.body.style.backgroundColor = "#00bb2d";

    // Actualiza el color de otros elementos en la interfaz
    select_id("50-50-button").style.background = "#00bb2d";
    select_id("Doble-o-Nada").style.background = "#00bb2d";
  } else {
    btn_correspondiente[i].style.background = "#F00";
    btn_correspondiente[i].style.border ="2px solid #F00";
    document.body.style.backgroundColor = "#F00";

    // Actualiza el color de otros elementos en la interfaz
    select_id("50-50-button").style.background = "#F00";
    select_id("Doble-o-Nada").style.background = "#F00";
  }
  
  // Limpia y prepara la pantalla para la siguiente pregunta después de un tiempo
  setTimeout(() => {
    reiniciar();
    suspender_botones = false;
    document.body.style.backgroundColor = "black";
    btn_correspondiente[i].style.border ="2px solid white";
    select_id("btn1").style.backgroundColor = "black";
    select_id("btn2").style.backgroundColor = "black";
    select_id("btn3").style.backgroundColor = "black";
    select_id("btn4").style.backgroundColor = "black";

    select_id("50-50-button").style.background = "black";
    select_id("Doble-o-Nada").style.background = "black";
  }, 3000);
}

// Función para ocultar dos respuestas
function ocultarDosRespuestas() {
  // Verifica si la función de "50-50" ya ha sido utilizada
  if (fiftyFiftyUsed) {
    return;
  }
  fiftyFiftyUsed = true;

  // Lógica para ocultar dos respuestas de manera aleatoria
  let ocultarRespuestas = [1, 2, 3];
  ocultarRespuestas.sort(() => Math.random() - 0.5);
  for (let i = 0; i < 2; i++) {
    btn_correspondiente[ocultarRespuestas[i]].style.display = 'none';
  }
}

// Función para reiniciar las respuestas ocultas
function reiniciarRespuestas() {
  for (let i = 0; i < 4; i++) {
    btn_correspondiente[i].style.display = 'block';
  }
}

// Event listeners para los botones de respuesta y funciones adicionales
select_id("btn1").addEventListener('click', function () {
  if (!suspender_botones) {
    oprimir_btn(0);
  }
});

select_id("btn2").addEventListener('click', function () {
  if (!suspender_botones) {
    oprimir_btn(1);
  }
});

select_id("btn3").addEventListener('click', function () {
  if (!suspender_botones) {
    oprimir_btn(2);
  }
});

select_id("btn4").addEventListener('click', function () {
  if (!suspender_botones) {
    oprimir_btn(3);
  }
});

select_id("50-50-button").addEventListener('click', function () {
  // Lógica para la función de "50-50"
  ocultarDosRespuestas();
});

select_id("Doble-o-Nada").addEventListener('click', function () {
  // Lógica para la función "Doble-o-Nada"
  escogerPreguntaAleatoria();
});

// Función para reiniciar la interfaz y cargar una nueva pregunta
function reiniciar() {
  for (const btn of btn_correspondiente) {
    btn.style.background = "white";
  }
  reiniciarRespuestas();
  escogerPreguntaAleatoria();
}

// Función utilitaria para seleccionar un elemento por su ID
function select_id(id) {
  return document.getElementById(id);
}

// Función utilitaria para obtener el estilo de un elemento por su ID
function style(id) {
  return select_id(id).style;
}

// Función para leer el contenido de un archivo local
function readText(ruta_local) {
  var texto = null;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", ruta_local, false);
  xmlhttp.send();
  if (xmlhttp.status == 200) {
    texto = xmlhttp.responseText;
  }
  return texto;
}
