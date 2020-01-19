var VueTyper = window.VueTyper.VueTyper;

new Vue({
    el: '#app',
    data: {
        input: ""
    },
    created: function () {
        this.caption = this.setRandomCaption();
    },
    methods: {
        setRandomCaption: function() {
            let captions = [
                "Motivated to Make a Better Tomorrow",
                "while(isAlive) {eat();\ncode();\nsleep();}",
                "Star Web Designer",
                "I like turtles"
            ];

            return captions[Math.floor(Math.random() * captions.length)];
        }
    },
    components: {
        'vue-typer': VueTyper
    }
});