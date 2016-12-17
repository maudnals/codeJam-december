window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
var durationBadState = 0;

// Settings of speech recognition

recognition.interimResults = true;

// Display settings

function bodyBad() {
    document.querySelector("body").classList.add("bad");
}

function neutral() {
    document.querySelector("body").classList.remove("bad");
    resetBadWord();
}

function displayBadWord(w) {
    document.querySelector(".bad-word").innerText = w;
}

function setAlpha(op) {
    document.querySelector('.bad-word').style.opacity = op;
}

function resetBadWord() {
    document.querySelector(".bad-word").innerText = "";
}

// Display image

function displayImage(w) {

    console.log(w);

    const url = "http://api.pixplorer.co.uk/image?word=" + w + "&size=tb";
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let imageUrl = JSON.parse(xhttp.responseText)
                .images[0]
                .imageurl;
            console.log(imageUrl);
            document.querySelector("#img").src = imageUrl;
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}



// Add an empty p to the dom

let p = document.createElement('p');
const words = document.querySelector('.words');
words.appendChild(p);

// Check duration

setInterval(function() {
    if (durationBadState >= 0) {
        durationBadState--;
        setAlpha(durationBadState / (1000 / 50));
        bodyBad();
    } else {
        neutral();
    }
}, 50);

// Result event handler

recognition.addEventListener('result', e => {

    console.log(e.results);

    const transcript = Array.from(e.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
    var transcriptWords = transcript.split(" ");

    transcriptWords.forEach(function(w) {
        if (negative_words.indexOf(w) > -1) {
            console.log(w);
            durationBadState = 1000 / 50;
            displayBadWord(w);
        }
    });

    displayImage(transcriptWords[transcriptWords.length - 1]);
    p.textContent = transcript;

});

recognition.addEventListener('end', recognition.start);
recognition.start();
