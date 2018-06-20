/*
Copyright (C) Przemyslaw Wiechec

    The JavaScript code in this page is free software: you can
    redistribute it and/or modify it under the terms of the GNU
    General Public License (GNU GPL) as published by the Free Software
    Foundation, either version 3 of the License, or (at your option)
    any later version.  The code is distributed WITHOUT ANY WARRANTY;
    without even the implied warranty of MERCHANTABILITY or FITNESS
    FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.

    As additional permission under GNU GPL version 3 section 7, you
    may distribute non-source (e.g., minimized or compacted) forms of
    that code without the copy of the GNU GPL normally required by
    section 4, provided you include this license notice and a URL
    through which recipients can access the Corresponding Source.

*/

function login(){
	var request = '';
	request = "&lUser=" + document.getElementById("loginLogin").value + "&lPass=" + document.getElementById("loginPassword").value;
	ajaxRequest('login', request, 'loginResponse');
}

function loginResponse(resp){
	if(resp == 'OK')
		document.getElementById('loginForm').submit();
	else
		showAlert(Alerts[resp]);
}

function logout(){
	document.getElementById('logoutForm').submit();
}

function register(){
	var request = "&rUser=" + document.getElementById("registerLogin").value + "&rPass=" + document.getElementById("registerPassword").value + "&rPass2=" + document.getElementById("registerRePassword").value;
	ajaxRequest('register', request, 'registerResponse');
}

function registerResponse(resp){
	if(resp == 'OK'){
		document.getElementById('loginLogin').value = document.getElementById('registerLogin').value
		document.getElementById('loginPassword').value = document.getElementById('registerPassword').value
		login();
	} else 
		showAlert(Alerts[resp]);
}

function highscores(){
	ajaxRequest('highscores', '', 'highscoresResponse');
}

function highscoresResponse(resp){
	if(resp != 'Edb'){
		var obj = JSON.parse(resp);
		for(var i = 5; i <= 9; i += 2){
			for(var z = 0; z < 5; z++) {
				document.getElementById('user'+i+''+(z+1)).innerHTML = obj['col'+i][z].user;
				document.getElementById('score'+i+''+(z+1)).innerHTML = obj['col'+i][z].points;
			}
		}
		showWindow('highscoresWindow');
	} else
		showAlert(Alerts[resp]);
}

function saveList(respFunc){
	ajaxRequest('saveList', '', respFunc);
}

function saveListResponse(resp){
	var slot = null;
	if(resp != 'Edb' && resp != 'NOTLOGGED'){
		if(resp == 'NOSLOTS'){
			for(var s = 0; s < 10; s++){
				slot = document.getElementById('Slot'+s);
				slot.innerHTML = '--- SLOT ---';
				slot.onclick = function() {saveGame(0);};
			}
		} else {
			var i = 0;
			var obj = JSON.parse(resp);
			for(i = 0; i < obj.length; i++){
				slot = document.getElementById('Slot'+i);
				slot.innerHTML = obj[i].timestamp;
				slot.onclick = (function() {
					var sId = obj[i].id;
					return function() { 
						document.getElementById('saveOverwriteFlag').value = sId;
						document.getElementById('backAlertWindow').style.display = 'block';
						showWindow('overwriteWindow');
					}
				})();	
			}
			for(var s = i; s < 10; s++){
				slot = document.getElementById('Slot'+s);
				slot.innerHTML = '--- SLOT ---';
				slot.onclick = function() {saveGame(0);};
			}
		}
	} else
		showAlert(Alerts[resp]);
}

function saveListLoadResponse(resp){
	var slot = null;
	if(resp != 'Edb' && resp != 'NOTLOGGED'){
		if(resp == 'NOSLOTS'){
			for(var s = 0; s < 10; s++){
				slot = document.getElementById('LoadSlot'+s);
				slot.innerHTML = '--- SLOT ---';
			}
		} else {
			var i = 0;
			var obj = JSON.parse(resp);
			for(i = 0; i < obj.length; i++){
				slot = document.getElementById('LoadSlot'+i);
				slot.innerHTML = obj[i].timestamp;
				slot.onclick = (function() {
					var sId = obj[i].id;
					return function() {
						document.getElementById('loadBreakFlag').value = sId;
						if (Game.is_active == true){
							document.getElementById('backAlertWindow').style.display = 'block';
							showWindow('breakLoadWindow');
						}
						else 
							loadGame(sId);
					}
				})();	
			}
			for(var s = i; s < 10; s++){
				slot = document.getElementById('LoadSlot'+s);
				slot.innerHTML = '--- SLOT ---';
			}
		}
	} else
		showAlert(Alerts[resp]);
}

function saveGame(id){
	var request = '';
	var boardS = '';
	var nextS = '';

	for(var x = 0; x < 9; x++){
		for(var y = 0; y < 9; y++)
			boardS += Game.board[x][y]+';'
		boardS += '|';
	}

	for(x = 0; x < 3; x++)
		nextS += Game.next_colors_array[x]+';';
			
	request = "&save_id=" + id + "&play_sound=" + Game.play_sound + "&show_next_colors=" + Game.show_next_colors + "&number_of_colors=" + Game.number_of_colors + "&language=1&board=" + boardS + "&points=" + Game.points + "&next_colors=" + nextS + "&animate_movement=" + Game.animate_movement + "&theme=" + Game.theme;
	
	ajaxRequest('saveGame', request, 'saveGameResponse');
}

function saveGameResponse(resp){
	hideWindow2('overwriteWindow');
	hideWindow("saveWindow");	
}

function loadGame(id){
	var request = "&load_id=" + id;
	ajaxRequest('loadGame', request, 'loadGameResponse');
}

function loadGameResponse(resp){
	hideWindow2('breakLoadWindow');
	hideWindow("loadWindow");
	if(resp != 'Edb' && resp != 'NOTLOGGED' && resp != 'NOGAMESLOT'){
		Game.is_active = true;
		var obj = JSON.parse(resp);
		
		for(var z = mag.length-1; z >= 0; z--)
			mag[z].stopAnimation();
		
		Marble.x = -1;
		Marble.y = -1;
		peShow = [];
		peHide = [];
		
		Game.play_sound = Boolean(parseInt(obj.play_sound, 10));
		Game.show_next_colors = Boolean(parseInt(obj.show_next_colors, 10));
		Game.animate_movement = Boolean(parseInt(obj.animate_movement, 10));
		oldTheme = Game.theme;
		Game.theme = obj.theme;
		
		Game.number_of_colors = parseInt(obj.number_of_colors, 10);
		var oldLanguage = Game.language;
		Game.language = parseInt(obj.language, 10);
		if (Game.language != oldLanguage)
			changeLanguage();

		Game.points = parseInt(obj.points, 10);
		document.getElementById('score').innerHTML = number_format(Game.points, 0, ',', ' ');
		
		if (Game.show_next_colors == false) {
			for (var n = 0; n < 3; n++)
				document.getElementById('nextColor'+(n+1)).className = 'nextColorImgNone';
		}
		
		var nc = obj.next_colors.split(';');
		for(var i = 0; i < 3; i++)
			Game.next_colors_array[i] = parseInt(nc[i], 10);
			
		ctx.clearRect(0, 0, 900, 558);
		actual_ctx.clearRect(0, 0, board.w, board.h);
			
		var b1 = obj.board.split('|');
		for(var x = 0; x < 9; x++){
			for(var y = 0; y < 9; y++){
				var b2 = b1[x].split(';');
				Game.board[x][y] = parseInt(b2[y], 10);
				if(Game.board[x][y] > 0)
					ctx.drawImage(sprite, (Game.board[x][y]-1)*50, 0, 50,50, x * (tileS.w / 2) - y * (tileS.w / 2) + 425 | 0, x * (tileS.h / 2) + y * (tileS.h / 2) + 35 | 0, 50, 50);
			}
		}

		showNextCounter = 1;
		Game.draw_count = 3;
		Undo = new TUndo();
		Undo.available = false;
		Game.is_active = true;
		setSession();
	} else
		showAlert(Alerts[resp]);
}

function checkHighScore(){
	var request = "&number_of_colors=" + Game.number_of_colors + "&points=" + Game.points;
	ajaxRequest('checkHighscore', request, 'checkHighScoreResponse');
}

function checkHighScoreResponse(resp){
	if(resp != 'Edb'){
		if(resp == 'newHigh')
			showWindow("newHighscoreWindow");
		 else 
			showWindow("endGameWindow");
	} else
		showAlert(Alerts[resp]);
}

function loadOptions(){
	ajaxRequest('loadOptions', '', 'loadOptionsResponse');
}

function loadOptionsResponse(resp){
	if(resp != 'Edb'){
		var obj = JSON.parse(resp);
		Game.play_sound = Boolean(parseInt(obj.play_sound, 10));
		Game.show_next_colors = Boolean(parseInt(obj.show_next_colors, 10));
		Game.number_of_colors = parseInt(obj.number_of_colors, 10);
		Game.language = parseInt(obj.language, 10);
		Game.animate_movement = Boolean(parseInt(obj.animate_movement, 10));
		Game.theme = obj.theme;
	} else
		showAlert(Alerts[resp]);
}

function saveOptions2(){
	var request = "&number_of_colors=" + Game.number_of_colors + "&show_next_colors=" + Game.show_next_colors + "&play_sound=" + Game.play_sound + "&language=" + Game.language + "&animate_movement=" + Game.animate_movement + '&theme=' + Game.theme;
	ajaxRequest('saveOptions', request, 'saveOptions2Response');
	setSession();
}

function saveOptions2Response(resp){
	if(resp == 'Edb')
		showAlert(Alerts[resp]);
}

function setSession() {
	var boardS = '';
	var nextS = '';
	var undoS = '';
	var undoNextS = '';

	for(var x = 0; x < 9; x++){
		for(var y = 0; y < 9; y++)
			boardS += Game.board[x][y]+';'
		boardS += '|';
	}
	for(x = 0; x < 3; x++)
		nextS += Game.next_colors_array[x]+';';
			
	for(var x = 0; x < 9; x++){
		for(var y = 0; y < 9; y++)
			undoS += Undo.board[x][y]+';'
		undoS += '|';
	}
	for(x = 0; x < 3; x++)
		undoNextS += Undo.next_colors_array[x]+';';

	var request = "&game_points=" + Game.points + "&game_number_of_colors=" + Game.number_of_colors + "&game_draw=" + Game.draw_count + "&game_show_next_colors=" + Game.show_next_colors + "&game_play_sound=" + Game.play_sound + "&game_is_active=" + Game.is_active + "&game_language=" + Game.language + "&undo_points=" + Undo.points + "&undo_available=" + Undo.available + "&game_board=" + boardS + "&game_next_colors=" + nextS + "&undo_board=" + undoS + "&undo_next_colors=" + undoNextS + "&game_animate_move=" + Game.animate_movement + '&theme=' + Game.theme;
	ajaxRequest('setSession', request, 'setSessionResponse');
}

function setSessionResponse(){
	if(Game.theme != oldTheme)
		window.location = window.location.pathname;
}

function getSession() {
	ajaxRequest('getSession', '', 'getSessionResponse');
}

function getSessionResponse(resp) {
	if(resp != ''){
		showNextCounter = 2;
		Marble.x = -1;
		Marble.y = -1;
		peShow = [];
		peHide = [];
		ctx.clearRect(0, 0, 900, 558);
		actual_ctx.clearRect(0, 0, board.w, board.h);
		var obj = JSON.parse(resp);
					
		Game.points = parseInt(obj.game_points, 10);
		Game.number_of_colors = parseInt(obj.game_number_of_colors, 10);
		Game.draw_count = parseInt(obj.game_draw, 10);
		Game.show_next_colors = obj.game_show_next_colors;
		Game.animate_movement = obj.game_animate_move;
		Game.play_sound = obj.game_play_sound;
		Game.is_active = obj.game_is_active;
		Game.language = obj.game_language;
		Game.theme = obj.game_theme;
		
		var nc = obj.game_next_colors.split(';');
		for(var i = 0; i < 3; i++)
			Game.next_colors_array[i] = parseInt(nc[i]);

		var gb = obj.game_board.split('|');
		for(var x = 0; x < 9; x++){
			var gb2 = gb[x].split(';');
			for(var y = 0; y < 9; y++){
				Game.board[x][y] = parseInt(gb2[y]);
				if(Game.board[x][y] > 0)
					ctx.drawImage(sprite, (Game.board[x][y]-1)*50, 0, 50,50, x * (tileS.w / 2) - y * (tileS.w / 2) + 425 | 0, x * (tileS.h / 2) + y * (tileS.h / 2) + 35 | 0, 50, 50);
			}
		}
					
		Undo.points = parseInt(obj.undo_points, 10);
		Undo.available = obj.undo_available;
		Undo.next_colors_array = new Array(3);
		var nc = obj.undo_next_colors.split(';');
		for(var i = 0; i < 3; i++)
			Undo.next_colors_array[i] = parseInt(nc[i], 10);
		var b1 = obj.undo_board.split('|');
		for(var x = 0; x < 9; x++){
			var b2 = b1[x].split(';');
			for(var y = 0; y < 9; y++){
				Undo.board[x][y] = parseInt(b2[y], 10);
			}
		}
		
		document.getElementById('score').innerHTML = number_format(Game.points, 0, ',', ' ');
		
		if(Game.show_next_colors == true){
			for(var nc = 0; nc < 3; nc++){
				document.getElementById('nextColor'+(nc+1)).className = 'nextColorImg'+Game.next_colors_array[nc];
				document.getElementById('nextColor'+(nc+1)).style.opacity = '1';
			}
		}
	}
	changeLanguage();
	hideWindow('gameLoadingWindow');
	hideWindow('backWindow');
}

function changeLanguage() {
	var request = "&language=" + Game.language;
	ajaxRequest('changeLanguage', request, 'changeLanguageResponse');
}

function changeLanguageResponse(resp){
	if(resp != 'Edb'){
		var obj = JSON.parse(resp);

		for(var key in obj.caption){
			try{
				document.getElementById(key).innerHTML = obj.caption[key];
			} catch(e){}
		}
		
		for(var key in obj.alert){
			try{
				Alerts[key] = obj.alert[key];
			} catch(e){}
		}
		
		for(var key in obj.data){
			try{
				var arr = document.querySelectorAll("span[data-"+key+"]");
				for(var i = 0; i < arr.length; i++)
					arr[i].innerHTML = obj.data[key];
			} catch(e){}
		}
	} else
		showAlert(Alerts[resp]);
}

function ajaxRequest(op, req, resp){
	var page_request = false;
	
	if(window.XMLHttpRequest){
		page_request = new XMLHttpRequest();
	} else if(window.ActiveXObject){
		try{
			page_request = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e){
			try {
				page_request = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e){}
		}
	}
	else
		return false;
	
	page_request.onreadystatechange = function(){
		ajaxResponse(page_request, op, resp);
	}
		
	page_request.open("POST", "ajax.php", true);
	page_request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	page_request.send('op=' + op + req);
}

function ajaxResponse(page_request, op, resp){
	if(page_request.readyState == 4){
		if(page_request.status == 200){
			if (resp != '') {
				var tmp_req = page_request.responseText;
				window[resp](tmp_req);
			}
		}
	}
}