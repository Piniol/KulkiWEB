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

function animateShowParticle(){
	var ctxT = animations.getContext( "2d" );
	var loop = peShow.length;

	if(loop > 0){
		for(var z = loop-1; z >= 0; z--){
			var tmp = (oneColumnAnimation == true ? 0 : peShow[z].color);
			if (Game.board[peShow[z].boardX][peShow[z].boardY] == (peShow[z].color+1)){
				ctxT.drawImage(imgShow, tmp*90, peShow[z].frame * 90, 90,90, peShow[z].x | 0, peShow[z].y | 0, animationSize, animationSize);
			
				peShow[z].frame++;

				if (peShow[z].frame == showOnFrame)
					ctx.drawImage(sprite, peShow[z].color*50, 0, 50,50, peShow[z].boardX * (tileS.w / 2) - peShow[z].boardY * (tileS.w / 2) + 425 | 0, peShow[z].boardX * (tileS.h / 2) + peShow[z].boardY * (tileS.h / 2) + 35 | 0, 50, 50);
			} else {
				peShow[z].frame = showFrames;
				ctx.clearRect(peShow[z].boardX * (tileS.w / 2) - peShow[z].boardY * (tileS.w / 2) + 425 | 0, peShow[z].boardX * (tileS.h / 2) + peShow[z].boardY * (tileS.h / 2) + 35 | 0, 50, 50);
			}
			if(peShow[z].frame == showFrames)
				peShow.splice(z, 1);
		}
	}
}

function drawShowParticle(mab){
	var tmp = new TParticles();
	tmp.x = mab.x * (tileS.w / 2) - mab.y * (tileS.w / 2) + showParticleX;
	tmp.y = mab.x * (tileS.h / 2) + mab.y * (tileS.h / 2) + showParticleY;
	tmp.color = mab.color - 1;
	tmp.frame = 0;
	tmp.boardX = mab.x;
	tmp.boardY = mab.y;
	peShow.push(tmp);
}


function animateHideParticle(){
	var ctxT = animations.getContext( "2d" );
	var loop = peHide.length;
				
	if(loop > 0){
		for(var z = loop-1; z >= 0; z--){
			ctxT.drawImage(imgHide, peHide[z].color*90, peHide[z].frame * 90, 90,90, peHide[z].x | 0, peHide[z].y | 0, animationSize, animationSize);
			peHide[z].frame++;
			
			if (peHide[z].frame == hideOnFrame) {
				ctx.clearRect(peHide[z].boardX * (tileS.w / 2) - peHide[z].boardY * (tileS.w / 2) + 425 | 0, peHide[z].boardX * (tileS.h / 2) + peHide[z].boardY * (tileS.h / 2) + 35 | 0, 50, 50);
			}

			if(peHide[z].frame == hideFrames)
				peHide.splice(z, 1);
		}
	}
}

function drawHideParticle(x, y, c){
	var tmp = new TParticles();
	var spx = 0;
	if(typeof showParticleYHide == 'undefined')
		spy = showParticleY;
	else
		spy = showParticleYHide;

	tmp.x = x * (tileS.w / 2) - y * (tileS.w / 2) + showParticleX;
	tmp.y = x * (tileS.h / 2) + y * (tileS.h / 2) + spy;
	if(oneColumnAnimation == true)
		tmp.color = 0;
	else
		tmp.color = c - 1;
	tmp.frame = 0;
	tmp.boardX = x;
	tmp.boardY = y;
	peHide.push(tmp);
}