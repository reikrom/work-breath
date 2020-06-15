const displayTime = document.querySelector(".timer");
const focusSymbol = document.querySelector(".focus-symbol");
const controls = document.querySelector(".control-wrapper");
const background = document.querySelector("body");
const spButton = document.querySelector("#start");
const displayCompletions = document.querySelector(".completion");
const timerSwitch = document.querySelector(".timer-switch");
const dot28 = document.querySelector("#d28");
const dot90 = document.querySelector("#d90");

let duration = 60 * 90;
let pausedDuration = null;
let completionCount;

const breathIn = new Audio("sounds/in.mp3");
const breathOut = new Audio("sounds/out.mp3");
const audio1 = new Audio("sounds/completionL2.mp3");
const audio2 = new Audio("sounds/completion2.mp3");
let completionSound = audio1;

try {
	completionCount = localStorage.getItem("completionCount");
} catch (e) {
	console.log(e);
}

const countCompletion = () => {
	try {
		localStorage.setItem("completionCount", ++completionCount);
	} catch (e) {
		console.log(e);
	}
	displayCompletion();
};
const displayCompletion = () => {
	displayCompletions.innerHTML = `
        <span>Completions: <strong>${completionCount}</strong></span>
    `;
};
completionCount && completionCount !== "undefined"
	? displayCompletion()
	: (displayCompletions.innerHTML = ``);

const app = () => {
	let timer;
	pausedDuration ? (timer = pausedDuration) : (timer = duration);

	let countdown = setInterval(() => {
		minutes = parseInt(timer / 60, 10);
		seconds = parseInt(timer % 60, 10);
		minutes = minutes < 10 ? `0${minutes}` : minutes;
		seconds = seconds < 10 ? `0${seconds}` : seconds;

		displayTime.innerText = `${minutes}:${seconds}`;

		// when timer gets paused
		pauseApp = () => {
			clearInterval(countdown);
			clearInterval(animationInterval);
			return (pausedDuration = timer);
		};

		// when timer finishes
		if (--timer < 0) {
			timer = duration;
			displayTime.innerHTML = "Completed!";
			clearInterval(countdown);
			clearInterval(animationInterval);
			spButton.innerText = "START";
			completionSound.play();
			countCompletion();
			pausedDuration = null;
		}
	}, 1000);

	let animationInterval = setInterval(() => {
		breathingAnimation();
	}, 16000);
	setTimeout(() => {
		breathingAnimation();
	}, 1000);
};

const breathingAnimation = () => {
	breathIn.play();
	focusSymbol.classList.remove("exhale");
	focusSymbol.classList.add("inhale");
	setTimeout(() => {
		focusSymbol.classList.remove("inhale");
		focusSymbol.classList.add("exhale");
		breathOut.play();
	}, 8000);
};

// Stop start Timer
controls.addEventListener("click", e => {
	e.preventDefault();
	// finished timed animation before starting a new one
	if (!focusSymbol.classList.contains("inhale")) {
		if (e.target.innerText === "START") {
			e.target.innerText = "PAUSE";
			app();
		}
	} else if (e.target.innerText === "PAUSE") {
		e.target.innerText = "START";
		pauseApp();
	}
});

// changing bg color and completion sound
focusSymbol.addEventListener("click", e => {
	if (completionSound === audio1) {
		completionSound = audio2;
		background.classList.remove("bgA");
		background.classList.add("bgH");
	} else {
		completionSound = audio1;
		background.classList.remove("bgH");
		background.classList.add("bgA");
	}
});

// switching between 90 minutes and 60
timerSwitch.addEventListener("click", e => {
	if (duration === 5400 && !pausedDuration) {
		dot90.classList.remove("dot--selected");
		dot28.classList.add("dot--selected");
		duration = 1680;
		displayTime.innerText = `28:00`;
	} else if (duration === 1680 && !pausedDuration) {
		dot28.classList.remove("dot--selected");
		dot90.classList.add("dot--selected");
		duration = 5400;
		displayTime.innerText = `90:00`;
	}
});
