/**
 * Created by KyrLouca on 1/7/2016.
 */
var bbShoot = window.bbShoot || {};
(function (exports) {
    "use strict";
    exports.drawSprite = (bubble,point)=> {
        if (point){
            bubble.left=point.left;
            bubble.top=point.top;
        }

        var board = document.querySelector('#board');
        var sprite = bubble.getSprite();

        sprite.style.top = bubble.top+ "px";
        sprite.style.left = bubble.left+"px";
        if (bubble.lowZ){
            sprite.classList.add('belowBubble');
        }
        board.appendChild(sprite);
    };

    exports.constants=(function(){
        //IIEF because I do not want boardwidth to be calculated every time boardheight is used
        return{
            bubbleSize: 50,
            rowSize:3,
            colSize:7,
            boardHeight : (function(){
                var board= document.querySelector('#board');
                return parseInt(getComputedStyle(board).height);
            })(),
            boardWidth : (function(){
                var board = document.querySelector('#board');
                return parseInt(getComputedStyle(board).width);
            })()
        };
    })();




})(bbShoot);
