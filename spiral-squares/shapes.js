import {ctx} from "./canvas.js";
import {options} from "./presets/options.js";

class Shape {
    constructor(x, y, width, clockwise=true) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.counter = 0;
        this.c = [];
        for (let i = 0; i < options.pts; i++) {
            this.c.push({
                'x': this.x,
                'y': this.y
            });
        }
    }
    update() {
        let val = Math.PI / (options.pts / 2);
        for (let i = 0; i < options.pts; i++) {
            this.c[i].x = this.x + this.width * options.clockwise * Math.sin(val * (Math.pow(this.counter, 1/2) + i));
            this.c[i].y = this.y + this.width * Math.abs(options.clockwise) * Math.cos(val * (Math.pow(this.counter, 1/2) + i));
        }
        this.counter += options.counterSpeed;
        this.width += options.growSpeed;
        this.draw();
    }
    draw() {
        ctx.beginPath();
        ctx.moveTo(this.c[0].x, this.c[0].y);
        for (let i = 1; i < options.pts; i++) {
            ctx.lineTo(this.c[i].x, this.c[i].y);
        }
        ctx.closePath();
        //ctx.stroke();

        ctx.fillStyle = "hsla(170, 90%, "+( 40 + (this.counter + options.globalCounter) * 100 % 20) +"%, 1)";
        ctx.fill();
    }
}

export {options, Shape};