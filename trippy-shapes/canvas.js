import {options} from './presets/options.js';
import {Shape} from './shapes.js';
import {LinkedList} from './dsa/linkedlist.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;
let middle = {
    x: canvas.width / 2,
    y: canvas.height / 2
}

let shapes = new LinkedList();
function init() {
    shapes.push(new Shape(middle.x, middle.y, 20));
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes.forEach(shape => {
        shape.update();
    });
    if (shapes.peek().width > options.spawnSpeed) {
        shapes.push(new Shape(middle.x, middle.y, options.spawnWidth));
    }
    if (shapes.peekBack().width > canvas.width * options.despawnSpeed) {
        shapes.shift();
    }

    options.globalCounter += options.colorChangeSpeed;
}

init();
animate();

export {canvas, ctx};