import {init, animate} from './canvas.js'

let time = 30;
var speedInput = document.getElementById('speed');
speedInput.onchange = function() {
    time = Math.floor(1000 / Math.abs(+speedInput.value));
    console.log("time: "+time);
}


// function that has to be run after every iteration
function iterationUpdate(visuals, i, option) {
    init(option.val);
    if (i < visuals[option.val].length && i >= 0) {
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
            await iterationUpdate(visualArr, j, option);
        }
        let x = numArr[i];
        numArr[i] = numArr[minIndex]; 
        numArr[minIndex] = x;
    }
    return new Promise((resolve, reject) => {resolve()});
}

export {mattSort, bubbleSort, selectionSort};