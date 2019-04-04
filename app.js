//===========================================DATA OBJECT========================================================
const DATA = {
    canvas: document.querySelector('canvas'),
    resolution: 10,
    width: 1000,
    height: 1000,
    fontSize: `0.5rem`,
    cols() {
        return this.width / this.resolution;
    },
    rows() {
        return this.height / this.resolution;
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
        this.render(DATA.baseArr);
    },

    //DISABLES OPTIONS WHEN GAME IS ONGOING
    disableOptions(bool) {
        document.querySelectorAll(`input`).forEach((x) => bool ? x.disabled = true : x.disabled = false);
    },

    //RENDERS THE ARRAY OF ARRAYS INTO THE CANVAS
    render(grid) {
        let ctx = DATA.canvas.getContext(`2d`);
        ctx.clearRect(0, 0, DATA.width, DATA.height); //clears the previous state of the canvas

        for (let col = 0; col < grid.length; col++) {
            for (let row = 0; row < grid[col].length; row++) {


                if (DATA.canvasStyle === `emojimap`) { //if style is emoji, fill with text
                    let cell = MODIFIER.getCellText(grid[col][row]);
                    ctx.font = `${DATA.fontSize} Arial`;
                    ctx.fillText(cell, col * DATA.resolution, row * DATA.resolution);
                } else { //else fill with rects
                    let cellColor = MODIFIER.getCellColor(grid[col][row]);
                    ctx.beginPath();
                    ctx.rect(col * DATA.resolution, row * DATA.resolution, DATA.resolution, DATA.resolution);
                    ctx.fillStyle = cellColor;
                    ctx.fill();
                    ctx.stroke();
                }

            }
        }
    },

};

//===========================================MODIFIER METHODS========================================================
const MODIFIER = {

    //================PLAY GAME METHODS==================
    //===================================================

    //STARTS THE GAME ON PLAY AND CALLS THE FIRST REQUESTANIMATIONFRAME
    startGame() {
        if (!DATA.playing) {
            DATA.playing = true;
            VIEW.disableOptions(true);
            requestAnimationFrame(this.update);
        }
    },

    //RESETS THE GAME TO ORIGINAL STATE, MAINTAINING OPTIONS. STOPS TIMEOUT
    resetGame() {
        DATA.playing = false;
        VIEW.disableOptions(false);
        VIEW.generateCanvas();
        clearTimeout(DATA.timeout);
    },

    //STOPS TIMEOUT AND LEAVES CANVAS AS IT IS
    pauseGame() {
        if (DATA.playing) {
            DATA.playing = false;
            VIEW.disableOptions(false);
            clearTimeout(DATA.timeout);
        }
    },

    //SERVES AS RECURRENT FUNCTION TO CHANGE THE STATE OF THE CANVAS
    update() {
        this.nextGen();
        VIEW.render(DATA.nextArr);
        DATA.timeout = setTimeout(() => {
            requestAnimationFrame(this.update);
        }, DATA.intervalTime);
    },


    //================UTILITY METHODS==================
    //=================================================

    //CREATES AN ARRAY OF ARRAYS
    buildGrid() {
        return Array(DATA.cols()).fill(null)
            .map(() => Array(DATA.rows()).fill(null)
                .map(() => this.populationAlg()));
    },
    //POPULATES THE ORIGINAL ARRAY WITH MORE OR LESS LIVE CELLS DEPENDING ON SELECTION
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

    //RETURNS A DIFFERENT COLOR DEPENDING ON THE VALUE OF THE CELL PASSED
    getCellColor(cell) {
        return cell <= -3 ? `#142ead` : cell === -2 ? `#4761E0` : cell === -1 ? `#7A94FF` : cell === 0 ? `#ADC7FF` : cell === 1 ? `#D1FFAD` : cell === 2 ? `#9EFF7A` : cell === 3 ? `#6BE047` : `#38ad14`;
    },

    //RETURNS A DIFFERENT EMOJI DEPENDING ON THE VALUE OF THE CELL PASSED
    getCellText(cell) {
        return cell <= -3 ? `🧟` : cell === -2 ? `👻` : cell === -1 ? `⚰️` : cell === 0 ? `💀` : cell === 1 ? `👶` : cell === 2 ? `🧑` : cell === 3 ? `🧓` : `🧙`;
    },

    //GENERATES A NEW ARRAY BASED ON THE PREVIOUS ONE AND SETS THE ORIGINAL TO THIS ONE
    nextGen() {
        DATA.nextArr = DATA.baseArr.map(arr => [...arr]);

        for (let col = 0; col < DATA.baseArr.length; col++) {
            for (let row = 0; row < DATA.baseArr[col].length; row++) {

                DATA.nextArr[col][row] = this.cellNextState(col, row);
            }
        }

        DATA.baseArr = DATA.nextArr.map(arr => [...arr]);
    },

    //CALCULATES THE VALUE OF THE CURRENT CELL DEPENDING ON ITS CURRENT NEIGHBOURS
    cellNextState(col, row) {
        //VARIABLES FOR UNDERSTANDABLE MANIPULATION
        let grid = DATA.baseArr,
            cell = grid[col][row],
            lastIndex = grid.length - 1,
            prevRow = row - 1,
            prevCol = col - 1,
            nextRow = row + 1,
            nextCol = col + 1,
            liveNeigh = 0,

            //CROSS SECTION NEIGHBOURS
            topCenter = grid[col][prevRow] ? grid[col][prevRow] : grid[col][lastIndex],
            leftCenter = grid[prevCol] ? grid[prevCol][row] : grid[lastIndex][row],
            rightCenter = grid[nextCol] ? grid[nextCol][row] : grid[0][row],
            bottomCenter = grid[col][nextRow] ? grid[col][nextRow] : grid[col][0],

            //DIAGONAL SECTION NEIGHBOURS
            topRight,
            bottomLeft,
            bottomRight,
            topLeft;

        //right side of the grid
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

        //left side of the grid
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


        //iterate over neighbours and add 1 to live neighbours if it it is alive;
        [topCenter, leftCenter, rightCenter, bottomCenter, topRight, bottomLeft, bottomRight, topLeft].map(x => {
            if (x > 0) liveNeigh++
        });

        return this.ruling(cell, liveNeigh);
    },

    //RULES IF A CELL SHOULD LIVE OR DIE DEPENDING ON ITS NEIGHBOURS
    ruling(cell, liveNeigh) {
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

    //HANDLER FOR ALL OF THE OPTIONS
    optionsChanger() {
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
                if (DATA.canvasStyle === `emojimap`) {
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

    },

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