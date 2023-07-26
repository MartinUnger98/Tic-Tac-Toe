let fields = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null   
];

let currentPlayer = "circle";

function init(){
    render();
};
function render() {
    const contentDiv = document.getElementById("content");

    let tableHTML = "<table>";
    for (let i = 0; i < 3; i++) {
      tableHTML += "<tr>";
      for (let j = 0; j < 3; j++) {
        const index = i * 3 + j;
        let symbol = fields[index] === "circle" ? generateAnimatedCircle() : (fields[index] === "cross" ? generateAnimatedCross() : "");
        tableHTML += `<td onclick="onCellClick(${index})">${symbol}</td>`;
      }
      tableHTML += "</tr>";
    }
    tableHTML += "</table>";
    contentDiv.innerHTML = tableHTML;

    if (isGameOver()) {
      const winningLine = getWinningLine();
      if (winningLine) {
        drawWinningLine(winningLine);
      }
    }
  }

  function onCellClick(index) {
    if (!fields[index]) {
      fields[index] = currentPlayer;
      currentPlayer = currentPlayer === "circle" ? "cross" : "circle";
      
      const contentDiv = document.getElementById("content");
      const table = contentDiv.querySelector("table");
      const td = table.rows[Math.floor(index / 3)].cells[index % 3];
      
      if (fields[index] === "circle") {
        td.innerHTML = generateAnimatedCircle();
      } else if (fields[index] === "cross") {
        td.innerHTML = generateAnimatedCross();
      }
      
      document.getElementsByTagName('td')[index].removeAttribute('onclick');
  
      if (isGameOver()) {
        const winningLine = getWinningLine();
        if (winningLine) {
          drawWinningLine(winningLine);
        }
      }
    }
  }

function generateAnimatedCircle() {
    const width = 70;
      const height = 70;
      const color = "#00B0EF";
      const strokeWidth = 10;
      const radius = 30;
      const circumference = 2 * Math.PI * radius;

      const svgCode = `
        <svg width="${width}" height="${height}">
          <circle cx="${width / 2}" cy="${height / 2}" r="${radius}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-dasharray="${circumference}" stroke-dashoffset="${circumference}">
            <animate attributeName="stroke-dashoffset" from="${circumference}" to="0" dur="750ms" fill="freeze" />
          </circle>
        </svg>
      `;

      return svgCode;
  }

  function generateAnimatedCross() {
    const width = 70;
      const height = 70;
      const strokeWidth = 12; // Dicke des Kreuzes
      const fillColor = "#FFC000";
      const animationDuration = 750; // 750 ms
      const rotationAngle = 45; // 45 Grad

      const svgCode = `
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" style="transform: rotate(${rotationAngle}deg);">
          <line x1="${width / 2}" y1="${strokeWidth / 2}" x2="${width / 2}" y2="${height - strokeWidth / 2}" stroke="${fillColor}" stroke-width="${strokeWidth}">
            <animate attributeName="y2" from="${strokeWidth / 2}" to="${height - strokeWidth / 2}" dur="${animationDuration}ms" fill="freeze" />
          </line>
          <line x1="${strokeWidth / 2}" y1="${height / 2}" x2="${width - strokeWidth / 2}" y2="${height / 2}" stroke="${fillColor}" stroke-width="${strokeWidth}">
            <animate attributeName="x2" from="${strokeWidth / 2}" to="${width - strokeWidth / 2}" dur="${animationDuration}ms" fill="freeze" />
          </line>
        </svg>
      `;

      return svgCode;
  }

  
  function isGameOver() {
    // Überprüfen, ob das Spiel vorbei ist (es gibt einen Gewinner oder alle Felder sind belegt)
    return checkWinner("circle") || checkWinner("cross") || fields.every((field) => field !== null);
  }

  function checkWinner(player) {
    // Prüfen, ob der gegebene Spieler gewonnen hat
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontale Kombinationen
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertikale Kombinationen
      [0, 4, 8], [2, 4, 6] // Diagonale Kombinationen
    ];

    return winningCombinations.some(combination =>
      combination.every(index => fields[index] === player)
    );
  }

  function getWinningLine() {
    // Finden der Gewinnlinie (falls vorhanden)
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontale Kombinationen
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertikale Kombinationen
      [0, 4, 8], [2, 4, 6] // Diagonale Kombinationen
    ];

    for (const combination of winningCombinations) {
      const [index1, index2, index3] = combination;
      if (fields[index1] && fields[index1] === fields[index2] && fields[index1] === fields[index3]) {
        return combination;
      }
    }

    return null;
  }
  function drawWinningLine(winningLine) {
    const lineColor = "#ffffff";
    const lineWidth = 5;
  
    const startCell = document.querySelectorAll(`td`)[winningLine[0]];
    const endCell = document.querySelectorAll(`td`)[winningLine[2]];
    const startRect = startCell.getBoundingClientRect();
    const endRect = endCell.getBoundingClientRect();
  
    const lineLength = Math.sqrt(
      Math.pow(endRect.left - startRect.left, 2) + Math.pow(endRect.top - startRect.top, 2)
    );
    const lineAngle = Math.atan2(endRect.top - startRect.top, endRect.left - startRect.left);
  
    const line = document.createElement("div");
    line.style.position = "absolute";
    line.style.width = `${lineLength}px`;
    line.style.height = `${lineWidth}px`;
    line.style.backgroundColor = lineColor;
    line.style.top = `${startRect.top + startRect.height / 2 - lineWidth / 2}px`;
    line.style.left = `${startRect.left + startRect.width / 2 - lineWidth / 2}px`;
    line.style.transform = `rotate(${lineAngle}rad)`;
    line.style.transformOrigin = `top left`;
    document.getElementById("content").appendChild(line);
  }
  
  