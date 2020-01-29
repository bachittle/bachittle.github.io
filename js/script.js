var VueTyper = window.VueTyper.VueTyper;

new Vue({
    el: '#app',
    data: {
        input: "",
        countWord: 0,
        inputIsFocused: false
    },
    methods: {
        onTypedChar: function (typedChar, typedCharIndex) {
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
        'vue-typer': VueTyper
    }
});
console.log("How do you do, fellow programmer?");