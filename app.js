//===========================================DATA OBJECT========================================================
const DATA = {
    canvas: document.querySelector('canvas'),
    resolution: 10,
    width: 900,
    height: 900,
    cols() {
        return this.width / this.resolution
    },
    rows() {
        return this.height / this.resolution
    },
    baseArr: [],
    nextArr: [],


};

//===========================================VIEW METHODS========================================================
const VIEW = {

    generateCanvas() {
        DATA.canvas.width = DATA.width;
        DATA.canvas.height = DATA.height;
        DATA.baseArr = MODIFIER.buildGrid();
        MODIFIER.render(DATA.baseArr);
    },

};

//===========================================MODIFIER METHODS========================================================
const MODIFIER = {

    startGame() {
        requestAnimationFrame(this.update);
    },

    buildGrid() {
        return Array(DATA.cols()).fill(null)
        .map(() => Array(DATA.rows()).fill(null)
            .map(() => Math.floor(Math.random() * 2)));
    },



    update() {
        this.nextGen();
        this.render(DATA.nextArr);
        requestAnimationFrame(this.update);
    },

     render(grid) {
    for (let col = 0; col < grid.length; col++) {
        for (let row = 0; row < grid[col].length; row++) {
            const cell = grid[col][row];
            let ctx = DATA.canvas.getContext(`2d`);

            ctx.beginPath();
            ctx.rect(col * DATA.resolution, row * DATA.resolution, DATA.resolution, DATA.resolution);
            ctx.fillStyle = cell ? 'black' : 'white';
            ctx.fill();
            // ctx.stroke();
        }
    }
},

    nextGen() {
        DATA.nextArr = DATA.baseArr.map(arr => [...arr]);
    
        for (let col = 0; col < DATA.baseArr.length; col++) {
            for (let row = 0; row < DATA.baseArr[col].length; row++) {
                const cell = DATA.baseArr[col][row];
                let numNeighbours = 0;
                for (let i = -1; i < 2; i++) {
                    for (let j = -1; j < 2; j++) {
                        if (i === 0 && j === 0) {
                            continue;
                        }
                        const x_cell = col + i;
                        const y_cell = row + j;
    
                        if (x_cell >= 0 && y_cell >= 0 && x_cell < DATA.cols() && y_cell < DATA.rows()) {
                            const currentNeighbour = DATA.baseArr[col + i][row + j];
                            numNeighbours += currentNeighbour;
                        }
                    }
                }
    
                // rules
                if (cell === 1 && numNeighbours < 2) {
                    DATA.nextArr[col][row] = 0;
                } else if (cell === 1 && numNeighbours > 3) {
                    DATA.nextArr[col][row] = 0;
                } else if (cell === 0 && numNeighbours === 3) {
                    DATA.nextArr[col][row] = 1;
                }
            }
        }

        DATA.baseArr = DATA.nextArr.map(arr => [...arr]);

    }
    //================PLAY GAME METHODS==================
    //===================================================


    //================VALIDATION METHODS==================
    //===================================================


    //================UTILITY METHODS==================
    //===================================================



    //================LISTENER METHODS==================
    //===================================================


}
// MODIFIER.turn = MODIFIER.turn.bind(MODIFIER);
MODIFIER.startGame = MODIFIER.startGame.bind(MODIFIER);
MODIFIER.nextGen = MODIFIER.nextGen.bind(MODIFIER);
MODIFIER.update = MODIFIER.update.bind(MODIFIER);


//========================CLICK EVENTS============================================
// document.getElementById(`memory-game`).addEventListener(`click`, MODIFIER.turn, false);
document.getElementById(`start-game`).addEventListener(`click`, MODIFIER.startGame, false);
// document.getElementById(`reset-game`).addEventListener(`click`, MODIFIER.resetGame, false);
// MODIFIER.winkUpListener(document.querySelectorAll(`.card-front`));

// MODIFIER.startGame();
VIEW.generateCanvas();

//-----------------------------------------------------------------------------------------------------------
// const canvas = document.querySelector('canvas');
// const ctx = canvas.getContext('2d');

// const resolution = 10;
// canvas.width = 800;
// canvas.height = 800;

// const COLS = canvas.width / resolution;
// const ROWS = canvas.height / resolution;

// function buildGrid() {
//     return Array(COLS).fill(null)
//         .map(() => Array(ROWS).fill(null)
//             .map(() => Math.floor(Math.random() * 2)));
// }

// let grid = buildGrid();

// requestAnimationFrame(update);

// function update() {
//     grid = nextGen(grid);
//     render(grid);
//     requestAnimationFrame(update);
// }
// //-------------------------------------
// function nextGen(grid) {
//     nextGen = grid.map(arr => [...arr]);

//     for (let col = 0; col < grid.length; col++) {
//         for (let row = 0; row < grid[col].length; row++) {
//             const cell = grid[col][row];
//             let numNeighbours = 0;
//             for (let i = -1; i < 2; i++) {
//                 for (let j = -1; j < 2; j++) {
//                     if (i === 0 && j === 0) {
//                         continue;
//                     }
//                     const x_cell = col + i;
//                     const y_cell = row + j;

//                     if (x_cell >= 0 && y_cell >= 0 && x_cell < COLS && y_cell < ROWS) {
//                         const currentNeighbour = grid[col + i][row + j];
//                         numNeighbours += currentNeighbour;
//                     }
//                 }
//             }

//             // rules
//             if (cell === 1 && numNeighbours < 2) {
//                 nextGen[col][row] = 0;
//             } else if (cell === 1 && numNeighbours > 3) {
//                 nextGen[col][row] = 0;
//             } else if (cell === 0 && numNeighbours === 3) {
//                 nextGen[col][row] = 1;
//             }
//         }
//     }
//     return nextGen;
// }

// function render(grid) {
//     for (let col = 0; col < grid.length; col++) {
//         for (let row = 0; row < grid[col].length; row++) {
//             const cell = grid[col][row];

//             ctx.beginPath();
//             ctx.rect(col * resolution, row * resolution, resolution, resolution);
//             ctx.fillStyle = cell ? 'black' : 'white';
//             ctx.fill();
//             // ctx.stroke();
//         }
//     }
// }