/**
 * Created by KyrLouca on 10/7/2016.
 */
var bbShoot = window.bbShoot || {};
(function (exports) {
    "use strict";

    function getPosition(el) {
        var xPos = 0;
        var yPos = 0;

        while(el) {
            if(el.tagName == "BODY") {
                // deal with browser quirks with body/window/document and page scroll
                var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
                var yScroll = el.scrollTop || document.documentElement.scrollTop;

                xPos += (el.offsetLeft - xScroll + el.clientLeft);
                yPos += (el.offsetTop - yScroll + el.clientTop);
            } else {
                // for all other non-BODY elements
                xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
                yPos += (el.offsetTop - el.scrollTop + el.clientTop);
            }

            el = el.offsetParent;
        }
        return {
            x: xPos,
            y: yPos
        };

    }

    return exports.getPosition;

})(bbShoot)
