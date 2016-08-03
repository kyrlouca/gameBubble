'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by KyrLouca on 1/7/2016.
 */
var bbShoot = window.bbShoot || {};
(function (exports) {
    "use strict";

    exports.Bubble = function () {
        function Bubble(row, col, lowZ) {
            _classCallCheck(this, Bubble);

            var status = 0;
            this.isFire = false;
            this.row = row;
            this.col = col;
            this.lowZ = lowZ;
            var color = Math.floor(Math.random() * 4);

            this.sprite = document.createElement('div');
            this.sprite.classList.add('bubble');
            this.sprite.objBubble = this; // get bubble object from sprite

            this.changeColor(color);
            this.makeNormal();

            this.nextStatus = function () {
                //cannot move it oustide constructor because has access to private var status
                status += 1;
                status = status % 4;
                this.changeColor(status);
            };
        }

        _createClass(Bubble, [{
            key: 'makeFire',
            value: function makeFire() {
                this.isFire = true;
                this.changeShape(2);
            }
        }, {
            key: 'makeNormal',
            value: function makeNormal() {
                this.isFire = false;
                this.changeShape(0);
            }
        }, {
            key: 'getSprite',
            value: function getSprite() {
                return this.sprite;
            }
            //get isFire(){return this.isFire;}
            //set isFire(isFire){isFire=true;}

        }, {
            key: 'changeColor',
            value: function changeColor(pos) {
                pos = pos % 4;
                this.color = pos;
                this.sprite.style.backgroundPositionY = pos * 50 + "px";
            }
        }, {
            key: 'changeShape',
            value: function changeShape(shape) {
                this.sprite.style.backgroundPositionX = shape * 50 + "px";
            }
        }]);

        return Bubble;
    }();
})(bbShoot);
/**
 * Created by KyrLouca on 1/7/2016.
 */
var bbShoot = window.bbShoot || {};
(function (exports) {
    "use strict";

    exports.drawSprite = function (bubble, point) {
        if (point) {
            bubble.left = point.left;
            bubble.top = point.top;
        }

        var board = document.querySelector('#board');
        var sprite = bubble.getSprite();

        sprite.style.top = bubble.top + "px";
        sprite.style.left = bubble.left + "px";
        if (bubble.lowZ) {
            sprite.classList.add('belowBubble');
        }
        board.appendChild(sprite);
    };

    exports.constants = function () {
        //IIEF because I do not want boardwidth to be calculated every time boardheight is used
        return {
            bubbleSize: 50,
            rowSize: 3,
            colSize: 7,
            boardHeight: function () {
                var board = document.querySelector('#board');
                return parseInt(getComputedStyle(board).height);
            }(),
            boardWidth: function () {
                var board = document.querySelector('#board');
                return parseInt(getComputedStyle(board).width);
            }()
        };
    }();
})(bbShoot);
/**
 * Created by KyrLouca on 17/7/2016.
 */
var bbShoot = window.bbShoot || {};
(function (exports) {
    "use strict";

    var score = function () {
        function score() {
            _classCallCheck(this, score);

            this.score = 0;
            this.level = 0;
            this.sprite = document.querySelector("#infoSide");
        }

        _createClass(score, [{
            key: 'start',
            value: function start(name) {
                this.score = 0;
                this.level = 0;

                this.sprite.querySelector("#playerName").innerText = name;
                this.sprite.querySelector("#score").innerText = "00";
                this.sprite.querySelector("#level").innerText = "0";
                this.sprite.querySelector("#playerNameIn").value = "";

                this.sprite.addEventListener("sbScoreEvt", this.updateScore.bind(this));
                this.sprite.addEventListener("sbLevelEvt", this.updateLevel.bind(this));
            }
        }, {
            key: 'stop',
            value: function stop() {}
        }, {
            key: 'updateScore',
            value: function updateScore(evt) {
                this.score = evt.detail.val;

                var str = this.score.toLocaleString('en-US', {
                    minimumIntegerDigits: 2,
                    useGrouping: false
                });
                var score = this.sprite.querySelector("#score");
                score.innerText = str;
            }
        }, {
            key: 'updateLevel',
            value: function updateLevel(evt) {
                this.level = evt.detail.val;
                var level = this.sprite.querySelector("#level");
                level.innerText = this.level;
            }
        }]);

        return score;
    }();

    exports.scoreBoard = new score();
})(bbShoot);
/**
 * Created by KyrLouca on 17/7/2016.
 */
var bbShoot = window.bbShoot || {};
(function (exports) {
    "use strict";

    var historyPlayers = function () {
        function historyPlayers() {
            _classCallCheck(this, historyPlayers);

            this.players = {};
            this.sprite = document.querySelector("#historySide");
            this.sprite.querySelector("#historyList").innerHTML = "";
        }

        _createClass(historyPlayers, [{
            key: 'start',
            value: function start(name) {
                this.sprite.addEventListener("hpUpdateEvt", this.updateHistory.bind(this));
            }
        }, {
            key: 'stop',
            value: function stop() {}
        }, {
            key: 'updateHistory',
            value: function updateHistory(evt) {

                function fillStr(str) {
                    var n = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
                    var fchar = arguments.length <= 2 || arguments[2] === undefined ? ' ' : arguments[2];

                    var i,
                        strN = '';
                    if (typeof str === 'number') {
                        strN = str.toLocaleString('en-US', { minimumIntegerDigits: n, useGrouping: false });
                    } else {
                        for (i = 0; i < n; i++) {
                            strN += str[i] || fchar;
                        }
                    }

                    return strN;
                }
                var test = fillStr('ab', 4, '+');
                var player, historyList, formattedStr;
                var players = evt.detail.players;
                //alert('hey')
                var compare = function compare(a, b) {
                    return a.score > b.score ? -1 : 1;
                };
                players.sort(compare);

                window.console.log(players.map(function (el) {
                    return el.name;
                }).toString());

                //this.sprite.querySelector("#playerName").innerText = name;
                historyList = this.sprite.querySelector("#historyList");
                historyList.innerHTML = '';
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = players[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        player = _step.value;

                        window.console.log(player.name);

                        var f1 = document.createElement('p');
                        f1.classList.add('hpAll', 'hpLeft');
                        f1.appendChild(document.createTextNode(player.name));

                        var f2 = document.createElement('p');
                        f2.classList.add('hpAll', 'hpRight');
                        f2.appendChild(document.createTextNode('' + player.score));

                        var li = document.createElement('li');
                        li.appendChild(f1);
                        li.appendChild(f2);
                        //formattedStr=fillStr(player.name,7)+'-'+fillStr(player.score,3,'0')
                        //formattedStr=fillStr(player.name,7)+'-'+fillStr(player.score,3,'0')

                        //li.appendChild(document.createTextNode(formattedStr));

                        historyList.appendChild(li);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }
        }]);

        return historyPlayers;
    }();

    exports.historyPlayers = new historyPlayers();
})(bbShoot);
/**
 * Created by KyrLouca on 5/7/2016.
 */
var bbShoot = window.bbShoot || {};
(function (exports) {
    "use strict";

    var Board = function () {
        function Board() {
            _classCallCheck(this, Board);

            this.rows = [];
            this.boardElement = document.querySelector("#board");
            this.score = 0;
            this.fireStack = [];
        }

        _createClass(Board, [{
            key: 'createBubble',
            value: function createBubble(row, col) {
                var bubble = new bbShoot.Bubble(row, col);
                if (!this.rows[row]) {
                    this.rows[row] = [];
                }
                this.row = 0;
                this.col = 0;
                this.rows[row].push(bubble);
                return bubble;
            }
        }, {
            key: 'pinBubble',
            value: function pinBubble(point) {
                //click and will create a bubble there
                //point has the x and y of mouseevent offsets
                var top, left;
                var brdheight = bbShoot.constants.boardHeight;
                var brdwidth = bbShoot.constants.boardWidth;
                var bbSize = bbShoot.constants.bubbleSize;

                var bubble = this.createBubble(0, 0);

                top = point.top - bbSize / 2;
                top = Math.max(top, 0);
                top = Math.min(top, brdheight - bbSize);

                left = point.left - bbSize / 2;
                left = Math.max(left, 0);
                left = Math.min(left, brdwidth - bbSize);

                point = { left: left, top: top };

                bbShoot.drawSprite(bubble, point);
                this.rearrangeBubble(bubble, point);
                bubble.sprite.innerText = 'x:' + point.left + ' y:' + point.top;

                return bubble;
            }
        }, {
            key: 'removeBubble',
            value: function removeBubble(bubble) {
                this.sprite.removeChild(bubble.sprite);
                var row = this.rows[bubble.row];
                var col = row.indexOf(bubble);
                if (col !== -1) {
                    this.rows[bubble.row].splice(col, 1);
                }
            }
        }, {
            key: 'findBubbleRow',
            value: function findBubbleRow(bubble) {
                //find in which cell grid is located the center of the bubbl
                var bbSize = bbShoot.constants.bubbleSize;
                var sprite = bubble.getSprite();
                var spTop = parseInt(getComputedStyle(sprite).top) + bbSize / 2;
                var spLeft = parseInt(getComputedStyle(sprite).left) + bbSize / 2;

                var row = Math.floor(spTop / bbSize);
                var col = Math.floor(spLeft / bbSize);
                return { row: row, col: col };
            }
        }, {
            key: 'getBubbleCenter',
            value: function getBubbleCenter(bubble) {
                //find in which cell grid is located the center of the bubbl
                var bbSize = bbShoot.constants.bubbleSize;
                var sprite = bubble.getSprite();
                var spTop = parseInt(getComputedStyle(sprite).top) + bbSize / 2;
                var spLeft = parseInt(getComputedStyle(sprite).left) + bbSize / 2;
                return { top: spTop, left: spLeft };
            }
        }, {
            key: 'setBubbleRow',
            value: function setBubbleRow(bubble, newRow) {
                var currentRow = bubble.row;

                //move the fireball to the proper row
                var i = this.rows[bubble.row].indexOf(bubble);
                if (i !== -1) {
                    this.rows[bubble.row].splice(i, 1);
                    if (!this.rows[newRow]) {
                        this.rows[newRow] = [];
                    }
                    bubble.row = newRow;
                    this.rows[newRow].push(bubble);
                }
                return bubble;
            }
        }, {
            key: 'rearrangeBubble',
            value: function rearrangeBubble(bubble, point) {
                //this is all you need to correct array depending on the bubble actual position
                //place bubble in correct row
                var currentRow = bubble.row;
                var newRow = this.findBubbleRow(bubble);
                //move the fireball to the proper row
                var i = this.rows[bubble.row].indexOf(bubble);
                if (i !== -1) {
                    this.rows[bubble.row].splice(i, 1);
                    if (!this.rows[newRow]) {
                        this.rows[newRow] = [];
                    }
                    bubble.row = newRow;
                    this.rows[newRow].push(bubble);
                }
                return bubble;
            }
        }, {
            key: 'createFireBubble',
            value: function createFireBubble() {
                var bbsize = bbShoot.constants.bubbleSize;

                var row = Math.ceil(bbShoot.constants.boardHeight / bbsize) - 1;
                var bubble = this.createBubble(row, 0);
                bubble.top = row * bbsize;
                bubble.left = bbShoot.constants.boardWidth / 2 - bbsize / 2;
                bubble.makeFire();
                //this.fireBubble = bubble;
                return bubble;
            }
        }, {
            key: 'createBubbles',
            value: function createBubbles(rowCount, colCount) {
                var bubble, point, brdHeight, brdWidth, bbSize, left, offset;
                bbSize = bbShoot.constants.bubbleSize;
                brdHeight = bbShoot.constants.boardHeight;
                brdWidth = bbShoot.constants.boardWidth;

                for (var i = 0; i < rowCount; i++) {
                    for (var j = 0; j < colCount; j++) {
                        left = j * bbSize;
                        offset = i % 2 ? 0 : bbSize / 2;

                        point = { top: i * bbSize, left: offset + j * bbSize };
                        bubble = this.createBubble(i, j);
                        bbShoot.drawSprite(bubble, point);
                    }
                }
            }
        }, {
            key: 'addPoints',
            value: function addPoints(points) {
                this.score += points;
            }
        }, {
            key: 'getArray',
            value: function getArray() {
                var aa = '';

                function kcon(aRow) {
                    return aRow.map(function (el) {
                        return el.row;
                    }).join('-');
                }

                this.rows.forEach(function (row, i) {
                    aa = aa + 'row:' + i + ' ' + kcon(row) + '\n';
                });

                return aa;
            }
        }, {
            key: 'clearBoard',
            value: function clearBoard() {
                //window.alert('clear board');
                var el, sp;
                var that = this;
                this.score = 0;
                this.rows.forEach(function (row, i) {
                    row.forEach(function (el) {
                        that.boardElement.removeChild(el.sprite);
                    });
                });
                this.rows = [];
            }
        }, {
            key: 'stackFire',
            value: function stackFire(bubble, point) {
                this.fireStack.push({ bubble: bubble, point: point });
                //console.log('he');
            }
        }, {
            key: 'sprite',
            get: function get() {
                return this.boardElement;
            }
        }]);

        return Board;
    }();

    if (!exports.board) {
        exports.board = new Board();
    }
})(bbShoot);
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

    var Game = function () {
        function Game() {
            _classCallCheck(this, Game);

            var that = this;
            var _level;
            this.score = 0;
            //this.settings = {};
            this.levels = [{ fireInterval: 2000, steps: 50 }, { fireInterval: 1500, steps: 40 }, { fireInterval: 1000, steps: 30 }, { fireInterval: 400, steps: 25 }, { fireInterval: 100, steps: 30 }];
            this.klevels = [{ fireInterval: 2500, steps: 50 }, { fireInterval: 2000, steps: 45 }, { fireInterval: 1500, steps: 40 }, { fireInterval: 1200, steps: 40 }, { fireInterval: 200, steps: 20 }];

            this.name = "anonumous";

            this.cBoard = bbShoot.board;
            this.isOn = false;

            this.setLevel = function () {
                var val = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

                _level = val;
                return that.levels[val];
            };
            this.getLevel = function () {
                if (_level === null) {
                    throw new Error('_level is NaN');
                }
                return _level;
            };
        }

        _createClass(Game, [{
            key: 'startGame',
            value: function startGame(player) {
                // the board will start listening to mouse clicks to shoot bubbles
                var fireB;
                this.player = player;
                this.isOn = true;
                this.score = 0;
                this.cBoard.clearBoard();
                this.cBoard.createBubbles(bbShoot.constants.rowSize, bbShoot.constants.colSize);
                this.setLevel(-1);
                this.changeLevelFreq = 20 * 1000; // seconds to change level

                fireB = this.cBoard.createFireBubble();
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
        }, {
            key: 'stopGame',
            value: function stopGame() {
                var evt;
                this.cBoard.sprite.removeEventListener('mousedown', shootOnClick);
                this.cBoard.sprite.removeEventListener('dblclick', preventDblClick);
                clearInterval(timer1);
                playSound('resources//audio//glassbreak.wav');
                if (this.isOn) {
                    players.push({ name: game.player, score: game.score });
                    evt = new CustomEvent('hpUpdateEvt', { detail: { players: players } });
                    bbShoot.historyPlayers.sprite.dispatchEvent(evt);
                    this.isOn = false;
                }
            }
        }, {
            key: 'level',
            get: function get() {
                return this.getLevel();
            }
        }, {
            key: 'gSettings',
            get: function get() {

                if (this.player.indexOf('ky') > -1) {
                    return this.klevels[this.getLevel()];
                } else {
                    return this.levels[this.getLevel()];
                }
            }
        }]);

        return Game;
    }();

    var playSound = function playSound() {
        var path = 'resources//audio//blib1.mp3';
        var audioElement = document.createElement('audio');
        var myPlay = function myPlay(fPath) {
            path = fPath || path;
            audioElement.setAttribute('src', path);
            audioElement.play();
        };

        //return { play:audioElement.play.bind(audioElement)};
        return myPlay;
    }();

    var moveBubble = function moveBubble(bubble, toPoint) {
        // will move the bubble towards the toPoint which is the click position offset to the board
        // bubble will stop if it hits a wall or another bubble
        // uses recursion by calling the moveit function. moveit calls itself

        var sprite = bubble.getSprite();
        var bbSize = bbShoot.constants.bubbleSize;
        var boardHeight = bbShoot.constants.boardHeight;
        var bbTop = parseInt(getComputedStyle(sprite).top); //Bubble's initial top position when it got here (sprite.top would return initial declaration position)
        var bbLeft = parseInt(getComputedStyle(sprite).left);
        var dx, dy;
        var estimateX, estimateY; // the estimate distance the bubble will travel based on the click position
        //var mouseX, mouseY;
        var steps = 40;
        var travelledY = 0; // current distance travelled (it is not a position)
        var travelledX = 0;
        var posL, posT; // current position
        var hits = [],
            realHits = 0,
            isWithinWalls = false;
        var isFinished = false;

        estimateY = bbTop - toPoint.top + bbSize / 2;
        estimateX = toPoint.left - bbLeft - bbSize / 2;

        steps = game.gSettings.steps;
        //steps=20;
        function moveIt() {
            var newRow, hitB, step;
            var evt;
            if (isFinished) {
                return;
            }
            step = boardHeight / steps;

            //when travelled all the way, the dy will equal the offset step/20
            // step*1.5 is a decelarator because it makes dy smaller
            dy = Math.abs(step - travelledY / boardHeight * step * 1.5) + step / 20;
            dx = dy / estimateY * estimateX;

            travelledY += dy;
            travelledX += dx;

            posL = bbLeft + travelledX;
            posT = bbTop - travelledY;
            isWithinWalls = travelledY && posL > 0 && posL < bbShoot.constants.boardWidth - bbSize && posT > 0 && posT < bbShoot.constants.boardHeight - bbSize;

            hits = detectCollsions(bubble);
            if (hits.length > 0) {
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = hits[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        hitB = _step2.value;

                        if (hitB.color === bubble.color) {
                            //same color real hit
                            realHits++;
                            gBoard.removeBubble(hitB);
                            game.score++;
                            playSound('resources/audio/blib1.mp3');

                            evt = new CustomEvent('sbScoreEvt', { detail: { val: game.score } });
                            bbShoot.scoreBoard.sprite.dispatchEvent(evt);
                        } else if (isBoardFull(bubble)) {
                            isFinished = true;
                            bubbleDance(bubble);
                            game.stopGame();
                            //window.alert('finish');
                        }
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }
            }
            if (realHits) {
                //now remove the firebubble
                gBoard.removeBubble(bubble);
            }

            if (!isWithinWalls || hits.length) {
                //fireball has stopped on a wall or  hit a bubble but not exploded
                //make the fireball a normal bubble
                newRow = gBoard.findBubbleRow(bubble).row;
                gBoard.setBubbleRow(bubble, newRow);
                bubble.makeNormal();
            } else {
                //continue traveling
                sprite.style.left = bbLeft + travelledX + "px";
                sprite.style.top = bbTop - travelledY + "px";
                requestAnimationFrame(moveIt);
            }
        }

        moveIt();

        bubble.getSprite().onclick = null;
    };

    function isBubbleHit(bubble1, bubble2) {
        var sprite1 = bubble1.sprite;
        var sprite2 = bubble2.sprite;
        var bbSize = bbShoot.constants.bubbleSize;

        if (bubble1 === bubble2) {
            return false;
        }

        var sp1Top = parseInt(getComputedStyle(sprite1).top) + bbSize / 2;
        var sp1Left = parseInt(getComputedStyle(sprite1).left) + bbSize / 2;

        var sp2Top = parseInt(getComputedStyle(sprite2).top) + bbSize / 2;
        var sp2Left = parseInt(getComputedStyle(sprite2).left) + bbSize / 2;
        var dist = Math.sqrt(Math.pow(sp1Top - sp2Top, 2) + Math.pow(sp1Left - sp2Left, 2));
        return dist < bbSize;
    }

    function isBoardFull(bubble) {
        var bbSize = bbShoot.constants.bubbleSize;
        var zLeft = bbShoot.constants.boardWidth / 2 - bbSize / 2;
        var zTop = bbShoot.constants.boardHeight - bbSize;
        var bbTop = bubble.sprite.offsetTop;
        var bbLeft = bubble.sprite.offsetLeft;

        var dist = Math.sqrt(Math.pow(zLeft - bbLeft, 2) + Math.pow(zTop - bbTop, 2));

        return dist < bbSize;
    }

    function detectCollsions(bubble) {
        //check the cells around this bubble (above and to the sides)
        //ignore other fireballs autoshouted
        var cell = gBoard.findBubbleRow(bubble);
        var row, i;
        var bbNear;
        var hitBubbles = [];
        for (i = cell.row; i >= cell.row - 1; i--) {
            //check all elements in array row
            row = gBoard.rows[i] || [];
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = row[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    bbNear = _step3.value;

                    if (bubble !== bbNear && isBubbleHit(bubble, bbNear)) {
                        if (bbNear.isFire) {
                            //window.console.log('fireball hit' + bbNear.sprite.offsetTop);
                            var y;
                        } else {
                            hitBubbles.push(bbNear);
                        }
                    }
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
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
        e.preventDefault(); //to prevent doubleclick;
        //start moving the bubble towards the click point.
        var fireB;
        if (e.target.id === "board") {
            if (e.button === 2) {
                e.preventDefault();
                window.alert('right');
            } else if (e.button === 0) {
                fireB = gBoard.fireBubble;
                var ptClick = { left: e.offsetX, top: e.offsetY };
                //moveBubble(fireB, ptClick);
                //bbShoot.board.stackFire(fireB,ptClick);
                if (fireB) {
                    moveBubble(fireB, ptClick);
                }

                fireB = gBoard.createFireBubble();
                gBoard.fireBubble = fireB;
                bbShoot.drawSprite(fireB);
            }
        }
    }

    function shootOnTimer() {
        var x, y, point;
        var fireB;

        y = Math.floor(Math.floor(Math.random() * bbShoot.constants.boardHeight * 4 / 5)); // 4/5 of the board to avoid shooting low
        x = Math.floor(Math.floor(Math.random() * bbShoot.constants.boardWidth));
        point = { top: y, left: x };

        fireB = gBoard.createFireBubble();
        bbShoot.drawSprite(fireB);
        moveBubble(fireB, point);
    }
    function changeLevel2() {
        //todo check if this function belongs to game class
        //call itself in x seconds by changing level
        // and set fire frequency
        //increase level which g
        var evt;
        var info = {};

        info.level = Math.min(game.level + 1, game.levels.length - 1);
        game.setLevel(info.level);
        setFireFrequency();

        //notify scoreBoard Element
        evt = new CustomEvent('sbLevelEvt', { 'detail': { val: info.level } });
        bbShoot.scoreBoard.sprite.dispatchEvent(evt);

        window.clearTimeout(timerLevel);
        timerLevel = window.setTimeout(changeLevel2, game.changeLevelFreq); // seconds to change level
    }
    function setFireFrequency() {
        //fireInterval set by level attribute
        var dt = game.gSettings.fireInterval;

        window.clearInterval(timer1);
        timer1 = window.setInterval(shootOnTimer, dt); //seconds to shoot by itself
    }

    function stopAutofire() {
        clearTimeout(timer1);
        clearInterval(timerLevel);
    }

    function bubbleDance(bubble) {
        bubble.sprite.classList.add('bobble');
    }

    function pinABubble(e) {
        var point = { left: e.offsetX, top: e.offsetY };
        game.testBubble = bbShoot.board.pinBubble(point);
    }

    function startbbGame() {
        var nameBox = document.querySelector('#playerNameIn'),
            playerName = nameBox.value;

        var mq = window.matchMedia("(max-width: 900px)");
        if (!mq.matches) {

            if (!nameBox.value) {
                document.querySelector("#messageArea").innerText = "Enter your name first!";
                nameBox.focus();
                return;
            }
        }
        gBoard = bbShoot.board;
        if (!exports.game) {
            game = new Game();
            exports.game = game;
        }
        bbShoot.scoreBoard.start(playerName);
        bbShoot.historyPlayers.start();
        game.startGame(playerName);
    }

    function test1() {}

    document.querySelector('#startButton').onclick = startbbGame;
    document.querySelector('#playerNameIn').onkeydown = function (e) {
        if (e.keyCode === 13) {
            startbbGame();
        }
    };
    document.querySelector('#test1').onclick = test1;
    //document.querySelector('#test1').style.display = "none";
})(bbShoot);