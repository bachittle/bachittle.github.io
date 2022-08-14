class LinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
    }

    size() {
        let node = this.head;
        let size = 0;
        while (node != null) {
            node = node.next;
            size++;
        }
        return size;
    }

    // gets the element at the specified index. O(n)
    get(index) {
        let node = head;
        for (let i = 0; i < index - 1; i++) {
            if (node.next != null) {
                node = node.next;
            }
            else {
                return undefined;
            }
        }
        return node.val;
    }

    // pushes to the end of the list (tail)
    push(val) {
        let node = new Node(val);
        if (this.tail === null) {
            this.head = node;
            this.tail = node;
        }
        else {
            this.tail.next = node;
            node.prev = this.tail;
            this.tail = node;
        }
    }

    // pops the tail of the list
    pop() {
        let node = this.tail;
        this.tail = this.tail.prev;
        this.tail.next = null;
        return node.val;
    }

    // peek at the tail value
    peek() {
        return this.tail.val;
    }

    // unshift (push value to the head of the list)
    unshift(val) {
        let node = new Node(val);
        if (this.head === null) {
            this.head = node;
            this.tail = node;
        }
        else {
            node.next = this.head;
            this.head.prev = node;
            this.head = node;
        }
    }

    // shift (pop the head of the list)
    shift() {
        let node = this.head;
        this.head = this.head.next;
        this.head.prev = null;
        return node.val;
    }

    // peekHead peeks at the head rather than tail.
    peekBack() {
        return this.head.val;
    }

    // forEach runs a function for each node in the list
    forEach(callbackfn) {
        let node = this.head;
        while (node != null) {
            callbackfn(node.val);
            node = node.next;
        }
    }
}

class Node {
    constructor(val) {
        this.val = val;
        this.next = null;
        this.prev = null;
    }
}

export {LinkedList};