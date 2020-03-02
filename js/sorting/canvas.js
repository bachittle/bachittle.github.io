/* Name: Bailey Chittle
 * Date: June 17 2019
 * Program description: Canvas boilerplate copied from chriscourse. Used for pretty much every canvas project. 
 */

import {shuffle} from './utils.js'
import {mattSort, bogoSort, bubbleSort, selectionSort, quickSort, insertionSort} from './sorting-algs.js'

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
let sizeOfArr = 10;
function initializeNumArray(arr) {
    for(let i = 0; i < sizeOfArr; i++) {
        arr[i] = i+1;
    }
}

initializeNumArray(numArray1);
initializeNumArray(numArray2);

let visuals = {v1: [], v2: []};

function init(name="both", option = "barchart") {
    const itemWidth = canvas.width * 0.48 / (sizeOfArr);
    const itemHeight = canvas.height * 0.9 / sizeOfArr;
    if (name==='v1' || name==='both')
        visuals.v1 = [];
    if (name==='v2' || name==='both')
        visuals.v2 = [];
    for (let i = 0; i < sizeOfArr; i++) {
        switch (option) {
            case "barchart":
                let j1, j2;
                if (name==='v1' || name==='both')
                    j1 = numArray1[i] * itemHeight;
                if (name==='v2' || name==='both')
                    j2 = numArray2[i] * itemHeight;
                if (name==='v1' || name==='both')
                    visuals.v1.push(new Bar(i * itemWidth*0.9 + (sizeOfArr / 20), canvas.height - j1, j1, itemWidth));
                if (name==='v2' || name==='both')
                    visuals.v2.push(new Bar(i * itemWidth*0.9 + itemWidth * (sizeOfArr+(sizeOfArr/20)), canvas.height - j2, j2, itemWidth));
                break;
        }
    }
}



// option is an object so that it can be passed by reference and changed here
// it is used in shuffleArray when wanting to stop execution of any functions
// and it is used in sortArray so that the sorting function knows what array it is
// acting upon


// UI event handlers
let sort1 = document.getElementById('sort1').value;
let sort2 = document.getElementById('sort2').value;

let option1 = {};
let option2 = {};

function shuffleNumArrays() {
    option1.val = 'stop';
    option2.val = 'stop';
    shuffle(numArray1);
    numArray2 = [];
    numArray1.forEach(x => {
        numArray2.push(x);
    });
    init();
    animate();
}

document.getElementById('sort1').onchange = function() {
    option1.val = 'stop';
    option2.val = 'stop';
    sort1 = document.getElementById('sort1').value;
    animate();
}
document.getElementById('sort2').onchange = function() {
    option1.val = 'stop';
    option2.val = 'stop';
    sort2 = document.getElementById('sort2').value;
    animate();
}

document.getElementById('shuffleArray').onclick = function() {
    shuffleNumArrays();
};

var numOfArrInput = document.getElementById('numOfArr')
numOfArrInput.onchange = function() {
    sizeOfArr = Math.floor(Math.abs(+numOfArrInput.value));
    console.log(sizeOfArr);
    numArray1 = [];
    numArray2 = [];
    initializeNumArray(numArray1);
    initializeNumArray(numArray2);
    init();
    animate();
}

let initSortValues = {sort1, sort2};
async function sortArray(sort, numArray, option) {
    switch(sort) {
        case 'mattSort':
            await mattSort(numArray, visuals, option);
            break;
        case 'bubbleSort':
            await bubbleSort(numArray, visuals, option);
            break;
        case 'selectionSort':
            await selectionSort(numArray, visuals, option);
            break;
        case 'quickSort':
            numArray = await quickSort(numArray, visuals, option);
            break;
        case 'insertionSort':
            await insertionSort(numArray, visuals, option);
            break;
        case 'bogoSort':
            await bogoSort(numArray, visuals, option);
            break;
    }
    init(option.val);
    animate();
}
document.getElementById("sortArray").onclick = async function() {
    if (option1.val === 'v1') {
        shuffleNumArrays();
    }
    option1.val = 'v1';
    option2.val = 'v2';
    //console.log(option1);
    //console.log(option2);
    
    sortArray(sort1, numArray1, option1);
    sortArray(sort2, numArray2, option2);
}


// Animation Loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //ctx.fillText('HTML CANVAS BOILERPLATE', mouse.x, mouse.y);
    
    ctx.fillText(sort1, 10, 10);
    visuals.v1.forEach(object => {
      object.update();
    });
    ctx.fillText(sort2, canvas.width / 2 + 10, 10);
    visuals.v2.forEach(object => {
      object.update();
    });
}

init();
animate();

export {init, animate}