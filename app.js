//===========================================DATA OBJECT========================================================
const DATA = {
    canvas: document.querySelector('canvas'),
    resolution: 10,
    width: 1000,
    height: 1000,
    fontSize: `0.5rem`,
    cols() {
        return this.width / this.resolution
    },
    rows() {
        return this.height / this.resolution
    },
    baseArr: [],
    nextArr: [],
    playing: false,
    intervalTime: 500,
    timeout: null,
    population: `average`,
    canvasStyle: `heatmap`,



};

//===========================================VIEW METHODS========================================================
const VIEW = {

    generateCanvas() {
        DATA.canvas.width = DATA.width;
        DATA.canvas.height = DATA.height;
        DATA.baseArr = MODIFIER.buildGrid();
        MODIFIER.render(DATA.baseArr);
    },

    // changeAlert() {
    //     document.getElementById(`change-alert`).innerText = `CAN'T CHANGE OPTIONS WHILE PLAYING`;
    // },
    disableOptions(bool) {
        document.querySelectorAll(`input`).forEach((x) => bool ? x.disabled = true : x.disabled = false);
    }

};

//===========================================MODIFIER METHODS========================================================
const MODIFIER = {

    startGame() {
        if (!DATA.playing) {
            DATA.playing = true;
            VIEW.disableOptions(true);
            requestAnimationFrame(this.update);
        }

    },

    resetGame() {
        DATA.playing = false;
        VIEW.disableOptions(false);
        VIEW.generateCanvas();
        clearTimeout(DATA.timeout);
    },

    pauseGame() {
        if (DATA.playing) {
            DATA.playing = false;
            VIEW.disableOptions(false);
            clearTimeout(DATA.timeout);
        }
    },

    buildGrid() {
        return Array(DATA.cols()).fill(null)
            .map(() => Array(DATA.rows()).fill(null)
                .map(() => this.populationAlg()));
    },

    populationAlg() {
        let binary;
        let random = Math.random() * 2;
        if (DATA.population === `low`) {
            binary = random > 1.3 ? 1 : 0;
        } else if (DATA.population === `average`) {
            binary = random >= 1 ? 1 : 0;
        } else {
            binary = random < 1.3 ? 1 : 0;
        }
        return binary;
    },


    update() {
        this.nextGen();
        this.render(DATA.nextArr);
        DATA.timeout = setTimeout(() => {
            requestAnimationFrame(this.update);
        }, DATA.intervalTime);

    },

    render(grid) {
        let ctx = DATA.canvas.getContext(`2d`);
        ctx.clearRect(0, 0, DATA.width, DATA.height);
        for (let col = 0; col < grid.length; col++) {
            for (let row = 0; row < grid[col].length; row++) {


                if (DATA.canvasStyle === `emojimap`) {
                    let cell = this.getCellText(grid[col][row]);
                    ctx.font = `${DATA.fontSize} Arial`;
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
            if (cell <= -3) {
                color = `#142ead`;
            } else if (cell === -2) {
                color = `#4761E0`;
            } else if (cell === -1) {
                color = `#7A94FF`;
            } else if (cell === 0) {
                color = `#ADC7FF`;
            } else if (cell === 1) {
                color = `#D1FFAD`;
            } else if (cell === 2) {
                color = `#9EFF7A`;
            } else if (cell === 3) {
                color = `#6BE047`;
            } else {
                color = `#38ad14`;
            }
        }
        return color;
    },

    getCellText(cell) {
        let emoji;
        if (cell <= -3) {
            emoji = `🧟`;
        } else if (cell === -2) {
            emoji = `👻`;
        } else if (cell === -1) {
            emoji = `⚰️`;
        } else if (cell === 0) {
            emoji = `💀`;
        } else if (cell === 1) {
            emoji = `👶`;
        } else if (cell === 2) {
            emoji = `🧑`;
        } else if (cell === 3) {
            emoji = `🧓`;
        } else {
            emoji = `🧙`;
        }
        return emoji;
    },

    nextGen() {
        DATA.nextArr = DATA.baseArr.map(arr => [...arr]);

        for (let col = 0; col < DATA.baseArr.length; col++) {
            for (let row = 0; row < DATA.baseArr[col].length; row++) {

                let cell = this.cellNextState(col, row);
                DATA.nextArr[col][row] = cell;
            }
        }

        DATA.baseArr = DATA.nextArr.map(arr => [...arr]);

    },

    cellNextState(col, row) {
        let grid = DATA.baseArr;
        let cell = grid[col][row];
        let lastIndex = grid.length - 1;
        let prevRow = row - 1;
        let prevCol = col - 1;
        let nextRow = row + 1;
        let nextCol = col + 1;
        let liveNeigh = 0;
        

        let topCenter = grid[col][prevRow] ? grid[col][prevRow] : grid[col][lastIndex];
        let leftCenter = grid[prevCol] ? grid[prevCol][row] : grid[lastIndex][row];
        let rightCenter = grid[nextCol] ? grid[nextCol][row] : grid[0][row];
        let bottomCenter = grid[col][nextRow] ? grid[col][nextRow] : grid[col][0];
        let topRight;
        let bottomLeft;
        let bottomRight;
        let topLeft;

        if (grid[nextCol]) {
            //topright
            if (grid[nextCol][prevRow]) {
                topRight = grid[nextCol][prevRow];
            } else {
                topRight = grid[nextCol][lastIndex];
            }
            //bottomright
            if (grid[nextCol][nextRow]) {
                bottomRight = grid[nextCol][nextRow];
            } else {
                bottomRight = grid[nextCol][0];
            }

        } else {
            //topright
            if (grid[0][prevRow]) {
                topRight = grid[0][prevRow];
            } else {
                topRight = grid[0][lastIndex];
            }

            //bottomright
            if (grid[0][nextRow]) {
                bottomRight = grid[0][nextRow];
            } else {
                bottomRight = grid[0][0];
            }
        }


        if (grid[prevCol]) {
            //bottom left
            if (grid[prevCol][nextRow]) {
                bottomLeft = grid[prevCol][nextRow]
            } else {
                bottomLeft = grid[prevCol][0];
            }
            //topleft
            if (grid[prevCol][prevRow]) {
                topLeft = grid[prevCol][prevRow];
            } else {
                topLeft = grid[prevCol][lastIndex]
            }
        } else {
            //bottom left
            if (grid[lastIndex][nextRow]) {
                bottomLeft = grid[lastIndex][nextRow];
            } else {
                bottomLeft = grid[lastIndex][0];
            }

            //topleft
            if (grid[lastIndex][prevRow]) {
                topLeft = grid[lastIndex][prevRow];
            } else {
                topLeft = grid[lastIndex][lastIndex];
            }
        }


        let liveNeighArr = [topCenter, leftCenter, rightCenter, bottomCenter, topRight, bottomLeft, bottomRight, topLeft];

        for (let i = 0; i < liveNeighArr.length; i++) {
            if (liveNeighArr[i] > 0) liveNeigh++;
        }

        if (cell <= 0) {
            if (liveNeigh === 3) {
                cell = 1;
            } else {
                cell--;
            }
        } else {
            if (liveNeigh < 2 || liveNeigh > 3) {
                cell = 0
            } else {
                cell++;
            }
        }
        return cell;
    },

    optionsChanger() {
        if (!DATA.playing) {
            let id = event.target.id;
            switch (id) {
                case `slow`:
                    DATA.intervalTime = 1000;
                    break;
                case `regular`:
                    DATA.intervalTime = 500;
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
                    DATA.resolution = 50;
                    DATA.fontSize = `2.5rem`;
                    DATA.canvasStyle = `emojimap`;
                    VIEW.generateCanvas();
                    break;
                case `small`:
                    DATA.width = 100;
                    DATA.height = 100;
                    DATA.resolution = 10;
                    DATA.fontSize = `0.5`;
                    VIEW.generateCanvas();
                    break;
                case `medium`:
                    DATA.width = 500;
                    DATA.height = 500;
                    DATA.resolution = 20;
                    DATA.fontSize = `1rem`;
                    VIEW.generateCanvas();
                    break;
                case `large`:
                    DATA.width = 1000;
                    DATA.height = 1000;
                    if (DATA.canvasStyle = `emojimap`) {
                        DATA.resolution = 50;
                        DATA.fontSize = `2.5rem`;
                    } else {
                        DATA.resolution = 10;
                    }
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



// //topcenter
// if(grid[col][prevRow]){
//     topCenter = grid[col][prevRow];
// }else{
//     topCenter = grid[col][lastIndex];
// }
// //leftcenter
// if(grid[prevCol]){
//     leftCenter =  grid[prevCol][row];
// }else{
//     leftCenter = grid[lastIndex][row];
// }
// //rightcenter
// if(grid[nextCol]){
//     rightCenter = grid[nextCol][row];
// }else{
//     rightCenter = grid[0][row];
// }
// //bottomcenter
// if(grid[col][nextRow]){
//     bottomCenter = grid[col][nextRow];

// }else{
//     bottomCenter = grid[col][0];
// }