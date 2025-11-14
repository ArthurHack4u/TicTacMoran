import './App.css';
import { useState, useEffect } from 'react';

function Square({ value, onSquareClick, highlight }) {
  return (
    <button
      className={`cuadro ${highlight ? "highlight" : ""}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xSigue, cuadro, onPlay, size }) {

  function handleClick(i) {
    const { ganador } = calcularGanador(cuadro, size);
    if (cuadro[i] || ganador) return;

    const nextCuadro = cuadro.slice();
    nextCuadro[i] = xSigue ? 'X' : 'O';
    onPlay(nextCuadro);
  }

  const { ganador, linea } = calcularGanador(cuadro, size);
  const estado = ganador
    ? `Ganador: ${ganador}`
    : `Siguiente jugador: ${xSigue ? "X" : "O"}`;

  const rows = [];
  for (let r = 0; r < size; r++) {
    const cols = [];
    for (let c = 0; c < size; c++) {
      const index = r * size + c;

      cols.push(
        <Square
          key={index}
          value={cuadro[index]}
          onSquareClick={() => handleClick(index)}
          highlight={linea.includes(index)}
        />
      );
    }
    rows.push(
      <div className="board-row" key={r}>{cols}</div>
    );
  }

  return (
    <>
      <h1>TicTacMoran</h1>
      <div className="estado">{estado}</div>
      {rows}
    </>
  );
}

export default function Juego() {

  const [settings, setSettings] = useState({
    boardSize: 3,
  });

  const [historial, setHistorial] = useState([Array(9).fill(null)]);
  const [currentMovimeinto, setCurrentMovimiento] = useState(0);
  const [resetClicks, setResetClicks] = useState(0);

  const size = settings.boardSize;
  const totalCasillas = size * size;

  useEffect(() => {
    setHistorial([Array(totalCasillas).fill(null)]);
    setCurrentMovimiento(0);
  }, [size, totalCasillas]);

  const xSigue = currentMovimeinto % 2 === 0;
  const currentCuadros = historial[currentMovimeinto];

  function handlePlay(nextCuadro) {
    const siguienteHistorial = [
      ...historial.slice(0, currentMovimeinto + 1),
      nextCuadro
    ];

    setHistorial(siguienteHistorial);
    setCurrentMovimiento(siguienteHistorial.length - 1);
  }

  function saltoPara(siguienteMovimiento) {

    if (siguienteMovimiento === 0) {

      setResetClicks(prev => {
        const nuevo = prev + 1;

        if (nuevo >= 3) {
          alert(`
EASTER EGG

Bryan Arturo Moran Escalante
67406
Diseño Web

@moran.print en ig
          `);

          setCurrentMovimiento(0);

          return 0;
        }

        return nuevo;
      });

    } else {
      setResetClicks(0);
    }

    if (siguienteMovimiento !== 0 || resetClicks + 1 < 3) {
      setCurrentMovimiento(siguienteMovimiento);
    }
  }

  const movimientos = historial.map((cuadro, movimiento) => {
    let descripcion =
      movimiento > 0
        ? "Saltar a movimiento #" + movimiento
        : "Ir a iniciar el juego";

    return (
      <li key={movimiento}>
        <button onClick={() => saltoPara(movimiento)}>
          {descripcion}
        </button>
      </li>
    );
  });

  return (
    <div className="juego">
      <div className="game-board">
        <Board
          xSigue={xSigue}
          cuadro={currentCuadros}
          onPlay={handlePlay}
          size={size}
        />
      </div>

      <div className="info-juego">
        <h3>Configuraciones</h3>

        <label>
          Tamaño del tablero:
          <select
            value={settings.boardSize}
            onChange={(e) =>
              setSettings({
                ...settings,
                boardSize: parseInt(e.target.value)
              })
            }
          >
            <option value={3}>3×3</option>
            <option value={4}>4×4</option>
            <option value={5}>5×5</option>
          </select>
        </label>

        <hr />

        Estas en el movimiento #{currentMovimeinto}
        <ol>{movimientos}</ol>
      </div>
    </div>
  );
}

function calcularGanador(cuadro, size) {

  const lineas = [];

  for (let r = 0; r < size; r++) {
    const row = [];
    for (let c = 0; c < size; c++) row.push(r * size + c);
    lineas.push(row);
  }

  for (let c = 0; c < size; c++) {
    const col = [];
    for (let r = 0; r < size; r++) col.push(r * size + c);
    lineas.push(col);
  }

  const diag1 = [];
  for (let i = 0; i < size; i++) diag1.push(i * size + i);
  lineas.push(diag1);

  const diag2 = [];
  for (let i = 0; i < size; i++) diag2.push(i * size + (size - 1 - i));
  lineas.push(diag2);

  for (let linea of lineas) {
    const [first] = linea;

    if (cuadro[first] && linea.every(i => cuadro[i] === cuadro[first])) {
      return { ganador: cuadro[first], linea };
    }
  }

  return { ganador: null, linea: [] };
}
