/**
 * Created by KyrLouca on 1/7/2016.
 */
var bbShoot = window.bbShoot || {};
(function (exports) {
    "use strict";

    exports.Bubble= class Bubble {
        constructor(row, col,lowZ) {
            var status=0;
            this.isFire=false;
            this.row = row;
            this.col = col;
            this.lowZ=lowZ;
            var color= Math.floor( Math.random()*4);

            this.sprite= document.createElement('div');
            this.sprite.classList.add('bubble');
            this.sprite.objBubble=this;  // get bubble object from sprite

            this.changeColor(color);
            this.makeNormal();

            this.nextStatus=function (){
                //cannot move it oustide constructor because has access to private var status
                status+=1;
                status=status %4;
                this.changeColor(status);
            };
        }
        makeFire(){
            this.isFire=true;
            this.changeShape(2);
        }

        makeNormal(){
            this.isFire=false;
            this.changeShape(0);
        }
        getSprite() { return this.sprite;}
        //get isFire(){return this.isFire;}
        //set isFire(isFire){isFire=true;}
        changeColor(pos){
            pos=pos % 4;
            this.color=pos;
            this.sprite.style.backgroundPositionY= pos*50+"px";
        }
        changeShape(shape){
            this.sprite.style.backgroundPositionX= shape*50+"px";
        }


    };

})(bbShoot);

