/* This program is free software. It comes without any warranty, to
 * the extent permitted by applicable law. You can redistribute it
 * and/or modify it under the terms of the Do What The Fuck You Want
 * To Public License, Version 2, as published by Sam Hocevar. See
 * COPYING or http://sam.zoy.org/wtfpl/COPYING for more details. */ 

window.onload = function() {

	var baseUrl = location.href.split("#")[0],
	    audio = document.getElementsByTagName("audio")[0],
      dropbox = document.getElementsByTagName("html")[0],
	    input = document.getElementsByTagName("input")[0],
	    ol = document.getElementsByTagName("ol")[0],
      button = document.getElementsByTagName("button")[0],
      p = document.getElementsByTagName("p")[0],
	    popEnabled = false,
	    files = [],
	    windowURL = window.URL || window.webkitURL,
      playing = false;
        
    function togglePlaying() {
        if(files.length > 0) playing = !playing;
    }

    button.onclick = function() {
        togglePlaying();
        if(playing) audio.play();
        else audio.pause();
    };

	window.onpopstate = function(event) {
		if(popEnabled === true) {
            loadSongs();
            if(playing === true) audio.play();
		}
	};
	
    audio.addEventListener("playing", function() {
        playing = true;
	}, false);
    
    audio.addEventListener("pause", function() {
        playing = false;
	}, false);
    
	audio.addEventListener("ended", function() {
		window.history.forward();
	}, false);
	
	function loadSongs() {
        var song = location.hash.split("#")[1];
        popEnabled = false;
        if(song === undefined) song = getRandomSong();
		history.replaceState("test", null, baseUrl + "#" + song);
		history.pushState("test", null, baseUrl + "#" + getRandomSong(song));
		window.history.back();
		popEnabled = true;
        audio.src = files[song - 1];
	}
	
	function getRandomSong(song) {
		var numberSongs = files.length;
		var randomSong = Math.floor(Math.random()*numberSongs) + 1;
		if(randomSong != song) return randomSong;
		else if(numberSongs == 1) return randomSong;
		else if(randomSong == 1) return randomSong + 1;
		else return randomSong - 1;
	}

	dropbox.addEventListener("dragenter", noOp, false);
	dropbox.addEventListener("dragexit", noOp, false);
	dropbox.addEventListener("dragover", noOp, false);
	dropbox.addEventListener("drop", drop, false);
		
	function noOp(e) {
		e.stopPropagation();
		e.preventDefault();
	}
	
	function drop(e) {
		e.stopPropagation();
		e.preventDefault();
		var files = e.dataTransfer.files;
		if(files.length > 0) fileList(files);
	}
	
	function fileList(selectedFiles) {
		var x = 0;
		p.style.display="none";
		while(x < selectedFiles.length) {
			var a = document.createElement("a");
			a.innerHTML = selectedFiles[x].name;
			a.href = "#" + (files.length + 1);
			ol.appendChild(a);
			files.push(windowURL.createObjectURL(selectedFiles[x]));
			x++;
		}
		if(!playing) loadSongs();
	}
	
	input.onchange = function() {
		if(input.files.length > 0) fileList(input.files);
	};
};
