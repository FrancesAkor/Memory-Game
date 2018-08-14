//select the deck and store in a variable
const deck = document.querySelector('.deck');

//select all cards in the deck and store in an array
const allCards = document.querySelectorAll('.card');
const cards = [...allCards];// the rest parameter groups all the list cards into an array.

//declare a variable for number of moves and initialize the its value to 0
const moves = document.querySelector('.moves');
moves.textContent = 0;

//select all the list of stars and store in an array
const stars = document.querySelectorAll('.stars li');
const star = [...stars];

//select the restart icon and store in a variable
const restart = document.querySelector('.restart');

//select the score panel and store in a variable
const scorePanel = document.querySelector('.score-panel');

//create a fragment document and store in a variable
const fragment = document.createDocumentFragment();

//select the close sign on the modal content and store in a variable
const close = document.querySelector('.close');

//select and store the button element in a variable
const button = document.querySelector('button');

//select the p element with the class num-of-moves and store in a variable
let numOfMoves = document.querySelector('.num-of-moves');

//select the p element with the class total time and store in a variable
let totalTime = document.querySelector('.total-time');

//an empty array to store the list of selected cards
let list = [];

//an empty array to store the list of matched cards
let matchedCards = [];

//declare a variable to count the number of clicks and initialize to 0
let clickCounter = 0;

//declare a variable to count the number of moves and initialize to 0
let moveCounter = 0;

//declare a variable to store the final game duration
let gameDuration = '';

//declare a variable to store the final number of moves
let finalMoves = '';

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

//Shuffle Game
const shuffleGame = function() {
	const shuffledCards = shuffle(cards);
	for(const card of shuffledCards) {
		fragment.appendChild(card);	
	}

	deck.appendChild(fragment);
};

//timer
scorePanel.insertAdjacentHTML('afterbegin', '<div class="timer"></div>');//puts a new container for timer as the first child element of the score panel section.
const timer =  document.querySelector('.timer');
timer.textContent = '0 mins 0 secs';//inserts this value as the text content of the timer
let second = 0;
let minute = 0;
let hour = 0;
let intervalID = '';
const startTimer = function() {
	intervalID = setInterval(function() {
		second++;
		timer.textContent = `${minute} mins ${second} secs`;
		
		if(second === 60) {
			second = 0;
			minute++;
		}
	}, 1000);
};

//To update the number of moves
const updateMoves = function() {
	moveCounter++;
	moves.textContent = moveCounter;
};

//To update the number of stars
let styledStar = [];
let rating = 0;
const updateStars = function(moveCounter) {
	if(moveCounter > 8 && moveCounter <= 15) {
		star[2].style.cssText = 'color: silver; opacity: 0.5';
	} else if (moveCounter > 15 && moveCounter <= 20) {
		star[1].style.cssText = 'color: silver; opacity: 0.5';
	}
};

//Modal
const congratulations = function () {
	if(matchedCards.length === 16) {
		clearInterval(intervalID);//this stops the timer
		gameDuration = timer.textContent;
		finalMoves = moves.textContent;
		
		//to get the number of star rating
		for(const each of star) {
			if(each.hasAttribute('style')) {
				styledStar.push(each);
			}
		}
		rating = star.length - styledStar.length;

		//display the modal 
		document.querySelector('.modal-bg').style.display = 'flex';
		numOfMoves.textContent = `${finalMoves} moves and ${rating} star`;
		totalTime.textContent = `in ${gameDuration}`;

		//clear the array
		matchedCards = [];
		styledStar = [];
	}
};

//This function is run to ensure that only two cards are opened at a time
const disableDeck = function() {
	deck.classList.add('disable');
};

 //to enable the deck
const enableDeck = function() {
	deck.classList.remove('disable');
};

//This is run when the two cards in the list array match
const match = function() {
	list[0].classList.remove('open', 'show');
	list[0].classList.add('match');
	list[1].classList.remove('open', 'show');
	list[1].classList.add('match');
	matchedCards.push(list[0]);
	matchedCards.push(list[1]);
	list = [];

	enableDeck();

	//when all cards match
	congratulations();
};

//This is run when the two cards in the list array don't match
const unmatch = function() {
	setTimeout(function() {
		list[0].classList.remove('open', 'show', 'disable');
		list[1].classList.remove('open', 'show', 'disable');

		enableDeck();
		list = [];
	}, 500);//the setTimeout delays the function from occuring till after 0.5sec	
};

//function to display card's symbol
const displayCard = function(evt) {
	let clicked = evt.target;
	if (clicked.nodeName === 'LI') {
		//start timer
		clickCounter++;//the if statement ensures that the timer starts only after the first click
		if(clickCounter === 1) {
			startTimer();
		}
		clicked.classList.add('open', 'show', 'disable');

			list.push(clicked);
			if (list.length === 2) {
				disableDeck();
				updateMoves();

				//check if the cards match
				if (list[0].innerHTML === list[1].innerHTML) {
					match();
				} else {
					unmatch();	
				}
			}

		updateStars(moveCounter);	
	}	
};

const reset = function() {
	//reset number of moves
	moveCounter = 0
	moves.textContent = moveCounter;

	//reset stars
	for(const each of star) {
		each.removeAttribute('style');
	}

	//clear the list of clicked cards
	list = [];

	//reset cards
	for(const card of cards) {
		card.classList.remove('open', 'show', 'disable', 'match');
	}

	//shuffle cards
	shuffleGame();

	//reset timer
	clearInterval(intervalID);
	second = 0;
	minute = 0;
	timer.textContent = `${minute} mins ${second} secs`;
	
	clickCounter = 0;
};

//close modal
const closeModal = function() {
	document.querySelector('.modal-bg').style.display = 'none';
	reset();
};

//start Game
const startGame = document.addEventListener('DOMContentLoaded', function() {
	reset();
	//This adds an event listener to the deck which listens for a click on a card
	deck.addEventListener('click', displayCard);
});

//listen for a click on the restart icon
restart.addEventListener('click', reset);

//listen for a click on the close icon on the modal
close.addEventListener('click', closeModal);

//listen for a click on the play again button
button.addEventListener('click', closeModal);


