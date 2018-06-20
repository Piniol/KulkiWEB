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

var oldTheme = '';

window.requestAnimFrame = (
	function(){
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback, element){ window.setTimeout(callback, 1000 / 60); }; }
)();

var imgShow = document.createElement('canvas');
imgShow.width = 1620;
imgShow.height = 4500;

var imgHide = document.createElement('canvas');
imgHide.width = 1620;
imgHide.height = 2520;

var sprite = document.createElement('canvas');
sprite.width = 1620;
sprite.height = 4500;

var actual_ctx;
var ctx;
var board = null;
var tileS = {w: 100, h: 50};

var animations = document.createElement('canvas');
animations.width = 1100;
animations.height = 758;

var none = new Image();
none.src = "graphics/none.png";

var mag = [];
var cur = {x: 0, y: 0};
var Marble = {x: -1, y: -1, c: 0};

function TGame(){
	this.points = 0;
	this.number_of_colors = 5;
	this.draw_count = 0;
	this.show_next_colors = true;
	this.animate_movement = true;
	this.play_sound = true;
	this.is_active = false;
	this.language = 1;
	this.theme = 'cosmic';
	this.next_colors_array = new Array(5);
	for(var nc = 0; nc < 5; nc++)
		this.next_colors_array[nc] = -1;
	this.board = new Array(9);
	for(var i = 0; i < 9; i++){
		this.board[i] = new Array(9);
		for(var y = 0; y < 9; y++)
			this.board[i][y] = 0;
	}
}

function TUndo(){
	this.available = false;
	this.points = 0;
	this.draw_count = 0;
	this.next_colors_array = new Array(5);
	for(var nc = 0; nc < 5; nc++)
		this.next_colors_array[nc] = -1;
	this.board = new Array(9);
	for(var i = 0; i < 9; i++){
		this.board[i] = new Array(9);
		for(var y = 0; y < 9; y++)
			this.board[i][y] = 0;
	}
}
	
var Game = new TGame();
var Undo = new TUndo();

var peShow = [];
var peHide = [];
			
function TParticles(){
	this.color = 0;
	this.frame = 0;
	this.x = 0;
	this.y = 0;
	this.boardX = 0;
	this.boardY = 0;
}

function TAlerts(){
	this.EuserNull = 'Nazwa użytkownika nie może być pusta.';
	this.EpassNull = 'Hasło nie może być puste.';
	this.EnotAll = 'Musisz wypełnić wszystkie pola.';
	this.NOTOK = 'Nieprawidłowa nazwa użytkownika lub hasło.';
	this.Edb = 'Błąd bazy danych. Spróbój ponownie.';
	this.EuserLong = 'Nazwa użytkownika jest za długa.';
	this.Epass2Null = 'Powtórzenie hasła nie może być puste.'
	this.EpassDiff = 'Powtórzenie hasła różni się od podanego hasła.';
	this.EuserExist = 'Użytkownik o podanej nazwie już istnieje.';
	this.NOTLOGGED = 'Nie jesteś zalogowany.';
	this.NOGAMESLOT = 'Stan gry nie istnieje w bazie.';
}

var Alerts = new TAlerts();

var lastUpdateTime = 0;
var acDelta = 0;
var msPerFrame = 16;
var showNextCounter = 2;