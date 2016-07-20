/**
 * Created by KyrLouca on 17/7/2016.
 */
var bbShoot = window.bbShoot || {};
(function (exports) {
    "use strict";

    class historyPlayers {
        constructor() {
            this.players = {};
            this.sprite = document.querySelector("#historySide");
            this.sprite.querySelector("#historyList").innerHTML="";
        }

        start(name) {
            this.sprite.addEventListener("hpUpdateEvt", this.updateHistory.bind(this));

        }

        stop() {

        }

        updateHistory(evt) {

            function fillStr(str,n=0,fchar=' '){
                var i, strN='';
                if ( typeof str=== 'number'){
                    strN  = str.toLocaleString('en-US', {    minimumIntegerDigits: n, useGrouping: false});
                }else{
                    for( i=0;i<n;i++){
                        strN+= str[i]||fchar;
                    }
                }

                return strN;
            }
            var test=fillStr('ab',4,'+');
            var player,historyList,formattedStr;
            var players = evt.detail.players;
            //alert('hey')
            var compare=function(a,b){
                return (a.score> b.score)? -1:1;
            };
            players.sort(compare);

            window.console.log(players.map((el)=>el.name).toString());

            //this.sprite.querySelector("#playerName").innerText = name;
            historyList   = this.sprite.querySelector("#historyList");
            historyList.innerHTML='';
            for (player of players){
                window.console.log(player.name);


                var f1=document.createElement('p');
                f1.classList.add('hpAll', 'hpLeft');
                f1.appendChild(document.createTextNode(player.name));

                var f2=document.createElement('p');
                f2.classList.add('hpAll', 'hpRight');
                f2.appendChild(document.createTextNode(''+player.score));

                var li=document.createElement('li');
                li.appendChild(f1);
                li.appendChild(f2);
                //formattedStr=fillStr(player.name,7)+'-'+fillStr(player.score,3,'0')
                //formattedStr=fillStr(player.name,7)+'-'+fillStr(player.score,3,'0')

                //li.appendChild(document.createTextNode(formattedStr));

                historyList.appendChild(li);
            }
        }
    }
    exports.historyPlayers = new historyPlayers();
})(bbShoot);
