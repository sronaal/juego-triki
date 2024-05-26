const tablero = document.getElementById('tablero');
const celdas = document.querySelectorAll('[data-celda]');
const mensajeElemento = document.getElementById('mensaje');
const botonReiniciar = document.getElementById('botonReiniciar');
const botonJVJ = document.getElementById('jvj');
const botonJVM = document.getElementById('jvm');

const puntuacionXElemento = document.getElementById('puntuacionX');
const puntuacionOElemento = document.getElementById('puntuacionO');

const CLASE_X = 'x';
const CLASE_O = 'o';
let turnoO;
let esJVJ = true;

let puntuacionX = 0;
let puntuacionO = 0;

const COMBINACIONES_GANADORAS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

botonJVJ.addEventListener('click', iniciarJuegoJVJ);
botonJVM.addEventListener('click', iniciarJuegoJVM);
botonReiniciar.addEventListener('click', iniciarJuego);

function iniciarJuegoJVJ() {
    console.log("Iniciando Juego Jugador vs Jugador");
    esJVJ = true;
    iniciarJuego();
}

function iniciarJuegoJVM() {
    console.log("Iniciando Juego Jugador vs Máquina");
    esJVJ = false;
    iniciarJuego();
}

function iniciarJuego() {
    console.log("Iniciando Juego");
    turnoO = false;
    celdas.forEach(celda => {
        celda.classList.remove(CLASE_X);
        celda.classList.remove(CLASE_O);
        celda.textContent = ''; // Limpiar la celda
        celda.removeEventListener('click', manejarClick);
        celda.addEventListener('click', manejarClick, { once: true });
    });
    establecerClaseTablero();
    mensajeElemento.textContent = '';
}

function manejarClick(e) {
    console.log("Clic en una celda");
    const celda = e.target;
    const claseActual = turnoO ? CLASE_O : CLASE_X;
    colocarMarca(celda, claseActual);
    if (verificarGanador(claseActual)) {
        actualizarPuntuacion(claseActual);
        finalizarJuego(false);
    } else if (esEmpate()) {
        finalizarJuego(true);
    } else {
        cambiarTurno();
        establecerClaseTablero();
        if (!turnoO && !esJVJ) {
            setTimeout(movimientoBot, 500);
        }
    }
}

function finalizarJuego(empate) {
    if (empate) {
        mensajeElemento.textContent = 'Empate!';
    } else {
        mensajeElemento.textContent = `${turnoO ? "O" : "X"} Gana!`;
    }
}

function esEmpate() {
    return [...celdas].every(celda => {
        return celda.classList.contains(CLASE_X) || celda.classList.contains(CLASE_O);
    });
}

function colocarMarca(celda, claseActual) {
    celda.classList.add(claseActual);
    celda.textContent = claseActual.toUpperCase(); // Añadir texto a la celda
}

function cambiarTurno() {
    turnoO = !turnoO;
}

function establecerClaseTablero() {
    tablero.classList.remove(CLASE_X);
    tablero.classList.remove(CLASE_O);
    if (turnoO) {
        tablero.classList.add(CLASE_O);
    } else {
        tablero.classList.add(CLASE_X);
    }
}

function verificarGanador(claseActual) {
    return COMBINACIONES_GANADORAS.some(combinacion => {
        return combinacion.every(indice => {
            return celdas[indice].classList.contains(claseActual);
        });
    });
}

function actualizarPuntuacion(claseActual) {
    if (claseActual === CLASE_X) {
        puntuacionX++;
        puntuacionXElemento.textContent = `Jugador X: ${puntuacionX}`;
    } else {
        puntuacionO++;
        puntuacionOElemento.textContent = `Jugador O: ${puntuacionO}`;
    }
}

function movimientoBot() {
    const celdasDisponibles = [...celdas].filter(celda => !celda.classList.contains(CLASE_X) && !celda.classList.contains(CLASE_O));
    const celdaAleatoria = celdasDisponibles[Math.floor(Math.random() * celdasDisponibles.length)];
    celdaAleatoria.click();
}
