const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const resolution = 10;
canvas.width = 800;
canvas.height = 800;
let generations = 0;
let speed = 50;

const COLS = canvas.width / resolution;
const ROWS = canvas.height / resolution;

function buildGrid() {
    start();
    return new Array( COLS ).fill(null)
        .map( () => new Array( ROWS ).fill(null)
            .map( () => Math.floor(Math.random() * 2))
        );
}

let grid = buildGrid();

function start() {
    startGame = setInterval( update, speed);
}

function stop() {
    clearInterval( startGame )
}


function update() {
    grid = nextGen(grid);
    render(grid);
    // requestAnimationFrame(update);    
    // console.log('update');
}

function nextGen(grid) {
    const nextGen = grid.map( arr => [...arr] );
    
    for (let col = 0; col < grid.length; col++) {
        for (let row = 0; row < grid[col].length; row++) {
            const cell = grid[col][row];
            let numNeighbours = 0;
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    if ( i === 0 && j === 0 ) {
                        continue;
                    }
                    const x_cell = col + i;
                    const y_cell = row + j;

                    if (x_cell >= 0 && y_cell >= 0 && x_cell < COLS && y_cell < ROWS ) {
                        const currentNeighbour = grid[col + i][row + j];
                        numNeighbours += currentNeighbour;
                    }
                    
                }                
            }
            // rules
            if (cell === 1 && numNeighbours < 2) {
                nextGen[col][row] = 0;
            } else if (cell === 1 && numNeighbours > 3) {
                nextGen[col][row] = 0;                
            } else if (cell === 0 && numNeighbours === 3) {
                nextGen[col][row] = 1;
            }
        }
    }
    // console.log(nextGen);
    generations++;
    document.getElementById('generations').innerHTML = generations;
    return nextGen;
}


function render(grid) {
    for (let col = 0; col < grid.length; col++) {
        for (let row = 0; row < grid[col].length; row++) {
            const cell = grid[col][row];

            ctx.beginPath();
            ctx.rect( col * resolution, row * resolution, resolution, resolution );
            ctx.fillStyle = cell ? 'fuchsia' : 'cyan';
            ctx.fill();
        }
    }
}

function resetBoard() {
    stop();
    generations = 0;
    grid = buildGrid();
}

const reset = document.getElementById('reset');
reset.addEventListener('click', () => { resetBoard() })

document.getElementById('speed').addEventListener( 'change', (e) => {
    // create a function to pass speed that starts/stops/setsspeed to not repeat everything
    switch ( e.target.value ) {
        case 'fast':
            stop();
            speed = 1;
            start();
            break;
        case 'medium':
            stop();
            speed = 50;
            start();
            break;
        case 'slow':
            stop();
            speed = 200;
            start();
            break;
    };
} )