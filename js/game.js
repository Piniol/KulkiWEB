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

function initBoard(){
	try{
		if (spriteG.complete == true && showG.complete == true && hideG.complete == true && spriteG.width > 0 && showG.width > 0 && hideG.width > 0 ) {
			try{
				makeUnselectable(document.body);
				
				if(!window.HTMLCanvasElement){
					document.getElementsByTagName("body")[0].innerHTML = '<div class="iebrowser">Niestety twoja przeglądarka nie wspiera HTML5 :(<br>Sorry, but your browser doesn\'t support HTML5 :(</div>';
					return true;
				}
				
				loadOptions();		
				board = {w: document.getElementById('board').width, h: document.getElementById('board').height};
					
				var tmp = document.getElementById('board');
				ctx = tmp.getContext("2d");
				ctx.clearRect(0, 0, board.w, board.h);
						
				sprite.getContext("2d").drawImage(spriteG, 0, 0);
				spriteG = null;
					
				for(y = 0; y < 9; y++){
					for(x = 0; x < 9; x++){
						pixel_x = ((x - y) * (tileS.w / 2)) + (tileS.w * 4);
						pixel_y = ((x + y) * (tileS.h / 2)) + tileS.h;
						if(x % 2 == 0){
							if(y % 2 == 0)
								ctx.drawImage(sprite, 0, 100, 100, 107, pixel_x | 0, pixel_y | 0, 100, 107);
							else
								ctx.drawImage(sprite, 100, 100, 100, 107, pixel_x | 0, pixel_y | 0, 100, 107);
						} else {
							if(y % 2 == 0)
								ctx.drawImage(sprite, 100, 100, 100, 107, pixel_x | 0, pixel_y | 0, 100, 107);
							else
								ctx.drawImage(sprite, 0, 100, 100, 107, pixel_x | 0, pixel_y | 0, 100, 107);
						}
					}
				}
						
				tmp = document.getElementById('balls');
				ctx = tmp.getContext("2d");
						
				tmp = document.getElementById('curPos');
				tmp.addEventListener("mousemove", getXY, false);
				tmp.onclick = Function ('drawSelection()');
						
				actual_ctx = document.getElementById('actualTile').getContext("2d");
				requestAnimFrame(drawAnimations);
						
				imgShow.getContext("2d").drawImage(showG, 0, 0);
				showG = null;
					
				imgHide.getContext("2d").drawImage(hideG, 0, 0);
				hideG = null;
						
				for (c = 1; c <= 3; c++)
					document.getElementById('nextColor'+c).className = 'nextColorImgNone';

				getSession();
			}catch(err){
				setTimeout(initBoard, 250);
			}
		} else  {
			setTimeout(initBoard, 250);
		}
	} catch(e){
		setTimeout(initBoard, 250);
	}
}

function drawField(b){
	var freeFields = new Array();
	var z = 0;
	
	for(var x = 0; x < 9; x++){
		for(var y = 0; y < 9; y++){
			if(Game.board[x][y] == 0)
				freeFields.push({fx: x, fy: y});
		}
	}
	
	if(freeFields.length == 0) {
		freeFields.push({fx: -1, fy: -1});
		z = 0;
	} else {
		z = randomXToY(0, freeFields.length-1);
		Game.board[freeFields[z].fx][freeFields[z].fy] = b;
	}
	
	return freeFields[z];
}

function makeUnselectable(node){
	if(node.nodeType == 1 && node.nodeName != 'INPUT')
		node.setAttribute("unselectable", "on");

	var child = node.firstChild;
	while (child) {
		if(node.nodeName != 'INPUT') 
			makeUnselectable(child);
		child = child.nextSibling;
	}
}

function showWindow(o){
	document.getElementById('backWindow').style.display = 'block';
	var e = document.getElementById(o);
	e.style.display = 'block';
	
	switch (o){
		case 'registerWindow': document.getElementById('registerLogin').focus(); break;
		case 'loginWindow': document.getElementById('loginLogin').focus(); break;
	}
}

function hideWindow(o){
	document.getElementById('backWindow').style.display = 'none';
	document.getElementById(o).style.display = 'none';
}

function hideWindow2(o){
	document.getElementById(o).style.display = 'none';
	switch(o){
		case 'breakLoadWindow':
		case 'overwriteWindow':
			document.getElementById('backAlertWindow').style.display = 'none'; break;
		case 'newHighscoreWindow':
			showWindow('endGameWindow'); break;
	}
}

function showWindowConditional(o){
	if (o == 'loadWindow') {
		saveList('saveListLoadResponse');
		showWindow(o);
	}
	if (Game.is_active == true) {
		switch (o) {
			case 'saveWindow': saveList('saveListResponse'); break;
		}
		
		showWindow(o);
	}
}

function showAlert(t){
	document.getElementById('backAlertWindow').style.display = 'block';
	document.getElementById('alertText').innerHTML = t;
	document.getElementById('alertWindow').style.display = 'block';
}

function hideAlert(){
	document.getElementById('backAlertWindow').style.display = 'none';
	document.getElementById('alertWindow').style.display = 'none';
}

function drawShow(count, oldX, oldY, oldC){
	var c = -1;
	var field = null;
	var line = 0;
	
	if(count != null && count > 1){
		for(var z = 0; z < count; z++){
			c = (count == 3 ? Game.next_colors_array[z] : randomXToY(1, Game.number_of_colors));
			field = drawField(c);
			if(field.fx == -1)
				break;
			else {
				line = checkLine(field.fx, field.fy, c);
				if(line == 0)
					drawShowParticle({x: field.fx, y: field.fy, color: c});
				if(z < 3)
					Game.next_colors_array[z] = randomXToY(1, Game.number_of_colors);
			}
		}
		if (oldX != null)
			drawShowParticle({x: oldX, y: oldY, color: oldC});
		showNextCounter = 0;
	}
	
	checkGameOver();
}

function newGame(){
	if(Game.is_active){
		showWindow('newGameWindow');
	} else {
		resetGame();
	}
}

function resetGame(){
	hideWindow('newGameWindow');
	document.getElementById('score').innerHTML = number_format(0, 0, ',', ' ');
	Game.points = 0;
	Game.draw_count = 5;
	Game.is_active = true;

	Undo.points = 0;
	Undo.draw_count = 3;
	Undo.available = false;

	for(var x = 0; x < 9; x++){
		for(var y = 0; y < 9; y++){
			Game.board[x][y] = 0;
			Undo.board[x][y] = 0;
		}
	}
	
	for(var z = mag.length-1; z >= 0; z--)
		mag[z].stopAnimation();
		
	Marble.x = -1;
	Marble.y = -1;
	peShow = [];
	peHide = [];
	
	if (Game.show_next_colors == false) {
		for (c = 1; c <= 3; c++)
			document.getElementById('nextColor'+c).className = 'nextColorImgNone';
	}
		
	ctx.clearRect(0, 0, 900, 558);
	actual_ctx.clearRect(0, 0, board.w, board.h);
	drawShow(5);
}

function getXY(event){
	var mousePosition = {x: 0, y: 0};
	if(!event.offsetX) {
		event.offsetX = event.pageX - parseInt(document.getElementById('actualTile').offsetLeft);
		event.offsetY = event.pageY - parseInt(document.getElementById('actualTile').offsetTop);
	}
	mousePosition.x = parseInt(event.offsetX) - (tileS.w * 4);
	mousePosition.y = parseInt(event.offsetY) - (tileS.h);
	cur.x = Math.round((mousePosition.x / tileS.w) + (mousePosition.y / tileS.h)) - 1;
	cur.y = Math.round((-mousePosition.x / tileS.w) + (mousePosition.y / tileS.h));

	return cur;
}

function drawActual(x,y){
	var tmp = -1;

	actual_ctx.clearRect(0, 0, board.w, board.h);
	if(x >= 0 && x <= 8 && y >=0 && y <= 8){
		if(Marble.x >= 0 && Marble.y >= 0 && Game.board[x][y] == 0){
			var path = AStar(Game.board, [Marble.y, Marble.x], [y, x]);
			tmp = (path.length > 1 ? 200 : 0);
		} else if(Game.board[x][y] > 0)
			tmp = 100;	
	}
	
	if(tmp > -1){
		actual_ctx.drawImage(sprite, tmp, 50, 100, 50, x * (tileS.w / 2) - y * (tileS.w / 2) + (tileS.w * 4) | 0, x * (tileS.h / 2) + y * (tileS.h / 2) + tileS.h | 0, 100, 50);
	}
}

function animateNextColors(){
	if(showNextCounter <= 1 && Game.show_next_colors == true && Game.is_active == true){
		for (var n = 0; n < 3; n++) {
			document.getElementById('nextColor'+(n+1)).className = 'nextColorImg'+Game.next_colors_array[n];
			document.getElementById('nextColor'+(n+1)).style.opacity = showNextCounter;
		}
		showNextCounter += 0.2;
	}
}

function drawAnimations(){
	var delta = Date.now() - lastUpdateTime;

	if(acDelta > msPerFrame){
		if(Game.is_active == true){
			acDelta = 0;
			animations.getContext("2d").clearRect(0, 0, animations.width, animations.height);
			document.getElementById("animations").getContext("2d").clearRect(0, 0, animations.width, animations.height);
			animateHideParticle();
			animateShowParticle();
			animateSelection();
			drawActual(cur.x, cur.y);
			if (Game.show_next_colors == true)
				animateNextColors();
			document.getElementById("animations").getContext( "2d").drawImage(animations, 0, 0);
		}
	} else
		acDelta += delta;
	
	lastUpdateTime = Date.now();
	requestAnimFrame(drawAnimations);	
}

function checkLine(sx, sy, c){
	var diagLRl = [], diagLRr = [];
	var diagRLl = [], diagRLr = [];
	var horl = [], horr = [];
	var verl = [], verr = [];
	var tmp = [];

	for(var z = 1; z < 9; z++){
		if(sx - z >= 0 && Game.board[sx - z][sy] == c && (z == 1 || (z > 1 && verl.length > 0 && verl[verl.length-1].x == (sx-z+1))))
			verl.push({x: sx - z, y: sy});
		if(sx + z <= 8 && Game.board[sx + z][sy] == c && (z == 1 || (z > 1 && verr.length > 0 && verr[verr.length-1].x == (sx+z-1))))
			verr.push({x: sx + z, y: sy});
			
		if(sy - z >= 0 && Game.board[sx][sy - z] == c && (z == 1 || (z > 1 && horl.length > 0 && horl[horl.length-1].y == (sy-z+1))))
			horl.push({x: sx, y: sy - z});
		if(sy + z <= 8 && Game.board[sx][sy + z] == c && (z == 1 || (z > 1 && horr.length > 0 && horr[horr.length-1].y == (sy+z-1))))
			horr.push({x: sx, y: sy + z});
			
		if(sx - z >= 0 && sy - z >= 0 && Game.board[sx - z][sy - z] == c && (z == 1 || (z > 1 && diagLRl.length > 0 && diagLRl[diagLRl.length-1].x == (sx-z+1) && diagLRl[diagLRl.length-1].y == (sy-z+1))))
			diagLRl.push({x: sx - z, y: sy - z});
		if(sx + z <= 8 && sy + z <= 8 && Game.board[sx + z][sy + z] == c && (z == 1 || (z > 1 && diagLRr.length > 0 && diagLRr[diagLRr.length-1].x == (sx+z-1) && diagLRr[diagLRr.length-1].y == (sy+z-1))))
			diagLRr.push({x: sx + z, y: sy + z});
			
		if(sx + z <= 8 && sy - z >= 0 && Game.board[sx + z][sy - z] == c && (z == 1 || (z > 1 && diagRLl.length > 0 && diagRLl[diagRLl.length-1].x == (sx+z-1) && diagRLl[diagRLl.length-1].y == (sy-z+1))))
			diagRLl.push({x: sx + z, y: sy - z});
		if(sx - z >= 0 && sy + z <= 8 && Game.board[sx - z][sy + z] == c && (z == 1 || (z > 1 && diagRLr.length > 0 && diagRLr[diagRLr.length-1].x == (sx-z+1) && diagRLr[diagRLr.length-1].y == (sy+z-1))))
			diagRLr.push({x: sx - z, y: sy + z});
	}

	if(verl.length + verr.length >= 4)
		tmp = tmp.concat(verr, verl);
	if(horl.length + horr.length >= 4)
		tmp = tmp.concat(horl, horr);
	if(diagLRl.length + diagLRr.length >= 4)
		tmp = tmp.concat(diagLRl, diagLRr);
	if(diagRLl.length + diagRLr.length >= 4)
		tmp = tmp.concat(diagRLl, diagRLr);

	if(tmp.length >= 4){
		tmp.push({x: sx, y: sy});
		for(var l = 0; l < tmp.length; l++){
			var color = Game.board[tmp[l].x][tmp[l].y];
			Game.board[tmp[l].x][tmp[l].y] = 0;
			drawHideParticle(tmp[l].x, tmp[l].y, color);
		}
		
		var p = 0;
		switch(Game.number_of_colors){
			case 5: p = tmp.length; break;
			case 7: p = tmp.length * 2; break;
			case 9: p = tmp.length * 4; break;
		}
		if(Game.show_next_colors)
			p -= Math.round(p / 3);
		Game.points += p;
		document.getElementById('score').innerHTML = number_format(Game.points, 0, ',', ' ');

		checkGameOver();
	}
	
	return tmp.length;
}

function undoMove(){
	if(Game.is_active == true && Undo.available == true){
		Undo.available = false;
		Game.points = Undo.points;
		document.getElementById('score').innerHTML = number_format(Game.points, 0, ',', ' ');
		Game.draw_count = Undo.draw_count;
		
		for(var z = mag.length-1; z >= 0; z--)
			mag[z].stopAnimation();
		
		for(var nc = 0; nc < 3; nc++){
			Game.next_colors_array[nc] = Undo.next_colors_array[nc];
			document.getElementById('nextColor'+(nc+1)).className = 'nextColorImg'+Game.next_colors_array[nc];
			document.getElementById('nextColor'+(nc+1)).style.opacity = '1';
		}
		
		showNextCounter = 2;
		Marble.x = -1;
		Marble.y = -1;
		peShow = [];
		peHide = [];
		
		ctx.clearRect(0, 0, 900, 558);
		actual_ctx.clearRect(0, 0, board.w, board.h);
		
		for(var x = 0; x < 9; x++){
			for(var y = 0; y < 9; y++){
				Game.board[x][y] = Undo.board[x][y];
				if(Game.board[x][y] > 0)
					ctx.drawImage(sprite, (Game.board[x][y]-1)*50, 0, 50,50, x * (tileS.w / 2) - y * (tileS.w / 2) + 425 | 0, x * (tileS.h / 2) + y * (tileS.h / 2) + 35 | 0, 50, 50);
			}
		}
		setSession();
	}
}

function gameOver(){
	Game.is_active = false;
	checkHighScore();
}

function confirmOverwrite(){
	document.getElementById('backAlertWindow').style.display = 'none';
	saveGame(document.getElementById('saveOverwriteFlag').value);
}

function confirmBreak(){
	document.getElementById('backAlertWindow').style.display = 'none';
	loadGame(document.getElementById('loadBreakFlag').value);
}

function showOptions(){
	document.getElementById('nextColors').checked = Game.show_next_colors;
	var e = document.getElementById('numberColors');
	for(var x = 0; x < e.options.length; x++){
		if (e.options[x].value == Game.number_of_colors) {
			e.selectedIndex = x;
			break;
		}
	}
	e = document.getElementById('language');
	for(var x = 0; x < e.options.length; x++){
		if (e.options[x].value == Game.language) {
			e.selectedIndex = x;
			break;
		}
	}
	e = document.getElementById('theme');
	for(var x = 0; x < e.options.length; x++){
		if (e.options[x].value == Game.theme) {
			e.selectedIndex = x;
			break;
		}
	}
	showWindow('optionsWindow');
}

function saveOptions(){
	var nc = Game.number_of_colors;
	var snc = Game.show_next_colors;
	
	var e = document.getElementById('numberColors');
	Game.number_of_colors = parseInt(e.options[e.selectedIndex].value, 10);
	
	e = document.getElementById('language');
	var oldLanguage = Game.language;
	Game.language = parseInt(e.options[e.selectedIndex].value, 10);
	
	e = document.getElementById('theme');
	oldTheme = Game.theme;
	Game.theme = e.options[e.selectedIndex].value;
	
	Game.show_next_colors = document.getElementById('nextColors').checked;
	
	saveOptions2();
	if (Game.language != oldLanguage)
		changeLanguage();
	
	hideWindow('optionsWindow');

	if(Game.is_active == true && (Game.number_of_colors != nc || Game.show_next_colors != snc)){
		Game.is_active = false;
		newGame();
	}
}

function registerSubmit(e){
	var code = (e.keyCode ? e.keyCode : e.which);
	if(code == 13)
		register();
}

function loginSubmit(e){
	var code = (e.keyCode ? e.keyCode : e.which);
	if(code == 13)
		login();
}

function checkGameOver(){
	var countFields = 0;
	
	for(var x = 0; x < 9; x++){
		for(var y = 0; y < 9; y++){
			if(Game.board[x][y] > 0)
				countFields++;
		}
	}
	
	setSession();
	
	if(countFields == 0) {
		drawShow(5);
	} else {
		if(countFields == 81)
			gameOver();
	}
}