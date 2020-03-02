import {init, animate} from './canvas.js';
import {shuffle} from './utils.js';

let time = 30;
var speedInput = document.getElementById('speed');
speedInput.onchange = function() {
    time = Math.floor(1000 / Math.abs(+speedInput.value));
    console.log("time: "+time);
}


// function that has to be run after every iteration
function iterationUpdate(visuals, i, option, j) {
    init(option.val);
    if (i < visuals[option.val].length && i >= 0) {
        if (j) {
            visuals[option.val][j].color = 'blue';
        }
        visuals[option.val][i].color = 'red';
    }
    animate();
    return new Promise(resolve => setTimeout(resolve, time));
}

// sorting algorithms
async function mattSort(numArr, visuals, option) {
    for (let i = 0; i < numArr.length;) {
        if (option.val === 'stop') break;
        if (numArr[i] > numArr[i + 1]) {
            let x = numArr[i];
            numArr[i] = numArr[i + 1];
            numArr[i + 1] = x;
            i = -1;
        }
        i++;
        await iterationUpdate(visuals, i, option);
    }
    return new Promise((resolve, reject) => {resolve()});
}

async function bubbleSort(numArr, visualArr, option) {
    for (let i = 0; i < numArr.length; i++) {
        for (let j = numArr.length - 1; j >= i;) {
            if (option.val === 'stop') break;
            if (numArr[j-1] > numArr[j]) {
                let x = numArr[j];
                numArr[j] = numArr[j - 1]; 
                numArr[j-1] = x;
            }
            j--;
            await iterationUpdate(visualArr, j, option);
        }
    }
    return new Promise((resolve, reject) => {resolve()});
}

async function selectionSort(numArr, visualArr, option) {
    for (let i = 0; i < numArr.length-1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < numArr.length; j++) {
            if (option.val === 'stop') break;
            if (numArr[j] < numArr[minIndex]) {
                minIndex = j;
            }
            await iterationUpdate(visualArr, j, option, minIndex);
        }
        let x = numArr[i];
        numArr[i] = numArr[minIndex]; 
        numArr[minIndex] = x;
    }
    return new Promise((resolve, reject) => {resolve()});
}

async function partition(items, visualArr, option, left, right) {
    var pivot   = items[Math.floor((right + left) / 2)],
        i       = left,
        j       = right;

    while (i <= j) {
        while (items[i] < pivot) {
            await iterationUpdate(visualArr, i, option);
            i++;
        }
        while (items[j] > pivot) {
            await iterationUpdate(visualArr, j, option);
            j--;
        }
        if (i <= j) {
            let x = items[i];
            items[i] = items[j]; 
            items[j] = x;
            i++;
            j--;
        }
        await iterationUpdate(visualArr, i, option);
    }

    return i;
}

async function quickSort(items, visualArr, option, left=0, right=items.length - 1) {

    let index;

    if (items.length > 1) {

        index = await partition(items, visualArr, option, left, right);

        if (left < index - 1) {
            await quickSort(items, visualArr, option, left, index - 1);
        }

        if (index < right) {
            await quickSort(items, visualArr, option, index, right);
        }

    }

    return items;
}

async function insertionSort(numArr, visualArr, option) {
    for (let i = 0; i < numArr.length; i++) {
        for (let j = 0; j < i; j++) {
            if (numArr[i] < numArr[j]) {
                let x = numArr[i];
                numArr[i] = numArr[j];
                numArr[j] = x;
            }
            await iterationUpdate(visualArr, j, option, i);
        }
    }
}

async function bogoSort(numArr, visualArr, option) {
    for (let i = 0; i < numArr.length; i++) {
        if (numArr[i] > numArr[i+1]) {
            shuffle(numArr);
            i = -1;
        }
        await iterationUpdate(visualArr, i, option);
    }
    return new Promise((resolve, reject) => {resolve()});
}

export {mattSort, bogoSort, bubbleSort, selectionSort, quickSort, insertionSort};