var VueTyper = window.VueTyper.VueTyper;
function makeParticles() {
particlesJS("particles-js", {
    "particles": {
      "number": {
        "value": 100,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": "#ffffff"
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#000000"
        },
        "polygon": {
          "nb_sides": 5
        },
        "image": {
          "src": "img/github.svg",
          "width": 100,
          "height": 100
        }
      },
      "opacity": {
        "value": 0.5,
        "random": false,
        "anim": {
          "enable": false,
          "speed": 1,
          "opacity_min": 0.1,
          "sync": false
        }
      },
      "size": {
        "value": 3,
        "random": true,
        "anim": {
          "enable": false,
          "speed": 40,
          "size_min": 0.1,
          "sync": false
        }
      },
      "line_linked": {
        "enable": true,
        "distance": 150,
        "color": "#ffffff",
        "opacity": 0.4,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 6,
        "direction": "none",
        "random": false,
        "straight": false,
        "out_mode": "out",
        "bounce": false,
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 1200
        }
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": true,
          "mode": "grab"
        },
        "onclick": {
          "enable": true,
          "mode": "push"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 140,
          "line_linked": {
            "opacity": 1
          }
        },
        "bubble": {
          "distance": 400,
          "size": 40,
          "duration": 2,
          "opacity": 8,
          "speed": 3
        },
        "repulse": {
          "distance": 200,
          "duration": 0.4
        },
        "push": {
          "particles_nb": 4
        },
        "remove": {
          "particles_nb": 2
        }
      }
    },
    "retina_detect": true
  });
}

var VueParticles = Vue.component('vue-particles', {
    template: `
    <div id="particles-container">
        <div id="particles-js" style="height: 500px;"></div>
        <div id="content-text">
            <h3>Help</h3>
            <p>Here is a list of what each command does:</p>
            <ul>
                <li><b>help</b>: you're here right now</li>
                <li><b>home</b>: goes to the homescreen at startup</li>
                <li><b>github</b>: goes to the github specifically for this project</li>
                <li><b>projects</b>: showcases all of my projects that I've worked on</li>
                <li><b>pong</b>: try out some classic pong written in javascript</li>
                <li><b>spiral</b>: practice with html canvas by making spiraling circles</li>
                <li><b>old website</b>: links to my old portfolio site</li>
                <li><b>discord music scraper</b>: go here if you want to scrape some music!</li>
            </ul>
        </div>
        <link rel="stylesheet" href="css/help.css">
    </div>
    `,
    mounted: function() {
        makeParticles();
    }
});

var vm = new Vue({
    el: '#app',
    data: {
        input: "",
        countWord: 0,
        inputIsFocused: false,
        dropdownItems: [
            'help',
            'home',
            'github',
            'projects',
            'pong',
            'spiral',
            'old website',
            'discord music scraper',
            'sorting'
        ],
        itemsOnDom: [
            '',
            '',
            '',
            '',
            '',
            '',
        ],
        contentVal: "home",
    },
    methods: {
        updateDropdown: function() {
            var options = {
                shouldSort: true,
                threshold: 0.2,
                location: 0,
                distance: 100,
                maxPatternLength: 32,
                minMatchCharLength: 1,
            };
            var fuse = new Fuse(this.dropdownItems, options);
            let search = fuse.search(this.input);
            for (let i = 0; i < 6; i++) {
                this.itemsOnDom[i] = "";
                if (search[i] === undefined) continue;
                this.itemsOnDom[i] += this.dropdownItems[search[i]];
            }
        },
        updateContent: function(item) {
            this.contentVal = item;
            if (this.contentVal == "github") {
                window.location.href = "http://github.com/bachittle/bachittle.github.io";
            }
            else if (this.contentVal == "old website") {
                window.location.href = "http://0722bailey.github.io"
            }
            else if (this.contentVal == "discord music scraper") {
                window.location.href = "https://github.com/bachittle/playlist-creator";
            }
            else if (this.contentVal == "sorting") {
                window.location.href = "./sorting";
            }
            this.inputIsFocused = false;
        },
        onTypedChar: function(typedChar, typedCharIndex) {
            if (typedCharIndex == 0) {
                document.getElementById('typewriter').firstChild.innerHTML = '';
            }
            var lessNodes = document.getElementById('typewriter').lastChild.childNodes;
            if (typedChar == " " || lessNodes.length == 1) {

                var finalNodes = document.getElementById('typewriter').firstChild;
                var listNodes = finalNodes.childNodes;

                var newNode = document.createElement('span');

                var x = this.countWord;
                var countNodes = listNodes.length;
                while (x < countNodes) {
                    if (listNodes[this.countWord].innerHTML != " ")
                        newNode.insertAdjacentElement('beforeend', listNodes[this.countWord]);
                    else
                        this.countWord++;

                    // TODO: ADD LAST CHAR
                    x++;
                }
                newNode.className = 'nowrap';
                finalNodes.insertAdjacentElement('beforeend', newNode);

                this.countWord++;
            }
        },
        onErased: function() {
            this.countWord = 0;
        }
    },
    components: {
        'vue-typer': VueTyper,
        'vue-particles': VueParticles,
        'pong': VuePong
    },
});

console.log("How do you do, fellow programmer?");