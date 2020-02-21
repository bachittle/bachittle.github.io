var VueTyper = window.VueTyper.VueTyper;
import makeParticles from './particle.js'

var VueParticles = Vue.component('vue-particles', {
    template: `
    <div id="particles-js" style="height: 500px;"></div>
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
            'projects',
            'pong',
            'spiral',
            'old website',
            'discord music scraper',
        ],
        itemsOnDom: [
            '',
            '',
            '',
            '',
            '',
            '',
        ],
        contentVal: "help",
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
        'vue-particles': VueParticles
    },
});

console.log("How do you do, fellow programmer?");