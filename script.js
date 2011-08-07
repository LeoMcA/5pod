/* This program is free software. It comes without any warranty, to
 * the extent permitted by applicable law. You can redistribute it
 * and/or modify it under the terms of the Do What The Fuck You Want
 * To Public License, Version 2, as published by Sam Hocevar. See
 * COPYING or http://sam.zoy.org/wtfpl/COPYING for more details. */ 

window.onload = function() {

	var baseUrl = location.href.split("#")[0];
	var play = true;
	var button = document.getElementsByTagName("button")[0];
	var audio = document.getElementsByTagName("audio")[0];
	var dropbox = document.getElementsByTagName("datagrid")[0];
	var input = document.getElementsByTagName("input")[0];
	var ol = document.getElementsByTagName("ol")[0];
	var playing = false;
	var popEnabled = false;
	var files = [];

	button.onclick = function() {
		if(play == true) {
			button.innerHTML = "Pause";
			loadRandomSong(songFromUrl());
			playSong(songFromUrl());
		}
		if(play == false) {
			button.innerHTML = "Play";
			pauseSong();
			currentTime = audio.currentTime;
		}
		toggleButton();	
	};
	
	window.onpopstate = function() {
		if(popEnabled == true) {
			if(playing == true) playSong(songFromUrl());
			if(playing == false) pauseSong();
			loadRandomSong(songFromUrl());
		}
	}
	
	audio.addEventListener("ended", function() {
		window.history.forward();
	}, false);
	
	function playSong(song) {
		audio.src = files[song - 1];
		audio.play();
		playing = true;
	}
	
	function pauseSong() {
		audio.pause();
		playing = false;
	}
	
	function randomSong(song) {
		var numberSongs = files.length;
		var randomSong =  Math.floor(Math.random()*numberSongs) + 1;
		if(randomSong != song) {
			return randomSong;
		}
		else if(numberSongs == 1) {
			return randomSong;
		}
		else if(randomSong == 1) {
			return randomSong + 1;
		}
		else return randomSong - 1;
	}
	
	function toggleButton() {
		play = !play;
		return play;
	}
	
	function loadRandomSong(song) {
		popEnabled = false;
		if(song == null) song = randomSong(song);
		history.replaceState(null, null, baseUrl + "#!/" + song);
		history.pushState(null, null, baseUrl + "#!/" + randomSong(song));
		window.history.back();
		popEnabled = true;
	}
	
	function songFromUrl() {
		return location.hash.split("/")[1];
	}

	dropbox.addEventListener("dragenter", dragenter, false);
	
	dropbox.addEventListener("dragover", dragover, false);
	
	dropbox.addEventListener("drop", drop, false);
		
	function dragenter(e) {
		e.stopPropagation();
		e.preventDefault();
	}

	function dragover(e) {
		e.stopPropagation();
		e.preventDefault();
	}
	
	function drop(e) {
		e.stopPropagation();
		e.preventDefault();
		fileList(e.dataTransfer.files);
	}
	
	function fileList(selectedFiles) {
		document.getElementsByTagName("p")[0].style.display = "none";
		var x = 0;
		while(x < selectedFiles.length) {
			var li = document.createElement("li");
			var a = document.createElement("a");
			a.innerHTML = selectedFiles[x].name;
			a.href = "#!/" + (files.length + 1);
			li.appendChild(a);
			ol.appendChild(li);
			files.push(window.URL.createObjectURL(selectedFiles[x]));
			x++;
		}
	}
	
	input.onchange = function() {
		fileList(input.files);
	}
}
