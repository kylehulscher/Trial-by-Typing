// trial by typing js1

const myRequest = new Request('https://raw.githubusercontent.com/kylehulscher/kylehulscher.github.io/main/word_list_formatted.json');
var myList = [];
var fullData = [];

var difficulty = 6;
var wordsLength = 10;
var corrInd = [];
var incInd = [];
var typedText = "";

function loadWordList() {
	fetch(myRequest)
	  .then((response) => response.json())
	  .then((data) => {
	  	dataKeys = Object.keys(data);
	    for(var i = 0; i < dataKeys.length; i++) {
	    	var entry = data[dataKeys[i]];
	    	myList.push(entry[0]['word']);
	    }}).then(function() {
	    	console.log(myList);
			for (var i = 0; i < wordsLength; i++) {
				var ind = Math.floor(Math.random() * (myList.length - (difficulty * 1000)));
				document.getElementById('content_header1').innerHTML += myList[ind] + " ";
			}})
		}

window.addEventListener('load', function () {
	loadWordList();
})

function headingComparator() {
	var header1Text = document.getElementById('content_header1').innerText;
	var header2Text = typedText + "";
	corrInd = [];
	incInd = [];
	for (var i = 0; i < header2Text.length; i++) {
		if (header2Text[i] != header1Text[i]) {
			incInd.push(i);
		}
		else if (header2Text[i] == header1Text[i]) {
			corrInd.push(i);
		}
	}
	var runs = [];
	var run = {runStart:0, runLen:0, runType:-1};
	var incPos = 0;
	var corPos = 0;
	for (var i = 0; i < corrInd.length + incInd.length; i++) {
		if (corPos < corrInd.length && (incInd.length == incPos || corrInd[corPos] < incInd[incPos] || incInd.length == 0)) {
			if (run.runType == -1) {
				run.runType = 0;
				run.runLen++;
			}
			else if (run.runType == 0) {
				run.runLen++;
			}
			else if (i != 0) {
				runs.push(run);
				run = {runStart:i, runLen:1, runType:0};
			}
			corPos++;
		}
		else if (incPos < incInd.length && (corrInd.length == corPos || incInd[incPos] < corrInd[corPos] || corrInd.length == 0)) {
			if (run.runType == -1) {
				run.runType = 1;
				run.runLen++;
			}
			else if (run.runType == 1) {
				run.runLen++;
			}
			else if (i != 0) {
				runs.push(run);
				run = {runStart:i, runLen:1, runType:1};
			}
			incPos++;
		}
	}
	runs.push(run);
	document.getElementById('content_header1').innerHTML = "";
	for (var i = 0; i < runs.length; i++) {
		var currRun = runs[i];
		if (runs[i].runType == 0) {
			document.getElementById('content_header1').innerHTML += ('<span class="correctRun">' + header1Text.substring(currRun.runStart, (currRun.runStart + currRun.runLen)) + '</span>');
		}
		else if (runs[i].runType == 1) {
			for (var j = i; j < (currRun.runStart + currRun.runLen); j++) {
				if (header1Text.substring(j, j+1) == " ") {
					header1Text = header1Text.substring(0,j) + "_" + header1Text.substring(j+1, header1Text.length);
				}
			}
			document.getElementById('content_header1').innerHTML += ('<span class="incorrectRun">' + header1Text.substring(currRun.runStart, (currRun.runStart + currRun.runLen)) + '</span>');
		}
	}
	document.getElementById('content_header1').innerHTML += ('<span class="nextChar">' + header1Text.substring(header2Text.length, header2Text.length + 1) + '</span>');
	document.getElementById('content_header1').innerHTML += header1Text.substring(Math.min(header2Text.length + 1, header1Text.length), header1Text.length);
}

document.addEventListener('keydown', function(event) {
	var header1String = document.getElementById('content_header1').innerText + "";
	var header2String = typedText + "";
	if (event.key == 'Backspace') {
		if (header2String[header2String.length - 1] == ";") {
			for (let i = header2String.length - 1; i >= 0; i--) {
				if (header2String[i] == "&") {
					typedText = header2String.substring(0, i);
					break;
				}
				else if (i == 0) {
					typedText = header2String.substring(0, header2String.length - 1);
				}
			}
		}
		else if (header1String[header2String.length - 1] == "_") {
			document.getElementById('content_header1').innerText = header1String.substring(0,header2String.length - 1) + " " + header1String.substring(header2String.length, header1String.length);
			typedText = header2String.substring(0, header2String.length - 1);
		}
		else {
			typedText = header2String.substring(0, header2String.length - 1);
		}
	}
	else if (event.keyCode == 32 || event.keyCode >= 48 && event.keyCode <= 90 || event.keyCode >= 96 && event.keyCode <= 111 || event.keyCode >= 186 && event.keyCode <= 222) {
		if (header2String.length < header1String.length) {
			typedText += event.key;
		}
	}
	headingComparator();
	console.log(typedText);
});

function reloadText() {
	myList = [];
	fullData = [];
	wordsLength = document.getElementById('lengthSlider').value;
	difficulty = 6 - document.getElementById('difficultySlider').value;
	corrInd = [];
	incInd = [];
	typedText = "";
	document.getElementById('content_header1').innerText = "";
	loadWordList();
}

function resetText() {
	corrInd = [];
	incInd = [];
	typedText = "";
	headingComparator();
}