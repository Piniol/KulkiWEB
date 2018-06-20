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
    
Original Magnetic class by Hakim El Hattab: http://hakim.se/

*/

function Magnetic (){
	this.d = null;
	this.q = [];
	this.m = {x: 0, y: 0, o: 50};
	this.col = null;
	this.stop = false;
	this.finished = false;
	this.pc = 200;

	this.initParticles= function (a){
			for(var b = 0; b < this.pc; b++){
				var c = new Particle;
				c.position.x = a.x;
				c.position.y = a.y;
				c.shift.x = a.x;
				c.shift.y = a.y;
				c.magnet = this.m;
				this.q.push(c);
			}
		}
		
	this.animateParticles = function(){
		if(this.stop == true)
			this.col.a = (parseFloat(this.col.a) - 0.1) + '';
			if(parseFloat(this.col.a) >= 0.1){
				for(var c = 0; c < this.pc; c++){
					this.q[c].angle += this.q[c].speed;
					this.q[c].shift.x += (this.m.x - this.q[c].shift.x) * this.q[c].speed;
					this.q[c].shift.y += (this.m.y - this.q[c].shift.y) * this.q[c].speed;
					this.q[c].position.x = this.q[c].shift.x + Math.cos(c + this.q[c].angle) * this.q[c].orbit * this.q[c].force;
					this.q[c].position.y = this.q[c].shift.y + Math.sin(c + this.q[c].angle) * this.q[c].orbit * this.q[c].force;
					this.q[c].orbit += (this.m.o - this.q[c].orbit) * 0.1;
					this.d.beginPath();
					this.d.fillStyle = "rgba(" + this.col.r + "," + this.col.g + "," + this.col.b + "," + this.col.a + ")";
					this.d.arc(this.q[c].position.x | 0, this.q[c].position.y | 0, this.q[c].size / 2, 0, Math.PI * 2, true);
					this.d.fill();
				}
			} else {
				this.finished = true;
			}
		}

	this.init = function(px, py, k, c){
		this.d = animations.getContext("2d");
		this.col = k;
		this.q = [];
		this.m.x = px;
		this.m.y = py;
		this.initParticles({x: px, y: py});
		this.stop = false;
		this.finished = false;
	}
		
	this.stopAnimation = function(){
		this.stop = true;
	}
		
	this.hasFinished = function(){
		return this.finished;
	}
}

function Particle(){
	this.size = 0.5 + Math.random() * 3.5;
	this.position = {x: 0, y: 0};
	this.shift = {x: 0, y: 0};
	this.angle = 0;
	this.speed = 0.01 + this.size / 4 * 0.03;
	this.force = 1 - Math.random() * 0.11;
	this.orbit = 1;
	this.magnet = null;
}

function drawSelection(){
	var sel = {x: cur.x, y: cur.y};
	if(sel.x >=0 && sel.x <= 8 && sel.y >= 0 && sel.y <= 8){
		if(Game.board[sel.x][sel.y] > 0 && (sel.x != Marble.x || sel.y != Marble.y)){
			Marble.x = sel.x;
			Marble.y = sel.y;
			Marble.c = Game.board[sel.x][sel.y];
			for(var z = mag.length-1; z >= 0; z--)
				mag[z].stopAnimation();
			var tmp = new Magnetic();
			tmp.init(((sel.x - sel.y) * (tileS.w / 2)) + 550, ((sel.x + sel.y) * (tileS.h / 2)) + 160, {r: Color_array[Marble.c][0], g: Color_array[Marble.c][1], b: Color_array[Marble.c][2], a: '0.7'});
			mag.push(tmp);
		} else if(Game.board[sel.x][sel.y] == 0 && Marble.x > -1 && Marble.y > -1 && Marble.c > 0){
			var path = AStar(Game.board, [Marble.y, Marble.x], [sel.y, sel.x]);
			
			if(path.length > 1){
				for(var x = 0; x < 9; x++){
					for(var y = 0; y < 9; y++)
						Undo.board[x][y] = Game.board[x][y];
				}
				Undo.points = Game.points;
				Undo.draw_count = Game.draw_count;
				for(var nc = 0; nc < 5; nc++)
					Undo.next_colors_array[nc] = Game.next_colors_array[nc];
				Undo.available = true;
				
				for(var z = mag.length-1; z >= 0; z--)
					mag[z].stopAnimation();
				Game.board[sel.x][sel.y] = Marble.c;
				Game.board[Marble.x][Marble.y] = 0;
				var line = checkLine(sel.x, sel.y, Marble.c);
				if(line == 0)
					drawShow(3, sel.x, sel.y, Marble.c);
				else
					checkGameOver();
				drawHideParticle(Marble.x, Marble.y, Marble.c);
				Marble.x = -1;
				Marble.y = -1;
				Marble.c = 0;
			}
		}
	}
}

function animateSelection(){
	if(mag.length > 0){
		for(var z = mag.length-1; z >= 0; z--){
			mag[z].animateParticles();
			if(mag[z].hasFinished() == true)
				mag.splice(z, 1);
		}
	}
}