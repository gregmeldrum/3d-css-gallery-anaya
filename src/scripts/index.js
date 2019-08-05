import '../styles/index.scss';
import $ from 'jquery';

console.log('webpack starterkit');

// Add the mouse movement handlers
var $body = $("body");

// Mouse Events Handler
$body.on("mousedown", function (evt) {
    var initX = evt.screenX;
    var initY = evt.screenY;
    $body.on("mousemove", function handler(evt) {
        // drag
        var moveX = initX - evt.screenX;
        var moveY = initY - evt.screenY;
        var zRot = moveX / 3;
        var xRot = moveY / 5;
        position.update(zRot, xRot);
    });

    $body.on("mouseup", function handler(evt) {
        $body.off("mousemove");
        position.resetRotation();
    });
});

window.addEventListener("keydown", keysPressed, false);
window.addEventListener("keyup", keysReleased, false);
 
var keys = [];
var keyDown = false;
 
function keysPressed(e) {
    // store an entry for every key pressed
    keys[e.keyCode] = true;
    
    if (!keyDown) {
        keyDown = true;
        move();
    }
}

function move() {

    if (keyDown) {
        if (keys[38]) {
            position.forward();
        }
        if (keys[39]) {
            position.right();
        }
        if (keys[40]) {
            position.back();
        }
        if (keys[37]) {
            position.left();
        }

        setTimeout(move, 20);
    }

}

function keysReleased(e) {
    // mark keys that were released
    keys[e.keyCode] = false;

    if (keys.length == 0) {
        keyDown = false;
    }
}

// Create an object to manage the position
// of the blocks
var position = (function () {
    var prevTop;
    var prevLeft;

    var prevZRot = 0;
    var prevXRot = 0;

    var zRot = 0;
    var xRot = 90;

    var rotationStep = 4;
    var translationStep = 1.7;

    function setPosition(top, left) {
        prevTop = top;
        prevLeft = left;
        renderScene();
    }

    // Initialize
    setPosition(50, 300);

    function checkBounds(){
        if (prevTop < 0) {
            prevTop = 0;
        } else if (prevTop > 300) {
            prevTop = 300;
        }

        if (prevLeft < -120) {
            prevLeft = -120;
        } else if (prevLeft > 300) {
            prevLeft = 300;
        }
    }

    function forward() {
        prevTop += rotationStep*Math.cos(zRot*Math.PI/180);
        prevLeft += rotationStep*Math.sin(zRot*Math.PI/180);
        checkBounds();
        renderScene();
    }

    function back() {
        prevTop -= rotationStep*Math.cos(zRot*Math.PI/180);
        prevLeft -= rotationStep*Math.sin(zRot*Math.PI/180);
        checkBounds();
        renderScene();
    }

    function right() {
        update(-translationStep, 0);
        resetRotation();
    }

    function left() {
        update(translationStep, 0);
        resetRotation();
    }

    function renderScene() {
        $("#scene").css({
            top: prevTop + "px",
            left: prevLeft + "px"
        });
    }

    function update(newZRot, newXRot) {
        // Manage the Z axis rotation
        var zRotDelta = newZRot - prevZRot;
        zRot = zRot += zRotDelta;
        prevZRot = newZRot;

        if (zRot > 360) {
            zRot -= 360;
        }

        if (zRot < 360) {
            zRot += 360;
        }

        // Manage the X axis rotation
        var xRotDelta = newXRot - prevXRot;
        xRot = xRot += xRotDelta;
        prevXRot = newXRot;

        render();
    }

    function render() {
        renderBlock("viewpoint", zRot, xRot);
    }

    function renderBlock(theId, rotationZ, rotationX) {
        var transform =
            "rotateX( " + rotationX + "deg) rotateZ(" + rotationZ + "deg)";
        //console.log(transform);
        $("#" + theId).css({
            transform: transform
        });
    }

    function resetRotation() {
        prevZRot = 0;
        prevXRot = 0;
    }

    return {
        update: update,
        resetRotation: resetRotation,
        forward: forward,
        back: back,
        left: left,
        right: right,
        setPosition: setPosition
    };
})();

$(document).ready(function () {
    // Do the initial rendering
    position.update(0, 0);
});