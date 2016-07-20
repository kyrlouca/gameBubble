/**
 * Created by KyrLouca on 5/7/2016.
 */
var bbShoot = window.bbShoot || {};
(function (exports) {
    "use strict";

    class Board {
        constructor() {
            this.rows         = [];
            this.boardElement = document.querySelector("#board");
            this.score        = 0;
            this.fireStack=[];
        }

        get sprite() {
            return this.boardElement;
        }

        createBubble(row, col) {
            var bubble = new bbShoot.Bubble(row, col);
            if(!this.rows[row]) {
                this.rows[row] = [];
            }
            this.row=0;
            this.col=0;
            this.rows[row].push(bubble);
            return bubble;
        }

        pinBubble(point) {
            //click and will create a bubble there
            //point has the x and y of mouseevent offsets
            var top,left;
            var brdheight=bbShoot.constants.boardHeight;
            var brdwidth=bbShoot.constants.boardWidth;
            var bbSize=bbShoot.constants.bubbleSize;

            var bubble  = this.createBubble(0,0);


            top = point.top-bbSize/2;
            top =Math.max(top,0);
            top=Math.min(top,brdheight-bbSize);


            left= point.left-bbSize/2;
            left =Math.max(left,0);
            left=Math.min(left,brdwidth-bbSize);

            point={left:left, top:top};

            bbShoot.drawSprite(bubble,point);
            this.rearrangeBubble(bubble, point);
            bubble.sprite.innerText='x:'+point.left+' y:'+point.top;

            return bubble;
        }
        removeBubble(bubble) {
            this.sprite.removeChild(bubble.sprite);
            var row = this.rows[bubble.row];
            var col = row.indexOf(bubble);
            if(col !== -1) {
                this.rows[bubble.row].splice(col, 1);
            }
        }
        findBubbleRow(bubble) {
            //find in which cell grid is located the center of the bubbl
            var bbSize = bbShoot.constants.bubbleSize;
            var sprite = bubble.getSprite();
            var spTop  = parseInt(getComputedStyle(sprite).top) + bbSize / 2;
            var spLeft = parseInt(getComputedStyle(sprite).left) + bbSize / 2;

            var row = Math.floor((spTop) / bbSize);
            var col = Math.floor((spLeft) / bbSize);
            return {row: row, col: col};
        }
        getBubbleCenter(bubble) {
            //find in which cell grid is located the center of the bubbl
            var bbSize = bbShoot.constants.bubbleSize;
            var sprite = bubble.getSprite();
            var spTop  = parseInt(getComputedStyle(sprite).top) + bbSize / 2;
            var spLeft = parseInt(getComputedStyle(sprite).left) + bbSize / 2;
            return {top: spTop, left: spLeft};
        }
        setBubbleRow(bubble, newRow) {
            var currentRow = bubble.row;

            //move the fireball to the proper row
            var i = this.rows[bubble.row].indexOf(bubble);
            if(i !== -1) {
                this.rows[bubble.row].splice(i, 1);
                if(!this.rows[newRow]) {
                    this.rows[newRow] = [];
                }
                bubble.row = newRow;
                this.rows[newRow].push(bubble);
            }
            return bubble;
        }
        rearrangeBubble(bubble, point) {
            //this is all you need to correct array depending on the bubble actual position
            //place bubble in correct row
            var currentRow = bubble.row;
            var newRow     = this.findBubbleRow(bubble);
            //move the fireball to the proper row
            var i = this.rows[bubble.row].indexOf(bubble);
            if(i !== -1) {
                this.rows[bubble.row].splice(i, 1);
                if(!this.rows[newRow]) {
                    this.rows[newRow] = [];
                }
                bubble.row = newRow;
                this.rows[newRow].push(bubble);
            }
            return bubble;

        }
        createFireBubble() {
            var bbsize=bbShoot.constants.bubbleSize;

            var row=Math.ceil((bbShoot.constants.boardHeight)/bbsize)-1;
            var bubble = this.createBubble(row,0);
            bubble.top=row*bbsize;
            bubble.left=bbShoot.constants.boardWidth/2 - bbsize/2;
            bubble.makeFire();
            //this.fireBubble = bubble;
            return bubble;
        }
        createBubbles(rowCount, colCount) {
            var bubble,
                point,
                brdHeight,
                brdWidth,
                bbSize,
                left,
                offset;
            bbSize=bbShoot.constants.bubbleSize;
            brdHeight=bbShoot.constants.boardHeight;
            brdWidth=bbShoot.constants.boardWidth;

            for(var i = 0; i < rowCount; i++) {
                for(var j = 0; j < colCount; j++) {
                    left=j * bbSize;
                    offset= (i%2)? 0: bbSize/2;

                    point={top:i*bbSize,left:offset+j*bbSize};
                    bubble = this.createBubble(i, j);
                    bbShoot.drawSprite(bubble,point);
                }
            }
        }

        addPoints(points) {
            this.score += points;
        }
        getArray() {
            var aa = '';

            function kcon(aRow) {
                return (
                    aRow.map(function (el) {
                        return el.row;
                    }).join('-')
                );
            }

            this.rows.forEach(function (row, i) {
                aa = aa + 'row:' + i + ' ' + kcon(row) + '\n';
            });

            return aa;

        }
        clearBoard() {
            //window.alert('clear board');
            var el, sp;
            var that   = this;
            this.score = 0;
            this.rows.forEach(function (row, i) {
                row.forEach(function (el) {
                    that.boardElement.removeChild(el.sprite);
                });
            });
            this.rows = [];
        }
        stackFire(bubble,point) {
            this.fireStack.push({bubble:bubble,point:point});
            //console.log('he');
        }

    }
    if(!exports.board) {
        exports.board = new Board();
    }

})(bbShoot);
