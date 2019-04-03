//===========================================DATA OBJECT========================================================
const DATA = {
    canvas: document.querySelector('canvas'),
    resolution: 10,
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

    changeAlert(){
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

    },

    optionsChanger() {
        if(!DATA.playing){
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
    }else{
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