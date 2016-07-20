/**
 * Created by KyrLouca on 17/7/2016.
 */
var bbShoot = window.bbShoot || {};
(function (exports) {
    "use strict";
    class score {
        constructor() {
            this.score  = 0;
            this.level  = 0;
            this.sprite = document.querySelector("#infoSide");
        }

        start(name) {
            this.score = 0;
            this.level = 0;

            this.sprite.querySelector("#playerName").innerText=name;
            this.sprite.querySelector("#score").innerText="00";
            this.sprite.querySelector("#level").innerText="0";
            this.sprite.querySelector("#playerNameIn").value="";

            this.sprite.addEventListener("sbScoreEvt", this.updateScore.bind(this));
            this.sprite.addEventListener("sbLevelEvt", this.updateLevel.bind(this));
        }

        stop() {

        }

        updateScore(evt) {
            this.score= evt.detail.val;

            var str = this.score.toLocaleString('en-US', {
                minimumIntegerDigits: 2,
                useGrouping: false
            });
            var score       = this.sprite.querySelector("#score");
            score.innerText = str;
        }

        updateLevel(evt) {
            this.level = evt.detail.val;
            var level       = this.sprite.querySelector("#level");
            level.innerText = this.level;
        }


    }

    exports.scoreBoard = new score();
})(bbShoot);
