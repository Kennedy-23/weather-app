class Animal {

    constructor(name) {

        this.name = name;

    }

    speak() {

        console.log(`${this.name} makes a sound.`);

    }

}

class Dog extends Animal {

    speak() {

        console.log(`${this.name} says Woof!`);

    }

}

class Cat extends Animal {

    speak() {

        console.log(`${this.name} says Meow!`);

    }

}

const dog = new Dog("Buddy");
const cat = new Cat("Snow");

dog.speak();
cat.speak();