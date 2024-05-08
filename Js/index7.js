let preguntas_aleatorias = true;
let mostrar_pantalla_juego_terminado = true;
let reiniciar_puntos_al_reiniciar_el_juego = true;

let base_preguntas;
let interprete_bp;

window.onload = function () {
  base_preguntas = readText("Json/base-preguntas-7.json");
  interprete_bp = JSON.parse(base_preguntas);
  escogerPreguntaAleatoria();
};

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

function escogerPreguntaAleatoria() {
  if (preguntasRespondidas.length === interprete_bp.length) {
    swal.fire({
      title: "Juego finalizado",
      text: "Puntuación: " + preguntas_correctas + "/" + preguntasRespondidas.length,
      icon: "success"
    });
    preguntas_correctas = 0;
    preguntasRespondidas = [];
  } else {
    let n;
    if (preguntas_aleatorias) {
      n = Math.floor(Math.random() * interprete_bp.length);
    } else {
      n = 0;
    }

    while (npreguntas.includes(n) || preguntasRespondidas.includes(n)) {
      n++;
      if (n >= interprete_bp.length) {
        n = 0;
      }
      if (npreguntas.length === interprete_bp.length) {
        if (mostrar_pantalla_juego_terminado) {
          swal.fire({
            title: "Juego finalizado",
            text: "Puntuación: " + preguntas_correctas + "/" + preguntasRespondidas.length,
            icon: "success"
          });
        }
        if (reiniciar_puntos_al_reiniciar_el_juego) {
          preguntas_correctas = 0;
          preguntas_hechas = 0;
        }
        npreguntas = [];
      }
    }
    npreguntas.push(n);
    preguntas_hechas++;
    fiftyFiftyUsed = false;

    escogerPregunta(n);
  }
}

function escogerPregunta(n) {
  pregunta = interprete_bp[n];
  select_id("categoria").innerHTML = pregunta.categoria;
  select_id("pregunta").innerHTML = pregunta.pregunta;
  select_id("numero").innerHTML = n;
  let pc = preguntas_correctas;
  if (preguntas_hechas > 1) {
    select_id("puntaje").innerHTML = pc + "/" + (preguntas_hechas - 1);
  } else {
    select_id("puntaje").innerHTML = "";
  }

  desordenarRespuestas(pregunta);
}

function desordenarRespuestas(pregunta) {
  posibles_respuestas = [
    pregunta.respuesta,
    pregunta.incorrecta1,
    pregunta.incorrecta2,
    pregunta.incorrecta3
  ];
  posibles_respuestas.sort(() => Math.random() - 0.5);

  select_id("btn1").innerHTML = posibles_respuestas[0];
  select_id("btn2").innerHTML = posibles_respuestas[1];
  select_id("btn3").innerHTML = posibles_respuestas[2];
  select_id("btn4").innerHTML = posibles_respuestas[3];
}

let suspender_botones = false;

function oprimir_btn(i) {
  if (suspender_botones) {
    return;
  }
  suspender_botones = true;
  if (posibles_respuestas[i] === pregunta.respuesta) {
    preguntas_correctas++;
    btn_correspondiente[i].style.background = "#00bb2d";
    btn_correspondiente[i].style.border = "2px solid #00bb2d";
    document.body.style.backgroundColor = "#00bb2d";

    select_id("50-50-button").style.background = "#00bb2d";
  } else {
    btn_correspondiente[i].style.background = "#F00";
    btn_correspondiente[i].style.border ="2px solid #F00";
    document.body.style.backgroundColor = "#F00";

    select_id("50-50-button").style.background = "#F00";
  }
  setTimeout(() => {
    reiniciar();
    suspender_botones = false;
    document.body.style.backgroundColor = "black";
    btn_correspondiente[i].style.border ="2px solid white";
    select_id("btn1").style.backgroundColor = "black"
    select_id("btn2").style.backgroundColor = "black"
    select_id("btn3").style.backgroundColor = "black"
    select_id("btn4").style.backgroundColor = "black"

    select_id("50-50-button").style.background = "black";
  }, 3000);
}

function ocultarDosRespuestas() {
  if (fiftyFiftyUsed) {
    return;
  }
  fiftyFiftyUsed = true;

  let ocultarRespuestas = [1, 2, 3];
  ocultarRespuestas.sort(() => Math.random() - 0.5);
  for (let i = 0; i < 2; i++) {
    btn_correspondiente[ocultarRespuestas[i]].style.display = 'none';
  }
}

function reiniciarRespuestas() {
  for (let i = 0; i < 4; i++) {
    btn_correspondiente[i].style.display = 'block';
  }
}

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
  ocultarDosRespuestas();
});

function reiniciar() {
  for (const btn of btn_correspondiente) {
    btn.style.background = "white";
  }
  reiniciarRespuestas();
  escogerPreguntaAleatoria();
}

function select_id(id) {
  return document.getElementById(id);
}

function style(id) {
  return select_id(id).style;
}

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
