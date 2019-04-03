//===========================================DATA OBJECT========================================================
const DATA = {
    canvas: document.querySelector('canvas'),
    resolution: 50,
    width: 1000,
    height: 1000,
    cols() {
        return this.width / this.resolution
    },
    rows() {
        return this.height / this.resolution
    },
    baseArr: [],
    nextArr: [],
    playing: false,
    intervalTime: 200,
    timeout: null,
    population: `average`,
    canvasStyle: `emojimap`,



};

//===========================================VIEW METHODS========================================================
const VIEW = {

    generateCanvas() {
        DATA.canvas.width = DATA.width;
        DATA.canvas.height = DATA.height;
        DATA.baseArr = MODIFIER.buildGrid();
        MODIFIER.render(DATA.baseArr);
    },

    changeAlert() {
        document.getElementById(`change-alert`).innerText = `CAN'T CHANGE OPTIONS WHILE PLAYING`;
    }

};

//===========================================MODIFIER METHODS========================================================
const MODIFIER = {

    startGame() {
        if (!DATA.playing) {
            DATA.playing = true;
            requestAnimationFrame(this.update);
        }

    },

    resetGame() {
        DATA.playing = false;
        VIEW.generateCanvas();
        clearTimeout(DATA.timeout);
    },

    pauseGame() {
        if (DATA.playing) {
            DATA.playing = false;
            clearTimeout(DATA.timeout);
        }
    },

    buildGrid() {
        return Array(DATA.cols()).fill(null)
            .map(() => Array(DATA.rows()).fill(null)
                .map(() => Math.floor(Math.random() * 2)));
    },

    populationAlg() {

    },


    update() {
        this.nextGen();
        this.render(DATA.nextArr);
        DATA.timeout = setTimeout(() => {
            requestAnimationFrame(this.update);
        }, DATA.intervalTime);

    },

    render(grid) {
        for (let col = 0; col < grid.length; col++) {
            for (let row = 0; row < grid[col].length; row++) {
                // const cell = grid[col][row];
                let ctx = DATA.canvas.getContext(`2d`);
                // ctx.beginPath();
                // ctx.rect(col * DATA.resolution, row * DATA.resolution, DATA.resolution, DATA.resolution);
                // ctx.fillStyle = cell ? 'black' : 'white';
                // ctx.fill();
                // ctx.stroke();

                if (DATA.canvasStyle === `emojimap`) {
                    let cell = this.getCellText(grid[col][row]);
                    ctx.font = "2rem Arial";
                    ctx.fillText(cell, col * DATA.resolution, row * DATA.resolution);
                } else {
                    let cellColor = this.getCellColor(grid[col][row]);
                    ctx.beginPath();
                    ctx.rect(col * DATA.resolution, row * DATA.resolution, DATA.resolution, DATA.resolution);
                    ctx.fillStyle = cellColor;
                    ctx.fill();
                    ctx.stroke();
                }
            }
        }
    },

    getCellColor(cell) {
        let color;
        if (DATA.canvasStyle === `black-white`) {
            color = cell > 0 ? `#333333` : `#E6E6E6`;
        } else {
            switch (cell) {
                case (cell <= -3):
                    color = `#142ead`;
                    break;
                case -2:
                    color = `#4761E0`;
                    break;
                case -1:
                    color = `#7A94FF`;
                    break;
                case 0:
                    color = `#ADC7FF`;
                    break;
                case 1:
                    color = `#D1FFAD`;
                    break;
                case 2:
                    color = `#9EFF7A`;
                    break;
                case 3:
                    color = `#6BE047`;
                    break;
                case (cell >= 4):
                    color = `#38ad14`;
                    break;
            }
        }
        return color;
    },

    getCellText(cell) {
        let emoji;
        switch (cell) {
            case (cell <= -3):
                emoji = `🧟`;
                break;
            case -2:
                emoji = `🌳`;
                break;
            case -1:
                emoji = `⚰️`;
                break;
            case 0:
                emoji = `💀`;
                break;
            case 1:
                emoji = [`👨`, `👩`][Math.floor(Math.random() * 2)];
                break;
            case 2:
                emoji = [`👨‍🚀`, `👩‍🚀`][Math.floor(Math.random() * 2)];
                break;
            case 3:
                emoji = [`👴`, `👵`][Math.floor(Math.random() * 2)];
                break;
            case (cell >= 4):
                emoji = [`🧙`, `🧙‍♀️`][Math.floor(Math.random() * 2)];
                break;
        }
        return emoji;
    },

    nextGen() {
        DATA.nextArr = DATA.baseArr.map(arr => [...arr]);

        for (let col = 0; col < DATA.baseArr.length; col++) {
            for (let row = 0; row < DATA.baseArr[col].length; row++) {

                let cell = this.cellNextState(col, row);
                DATA.nextArr[col][row] = cell;
                // const cell = DATA.baseArr[col][row];
                // let numNeighbours = 0;
                // for (let i = -1; i < 2; i++) {
                //     for (let j = -1; j < 2; j++) {
                //         if (i === 0 && j === 0) {
                //             continue;
                //         }
                //         const x_cell = col + i;
                //         const y_cell = row + j;

                //         if (x_cell >= 0 && y_cell >= 0 && x_cell < DATA.cols() && y_cell < DATA.rows()) {
                //             const currentNeighbour = DATA.baseArr[col + i][row + j];
                //             numNeighbours += currentNeighbour;
                //         }
                //     }
                // }

                // // rules
                // if (cell === 1 && numNeighbours < 2) {
                //     DATA.nextArr[col][row] = 0;
                // } else if (cell === 1 && numNeighbours > 3) {
                //     DATA.nextArr[col][row] = 0;
                // } else if (cell === 0 && numNeighbours === 3) {
                //     DATA.nextArr[col][row] = 1;
                // }



            }
        }

        DATA.baseArr = DATA.nextArr.map(arr => [...arr]);

    },

    cellNextState(col, row) {
        let grid = DATA.baseArr;
        let cell = grid[col][row];
        let lastIndex = grid.length -1;
        let prevRow = row - 1;
        let prevCol = col - 1;
        let nextRow = row + 1;
        let nextCol = col + 1;
        let liveNeigh = 0;


        let topCenter;
        let leftCenter;
        let rightCenter;
//-------------------------------============================================--------------------------------------------------
        //topcenter
        if(grid[col][prevRow]){
            topCenter = grid[col][prevRow];
        }else{
            topCenter = grid[col][lastIndex];
        }
        //leftcenter
        if(grid[prevCol]){
            leftCenter =  grid[prevCol][row];
        }else{
            leftCenter = grid[lastIndex][row];
        }
        //rightcenter
        if(grid[nextCol]){
            rightCenter = grid[nextCol][row];
        }else{
            rightCenter = grid[0][row];
        }
        //bottomcenter
        if(grid[col][nextRow]){
            bottomCenter = grid[col][nextRow];

        }else{
            bottomCenter = grid[col][0];
        }

 // let topRight = DATA.baseArr[nextCol][prevRow] !== undefined ?
// DATA.baseArr[nextCol][prevRow] : 
// DATA.baseArr[0][lastIndex] !== undefined ?
// DATA.baseArr[0][lastIndex] :
// DATA.baseArr[nextCol][lastIndex] !== undefined ?
// DATA.baseArr[nextCol][lastIndex] :
// DATA.baseArr[0][prevRow];


// let bottomLeft = DATA.baseArr[prevCol][nextRow] !== undefined ? 
// DATA.baseArr[prevCol][nextRow] : 
// DATA.baseArr[lastIndex][0] !== undefined ?
// DATA.baseArr[lastIndex][0] :
// DATA.baseArr[prevCol][0] !== undefined ?
// DATA.baseArr[prevCol][0] :
// DATA.baseArr[lastIndex][nextRow];

// let bottomRight = DATA.baseArr[nextCol][nextRow] !== undefined ? 
//    DATA.baseArr[nextCol][nextRow] :
//    DATA.baseArr[0][0] !== undefined ?
//    DATA.baseArr[0][0] :
//    DATA.baseArr[nextCol][0] !== undefined ?
//    DATA.baseArr[nextCol][0] :
//    DATA.baseArr[0][nextRow];

// let topLeft = DATA.baseArr[prevCol][prevRow] !== undefined ?
//    DATA.baseArr[prevCol][prevRow] :
//    DATA.baseArr[lastIndex][lastIndex] !== undefined ?
//    DATA.baseArr[lastIndex][lastIndex] :
//    DATA.baseArr[prevCol][lastIndex] !== undefined ?
//    DATA.baseArr[prevCol][lastIndex] :
//    DATA.baseArr[lastIndex][prevRow];

            // liveNeigh = [topCenter,leftCenter,rightCenter,bottomCenter,topRight,bottomLeft,bottomRight,topLeft].reduce( (acc,curr) => curr > 0 ? acc++ : acc = acc );
        // const cell = DATA.baseArr[col][row];
        // let numNeighbours = 0;
        // for (let i = -1; i < 2; i++) {
        //     for (let j = -1; j < 2; j++) {
        //         if (i === 0 && j === 0) {
        //             continue;
        //         }
        //         const x_cell = col + i;
        //         const y_cell = row + j;

        //         if (x_cell >= 0 && y_cell >= 0 && x_cell < DATA.cols() && y_cell < DATA.rows()) {
        //             const currentNeighbour = DATA.baseArr[col + i][row + j];
        //             numNeighbours += currentNeighbour;
        //         }
        //     }
        // }

        // // rules
        // if (cell === 1 && numNeighbours < 2) {
        //     DATA.nextArr[col][row] = 0;
        // } else if (cell === 1 && numNeighbours > 3) {
        //     DATA.nextArr[col][row] = 0;
        // } else if (cell === 0 && numNeighbours === 3) {
        //     DATA.nextArr[col][row] = 1;
        // }

    },

    optionsChanger() {
        if (!DATA.playing) {
            let id = event.target.id;
            switch (id) {
                case `slow`:
                    DATA.intervalTime = 500;
                    break;
                case `regular`:
                    DATA.intervalTime = 200;
                    break;
                case `fast`:
                    DATA.intervalTime = 0;
                    break;
                case `black-white`:
                    DATA.canvasStyle = `black-white`;
                    VIEW.generateCanvas();
                    break;
                case `heatmap`:
                    DATA.canvasStyle = `heatmap`;
                    VIEW.generateCanvas();
                    break;
                case `emojimap`:
                    DATA.canvasStyle = `emojimap`;
                    VIEW.generateCanvas();
                    break;
                case `small`:
                    DATA.width = 100;
                    DATA.height = 100;
                    DATA.resolution = 5;
                    VIEW.generateCanvas();
                    break;
                case `medium`:
                    DATA.width = 500;
                    DATA.height = 500;
                    DATA.resolution = 5;
                    VIEW.generateCanvas();
                    break;
                case `large`:
                    DATA.width = 1000;
                    DATA.height = 1000;
                    DATA.resolution = 10;
                    VIEW.generateCanvas();
                    break;
                case `low`:
                    DATA.population = `low`;
                    VIEW.generateCanvas();
                    break;
                case `average`:
                    DATA.population = `average`;
                    VIEW.generateCanvas();
                    break;
                case `high`:
                    DATA.population = `high`;
                    VIEW.generateCanvas();
                    break;
                default:
                    return
            }
        } else {
            VIEW.changeAlert();
        }
    },
    //================PLAY GAME METHODS==================
    //===================================================


    //================VALIDATION METHODS==================
    //===================================================


    //================UTILITY METHODS==================
    //===================================================



    //================LISTENER METHODS==================
    //===================================================
    optionsListener() {
        let radioButtons = document.querySelectorAll(`input`);
        radioButtons.forEach(x => x.addEventListener(`click`, MODIFIER.optionsChanger));
    },

}
MODIFIER.startGame = MODIFIER.startGame.bind(MODIFIER);
MODIFIER.nextGen = MODIFIER.nextGen.bind(MODIFIER);
MODIFIER.update = MODIFIER.update.bind(MODIFIER);


//========================CLICK EVENTS============================================
document.getElementById(`start-game`).addEventListener(`click`, MODIFIER.startGame, false);
document.getElementById(`reset-game`).addEventListener(`click`, MODIFIER.resetGame, false);
document.getElementById(`pause-game`).addEventListener(`click`, MODIFIER.pauseGame, false);
MODIFIER.optionsListener();

//========================DOCUMENT READY============================================

VIEW.generateCanvas();


        // let topCenter = DATA.baseArr[col][row - 1] !== undefined ? DATA.baseArr[col][row - 1] : DATA.baseArr[col][lastIndex];
        // let leftCenter = DATA.baseArr[col - 1][row] !== undefined ? DATA.baseArr[col - 1][row] : DATA.baseArr[lastIndex][row];
        // let rightCenter = DATA.baseArr[col + 1][row] !== undefined ? DATA.baseArr[col + 1][row] : DATA.baseArr[0][row];
        // let bottomCenter = DATA.baseArr[col][row + 1] !== undefined ? DATA.baseArr[col][row + 1] : DATA.baseArr[col][0];


// let topRight = DATA.baseArr[nextCol][prevRow] !== undefined ?
// DATA.baseArr[nextCol][prevRow] : 
// DATA.baseArr[0][lastIndex] !== undefined ?
// DATA.baseArr[0][lastIndex] :
// DATA.baseArr[nextCol][lastIndex] !== undefined ?
// DATA.baseArr[nextCol][lastIndex] :
// DATA.baseArr[0][prevRow];


// let bottomLeft = DATA.baseArr[prevCol][nextRow] !== undefined ? 
// DATA.baseArr[prevCol][nextRow] : 
// DATA.baseArr[lastIndex][0] !== undefined ?
// DATA.baseArr[lastIndex][0] :
// DATA.baseArr[prevCol][0] !== undefined ?
// DATA.baseArr[prevCol][0] :
// DATA.baseArr[lastIndex][nextRow];

// let bottomRight = DATA.baseArr[nextCol][nextRow] !== undefined ? 
//    DATA.baseArr[nextCol][nextRow] :
//    DATA.baseArr[0][0] !== undefined ?
//    DATA.baseArr[0][0] :
//    DATA.baseArr[nextCol][0] !== undefined ?
//    DATA.baseArr[nextCol][0] :
//    DATA.baseArr[0][nextRow];

// let topLeft = DATA.baseArr[prevCol][prevRow] !== undefined ?
//    DATA.baseArr[prevCol][prevRow] :
//    DATA.baseArr[lastIndex][lastIndex] !== undefined ?
//    DATA.baseArr[lastIndex][lastIndex] :
//    DATA.baseArr[prevCol][lastIndex] !== undefined ?
//    DATA.baseArr[prevCol][lastIndex] :
//    DATA.baseArr[lastIndex][prevRow];