/* options:
    globalCounter:
    colorChangeSpeed: 
    spawnWidth: 
    spawnSpeed: 
    despawnSpeed: 
    growSpeed: 
    pts: 
    counterSpeed: 
*/

const options = {
    "clockwise": 1,
    "globalCounter": 0,       // used for gradual color changing
    "colorChangeSpeed": 0.02, // used to change how fast it changes from one color to the next. 
    "spawnWidth": 10,          // when a shape first spawns, this is it's width
    "spawnSpeed": 15,         // speed of new shape spawns. Makes them closer together
    "despawnSpeed": 1,        // rate of despawn, 1 is the size of canvas
    "growSpeed": 3,           // how fast the width grows
    "pts": 4,                 // amount of points for a shape. 4 is rectange. 3 is triangle. etc.
    "counterSpeed": 0.01     // this changes the spin, because the faster the counter the faster it spins    
}

export {options};