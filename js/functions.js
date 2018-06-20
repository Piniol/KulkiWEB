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

function randomXToY(min, max_v){
	var range = max_v - min + 1;
	return Math.floor(Math.random() * range + min);
}

function rgbToHex(r, g, b) {
	return ((r << 16) | (g << 8) | b).toString(16);
}

function AStar(Grid, Start, Goal){
	function $Grid(x, y){
		return Grid[y][x] === 0;
	};
	
	function Node(Parent, Point){
		return {Parent:Parent,value:Point.x + (Point.y * cols),x:Point.x,y:Point.y,f:0,g:0};
	};
	
	function Path(){
		var $Start = Node(null, {x:Start[0], y:Start[1]}), $Goal = Node(null, {x:Goal[0], y:Goal[1]}), AStar = new Array(limit), Open = [$Start], Closed = [], result = [], $Successors, $Node, $Path, length, max, min, i, j;
		
		while(length = Open.length){
			max = limit; min = -1;
			
			for(i = 0; i < length; i++){
				if(Open[i].f < max){
					max = Open[i].f;
					min = i;
				}
			}
			
			$Node = Open.splice(min, 1)[0];
			
			if($Node.value === $Goal.value){
				$Path = Closed[Closed.push($Node) - 1];
				
				do{
					result.push([$Path.x, $Path.y]);
				} while($Path = $Path.Parent);
				
				AStar = Closed = Open = []; result.reverse();
			} else {
				$Successors = Successors($Node.x, $Node.y);
				
				for(i = 0, j = $Successors.length; i < j; i++){
					$Path = Node($Node, $Successors[i]);
					
					if(!AStar[$Path.value]){
						$Path.g = $Node.g + (Math.abs($Successors[i].x - $Node.x) + Math.abs($Successors[i].y - $Node.y));
						$Path.f = $Path.g + (Math.abs($Successors[i].x - $Goal.x) + Math.abs($Successors[i].y - $Goal.y));
						Open.push($Path); AStar[$Path.value] = true;
					}
				}
				Closed.push($Node);
			}
		}
		
		return result;
	}
	
	function Successors(x, y){
		var N = y - 1, S = y + 1, E = x + 1, W = x - 1, result = [];
		
		if(N > -1 && $Grid(x, N))
			result.push({x:x, y:N});
		if(E < cols && $Grid(E, y))
			result.push({x:E, y:y});
		if(S < rows && $Grid(x, S))
			result.push({x:x, y:S});
		if(W > -1 && $Grid(W, y))
			result.push({x:W, y:y});
		
		return result;
	};
	
	var cols = Grid[0].length, rows = Grid.length, limit = cols * rows;
	return Path();
}

function number_format(number, decimals, dec_point, thousands_sep){
	number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
	var n = !isFinite(+number) ? 0 : +number,
	prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
	sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
	dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
	s = '',
	toFixedFix = function(n, prec) {
		var k = Math.pow(10, prec);
		return '' + (Math.round(n * k) / k).toFixed(prec);
	};
	s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
	if(s[0].length > 3){
		s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
	}
	if((s[1] || '').length < prec){
		s[1] = s[1] || '';
		s[1] += new Array(prec - s[1].length + 1).join('0');
	}
	return s.join(dec);
}