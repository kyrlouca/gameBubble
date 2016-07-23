/**
 * Created by KyrLouca on 3/7/2016.
 * use this module as the mediator. object game should not be calling other objects
 */

//todo change levels with timer
//todo add sound to finish game
//todo ask user for name
//    todo ask user for level
//todo change startbutton to 3d push button
var bbShoot = window.bbShoot || {};
(function (exports) {
    "use strict";
    //window.alert('game');
    var players = [],
        gBoard,
        game,
        timer1,
        timerLevel;


    class Game {
        constructor() {
            let that    = this;
            var _level;
            this.score  = 0;
            //this.settings = {};
            this.levels = [
                {fireInterval: 2000, steps: 50},
                {fireInterval: 1500, steps: 40},
                {fireInterval: 1000, steps: 30},
                {fireInterval: 400, steps: 25},
                {fireInterval: 100, steps: 30}
            ];
            this.klevels= [
                {fireInterval: 2500, steps: 50},
                {fireInterval: 2000, steps: 45},
                {fireInterval: 1500, steps: 40},
                {fireInterval: 1200, steps: 40},
                {fireInterval: 200, steps: 20}
            ];

            this.name   = "anonumous";

            this.cBoard = bbShoot.board;
            this.isOn   = false;

            this.setLevel = function (val = 0) {
                _level = val;
                return that.levels[val];
            };
            this.getLevel = function () {
                if(_level === null) {
                    throw new Error('_level is NaN');
                }
                return _level;
            };
        }

        get level() {
            return this.getLevel();
        }

        get gSettings() {

            if (this.player.indexOf('ky')>-1){
                return this.klevels[this.getLevel()];

            }else {
                return this.levels[this.getLevel()];
            }

        }


        startGame(player) {
            // the board will start listening to mouse clicks to shoot bubbles
            var fireB;
            this.player = player;
            this.isOn   = true;
            this.score  = 0
            this.cBoard.clearBoard();
            this.cBoard.createBubbles(bbShoot.constants.rowSize, bbShoot.constants.colSize);
            this.setLevel(-1);
            this.changeLevelFreq=20*1000; // seconds to change level

            fireB                  = this.cBoard.createFireBubble();
            this.cBoard.fireBubble = fireB;
            bbShoot.drawSprite(fireB);

            this.cBoard.sprite.addEventListener('mousedown', shootOnClick);
            this.cBoard.sprite.addEventListener('dblclick', preventDblClick);

            //this.cBoard.sprite.addEventListener('mousedown', pinABubble);
            document.querySelector("#messageArea").innerText = "";
            //document.querySelector('#test2').onclick = changeLevel();
            //document.querySelector('#test3').onclick       = autoFire;

            changeLevel2();
        }

        stopGame() {
            var evt;
            this.cBoard.sprite.removeEventListener('mousedown', shootOnClick);
            this.cBoard.sprite.removeEventListener('dblclick', preventDblClick);
            clearInterval(timer1);
                playSound('audio//glassbreak.wav');
            if (this.isOn){
                players.push({name: game.player, score: game.score});
                evt = new CustomEvent('hpUpdateEvt', {detail: {players: players}});
                bbShoot.historyPlayers.sprite.dispatchEvent(evt);
                this.isOn = false;
            }

        }
    }

    var playSound = (function playSound() {
        var path         = 'audio//blib1.mp3';
        var audioElement = document.createElement('audio');
        var myPlay       = function (fPath) {
            path = fPath || path;
            audioElement.setAttribute('src', path);
            audioElement.play();
        };

        //return { play:audioElement.play.bind(audioElement)};
        return myPlay;

    })();

    var moveBubble = function (bubble, toPoint) {
        // will move the bubble towards the toPoint which is the click position offset to the board
        // bubble will stop if it hits a wall or another bubble
        // uses recursion by calling the moveit function. moveit calls itself

        var sprite      = bubble.getSprite();
        var bbSize      = bbShoot.constants.bubbleSize;
        var boardHeight = bbShoot.constants.boardHeight;
        var bbTop       = parseInt(getComputedStyle(sprite).top);//Bubble's initial top position when it got here (sprite.top would return initial declaration position)
        var bbLeft      = parseInt(getComputedStyle(sprite).left);
        var dx, dy;
        var estimateX, estimateY;// the estimate distance the bubble will travel based on the click position
        //var mouseX, mouseY;
        var steps      = 40;
        var travelledY = 0;// current distance travelled (it is not a position)
        var travelledX = 0;
        var posL, posT; // current position
        var hits       = [], realHits = 0, isWithinWalls = false;
        var isFinished = false;


        estimateY = bbTop - toPoint.top + bbSize / 2;
        estimateX = toPoint.left - bbLeft - bbSize / 2;

        steps=game.gSettings.steps;
        //steps=20;
        function moveIt() {
            var newRow, hitB, step;
            var evt;
            if(isFinished) {
                return;
            }
            step = (boardHeight / steps);

            //when travelled all the way, the dy will equal the offset step/20
            // step*1.5 is a decelarator because it makes dy smaller
            dy = Math.abs(step - (travelledY / boardHeight) * step * 1.5) + (step / 20);
            dx = dy / estimateY * estimateX;

            travelledY += dy;
            travelledX += dx;

            posL          = bbLeft + travelledX;
            posT          = bbTop - travelledY;
            isWithinWalls = (travelledY) &&
                (posL > 0 && posL < bbShoot.constants.boardWidth - bbSize) &&
                (posT > 0 && posT < bbShoot.constants.boardHeight - bbSize);

            hits = detectCollsions(bubble);
            if(hits.length > 0) {
                for(hitB of hits) {
                    if(hitB.color === bubble.color) {
                        //same color real hit
                        realHits++;
                        gBoard.removeBubble(hitB);
                        game.score++;
                        playSound('audio/blib1.mp3');

                        evt = new CustomEvent('sbScoreEvt', {detail: {val: game.score}});
                        bbShoot.scoreBoard.sprite.dispatchEvent(evt);


                    } else if(isBoardFull(bubble)) {
                        isFinished = true;
                        bubbleDance(bubble);
                        game.stopGame();
                        //window.alert('finish');
                    }
                }

            }
            if(realHits) {
                //now remove the firebubble
                gBoard.removeBubble(bubble);
            }

            if((!isWithinWalls || hits.length)) {
                //fireball has stopped on a wall or  hit a bubble but not exploded
                //make the fireball a normal bubble
                newRow = gBoard.findBubbleRow(bubble).row;
                gBoard.setBubbleRow(bubble, newRow);
                bubble.makeNormal();
            } else {
                //continue traveling
                sprite.style.left = bbLeft + travelledX + "px";
                sprite.style.top  = bbTop - travelledY + "px";
                requestAnimationFrame(moveIt);

            }
        }

        moveIt();

        bubble.getSprite().onclick = null;
    };

    function isBubbleHit(bubble1, bubble2) {
        var sprite1 = bubble1.sprite;
        var sprite2 = bubble2.sprite;
        var bbSize  = bbShoot.constants.bubbleSize;

        if(bubble1 === bubble2) {
            return false;
        }

        var sp1Top  = parseInt(getComputedStyle(sprite1).top) + bbSize / 2;
        var sp1Left = parseInt(getComputedStyle(sprite1).left) + bbSize / 2;

        var sp2Top  = parseInt(getComputedStyle(sprite2).top) + bbSize / 2;
        var sp2Left = parseInt(getComputedStyle(sprite2).left) + bbSize / 2;
        var dist    = Math.sqrt(Math.pow((sp1Top - sp2Top), 2) + Math.pow((sp1Left - sp2Left), 2));
        return dist < bbSize;
    }

    function isBoardFull(bubble) {
        var bbSize = bbShoot.constants.bubbleSize;
        var zLeft  = bbShoot.constants.boardWidth / 2 - bbSize / 2;
        var zTop   = bbShoot.constants.boardHeight - bbSize;
        var bbTop  = bubble.sprite.offsetTop;
        var bbLeft = bubble.sprite.offsetLeft;

        var dist = Math.sqrt(Math.pow(zLeft - bbLeft, 2) + Math.pow(zTop - bbTop, 2));


        return dist < bbSize;
    }

    function detectCollsions(bubble) {
        //check the cells around this bubble (above and to the sides)
        //ignore other fireballs autoshouted
        var cell       = gBoard.findBubbleRow(bubble);
        var row, i;
        var bbNear;
        var hitBubbles = [];
        for(i = cell.row; i >= cell.row - 1; i--) {
            //check all elements in array row
            row = gBoard.rows[i] || [];
            for(bbNear of row) {
                if(bubble !== bbNear && isBubbleHit(bubble, bbNear)) {
                    if(bbNear.isFire) {
                        //window.console.log('fireball hit' + bbNear.sprite.offsetTop);
                        var y;
                    } else {
                        hitBubbles.push(bbNear);
                    }
                }
            }
        }
        return hitBubbles;


    }

    function preventDblClick(e) {
        e.preventDefault();
    }
    function shootOnClick(e) {
        e.preventDefault();//to prevent doubleclick;
        //start moving the bubble towards the click point.
        var fireB;
        if(e.target.id === "board") {
            if(e.button === 2) {
                e.preventDefault();
                window.alert('right');
            } else if(e.button === 0) {
                fireB       = gBoard.fireBubble;
                var ptClick = {left: e.offsetX, top: e.offsetY};
                //moveBubble(fireB, ptClick);
                //bbShoot.board.stackFire(fireB,ptClick);
                if(fireB) {
                    moveBubble(fireB, ptClick);
                }

                fireB             = gBoard.createFireBubble();
                gBoard.fireBubble = fireB;
                bbShoot.drawSprite(fireB);
            }
        }
    }

    function shootOnTimer() {
        var x, y, point;
        var fireB;

        y     = Math.floor(Math.floor(Math.random() * bbShoot.constants.boardHeight * 4 / 5));// 4/5 of the board to avoid shooting low
        x     = Math.floor(Math.floor(Math.random() * bbShoot.constants.boardWidth));
        point = {top: y, left: x};

        fireB = gBoard.createFireBubble();
        bbShoot.drawSprite(fireB);
        moveBubble(fireB, point);
    }
    function changeLevel2(){
    //todo check if this function belongs to game class
        //call itself in x seconds by changing level
        // and set fire frequency
        //increase level which g
        var evt;
        var info   = {};


        info.level = Math.min(game.level + 1, game.levels.length - 1);
        game.setLevel(info.level);
        setFireFrequency();

        //notify scoreBoard Element
        evt = new CustomEvent('sbLevelEvt', {'detail': {val: info.level}});
        bbShoot.scoreBoard.sprite.dispatchEvent(evt);

        window.clearTimeout(timerLevel)
        timerLevel = window.setTimeout(changeLevel2, game.changeLevelFreq);// seconds to change level



    }
    function setFireFrequency() {
        //fireInterval set by level attribute
        var dt = game.gSettings.fireInterval;

        window.clearInterval(timer1);
        timer1     = window.setInterval(shootOnTimer, dt);//seconds to shoot by itself
    }

    function stopAutofire() {
        clearTimeout(timer1);
        clearInterval(timerLevel)
    }


    function bubbleDance(bubble) {
        bubble.sprite.classList.add('bobble');

    }

    function pinABubble(e) {
        var point       = {left: e.offsetX, top: e.offsetY};
        game.testBubble = bbShoot.board.pinBubble(point);
    }

    function startbbGame() {
        var nameBox    = document.querySelector('#playerNameIn'),
            playerName = nameBox.value;

        if(!nameBox.value) {
            document.querySelector("#messageArea").innerText = "Enter your name first!";
            nameBox.focus();
            return;
        }
        gBoard = bbShoot.board;
        if(!exports.game) {
            game         = new Game();
            exports.game = game;
        }
        bbShoot.scoreBoard.start(playerName);
        bbShoot.historyPlayers.start();
        game.startGame(playerName);
    }

    function test1() {
        var dt = 20;
        clearInterval(timer1);
        timer1     = setInterval(shootOnTimer, dt);//seconds to shoot by itself
        timerLevel = setInterval(changeLevel, game.changeLevelFreq);// seconds to change level
    }

    document.querySelector('#startButton').onclick = startbbGame;
    document.querySelector('#playerNameIn').onkeydown=(function(e){
            if (e.keyCode===13){
                startbbGame();
            }
    })
    document.querySelector('#test1').onclick       = test1;
    //document.querySelector('#test1').style.display = "none";

}(bbShoot));

