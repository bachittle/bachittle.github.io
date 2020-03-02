/* Name: Bailey Chittle
 * Date: June 17 2019
 * Program description: Canvas boilerplate copied from chriscourse. Used for pretty much every canvas project. 
 */

import {shuffle} from './utils.js'

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

function setCanvasSize() {
    canvas.width = (innerWidth * 0.98 < 800) ? innerWidth * 0.98 : 800;
    canvas.height = innerHeight * 0.85;
}
setCanvasSize();

const mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2
};

// Event Listeners
window.addEventListener('mousemove', event => {
    mouse.x = event.offsetX;
    mouse.y = event.offsetY;
});

window.addEventListener('resize', () => {
    setCanvasSize();
    init();
    animate();
});



/*
// Objects
class Object {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
    update() {
        this.draw();
    }
}


// Implementation
let objects
function init() {
    objects = [];

    for (let i = 0; i < 1; i++) {
        // objects.push()
    }
}
*/

class Bar {
    constructor(x, y, height, width=5, color='black') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    update() {
        this.draw();
    }
}

let numArray1 = [];
let numArray2 = [];
function initializeNumArray(arr) {
    for(let i = 0; i < 30; i++) {
        arr[i] = i+1;
    }
}
initializeNumArray(numArray1);
initializeNumArray(numArray2);

let visualArray1, visualArray2;

function init(option = "barchart") {
    const itemWidth = canvas.width / (33*2);
    const itemHeight = canvas.height / 33;
    visualArray1 = [];
    visualArray2 = [];
    for (let i = 0; i < 30; i++) {
        switch (option) {
            case "barchart":
                let j1 = numArray1[i] * itemHeight;
                let j2 = numArray2[i] * itemHeight;
                visualArray1.push(new Bar(i * itemWidth + itemWidth, canvas.height - j1, j1, itemWidth));
                visualArray2.push(new Bar(i * itemWidth + itemWidth * 33, canvas.height - j2, j2, itemWidth));
                break;
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// custom settings event handlers
document.getElementById('shuffleArray').onclick = function() {
    shuffle(numArray1);
    numArray2 = [];
    numArray1.forEach(x => {
        numArray2.push(x);
    })
    console.log(numArray1);
    console.log(numArray2);
    init();
    animate();
};

async function mattSort(arr) {
    for (let i = 0; i < arr.length; ) {
        if (arr[i] > arr[i + 1]) {
            let x = arr[i];
            arr[i] = arr[i + 1];
            arr[i + 1] = x;
            i = -1;
        }
        i++;
        init();
        visualArray1[i].color = 'red';
        animate();
        await sleep(30);
    }
}

async function bubbleSort(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = arr.length - 1; j >= i; j--) {
            if (arr[j-1] > arr[j]) {
                let x = arr[j];
                arr[j] = arr[j - 1]; 
                arr[j-1] = x;
            }
            visualArray2[j].color = 'red';
            animate();
            await sleep(30);   
        }
        
    }
}

document.getElementById("sortArray").onclick = function() {
    mattSort(numArray1);
    bubbleSort(numArray2);
}


// Animation Loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //ctx.fillText('HTML CANVAS BOILERPLATE', mouse.x, mouse.y);
    
    ctx.fillText('mattSort', 10, 10);
    visualArray1.forEach(object => {
      object.update();
    });
    ctx.fillText('bubbleSort', canvas.width / 2 + 10, 10);
    visualArray2.forEach(object => {
      object.update();
    });
}

init();
animate();