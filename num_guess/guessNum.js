var comp = parseInt(Math.random() * 100);

// console.log(comp);

var userEntered = prompt("Enter the number between 1 to 100");
console.log(userEntered);

while (userEntered != comp) {



    if (userEntered > comp) {
        console.log("your guess is: ", userEntered)
        console.log(`your guess was higher 😔`);
        var userEntered = prompt("Try a lowr number ⬇️⬇️⬇️");
    }
    else {
        console.log("your guess is: ", userEntered)
        console.log(`your guess was lower 😔`);
        var userEntered = prompt("Try a higher number ⬆️⬆️⬆️");
    }
}
if (userEntered == comp) {
    console.log(`Your guess is correct 😃. the number is ${userEntered}.`);
}