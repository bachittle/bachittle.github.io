var VuePong = Vue.component('pong', {
    template: `
        <div id="pong-app">
            <canvas id="canvas-pong"></canvas>
        </div>
    `,
    mounted:  function() {
        startPong();
    }
});

function startPong() {
        // Initial Setup
    const canvas = document.getElementById('canvas-pong');
    const parent = document.getElementById('right-panel');

    canvas.width = parent.offsetWidth * 0.8;
    canvas.height = parent.offsetHeight * 0.8;
    const c = canvas.getContext('2d')

    // Variables
    const playerCoords = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        moveUp: false,
        moveDown: false
    }

    function BallRandomizer(value){
        let i = Math.random() - 0.5
        if (i > 0){
            return value;
        }
        else if(i <= 0){
            return -value;
        }
    }
    var speed = 10
    ball = {
        x: canvas.width/2,
        y: canvas.height/2,
        dx: BallRandomizer(speed),
        dy: BallRandomizer(speed)
    }
    var radius = canvas.height/100
    var ai = {y: ball.y}
    var score = {
        player: 0,
        ai: 0
    }

    window.onload = function() {}

    // Event Listeners
    addEventListener('resize', () => {
        canvas.width = parent.offsetWidth * 0.8;
        canvas.height = parent.offsetHeight * 0.8;
        speed = 10
    })

    addEventListener('click', event => {
        console.log(event)
    })

    addEventListener('keydown', event => {
        if (event.key === "ArrowUp") {
            playerCoords.moveUp = true;
        }
        else if (event.key === "ArrowDown") {
            playerCoords.moveDown = true;
        }
    })

    addEventListener('keyup', event => {
        if (event.key === "ArrowUp") {
            playerCoords.moveUp = false;
        }
        else if (event.key === "ArrowDown") {
            playerCoords.moveDown = false;
        }
    })

    // Utility Functions
    function randomIntFromRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    function randomColor(colors) {
        return colors[Math.floor(Math.random() * colors.length)]
    }

    function distance(x1, y1, x2, y2) {
        const xDist = x2 - x1
        const yDist = y2 - y1

        return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
    }

    // Objects
    /*function Object(x, y, radius, color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.update = function() {
            this.draw()
        }
        this.draw = function() {
            c.beginPath()
            c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
            c.fillStyle = this.color
            c.fill()
            c.closePath()
        }
    }*/
    var paddle = [];
    function Paddle(x, y, width, height, type) {
        if (playerCoords.moveUp) {
            if(!(y < height / 2)){
                playerCoords.y -= 10;
            }
        }
        else if (playerCoords.moveDown) {
            if(!(y >= canvas.height - (height / 2))) {
                playerCoords.y += 10;
            }
        }

        else if(y < height / 2){
        }
        c.fillStyle = "white";
        if(y >= height / 2 && y <= canvas.height - (height / 2)){
            c.fillRect(x, y - (height / 2), width, height)
        }
        else if(y < height / 2){
            c.fillRect(x, 0, width, height)
        }
        else{
            c.fillRect(x, canvas.height - height, width, height)
        }
        paddle[type] = {
            x: x,
            y: y,
            width: width,
            height: height
        }
    }

    // Implementation
    let objects

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        c.clearRect(0, 0, canvas.width, canvas.height);
        Paddle(10, playerCoords.y, 10, canvas.height / 10, 0);
    }
    animate();
}