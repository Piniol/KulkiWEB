<?php

error_reporting(0);
session_start();
session_regenerate_id();
include_once('db_con.php');
include_once('functions.php');

if($_POST['op'] == "login"){
	if(isset($_POST['lUser']) && isset($_POST['lPass'])){
		$luser = trim(strip_tags($_POST['lUser']));
		$luser = htmlentities($luser);
		
		if(get_magic_quotes_gpc())
			$luser = stripslashes($luser);
		
		if($luser == ''){
			echo 'EuserNull';
			exit;
		}
		
		$lpass = trim(strip_tags($_POST['lPass']));
		if($lpass == ''){
			echo 'EpassNull';
			exit;
		}
		
		$query = sprintf("SELECT id FROM users WHERE name = '%s' and pass = '%s'", mysql_real_escape_string($luser, $db_con), mysql_real_escape_string(md5($lpass), $db_con));
		$result = mysql_query($query) or die('Edb');
		$num_rows = mysql_num_rows($result);
		
		if($num_rows > 0){
			session_unset();
			while($row = mysql_fetch_row($result)){
				$_SESSION['id'] = $row[0];
			}	
	
			mysql_free_result($result);
			$_SESSION['logged'] = true;
			echo 'OK';
		} else {
			mysql_free_result($result);
			echo 'NOTOK';
		}
	} else {
		echo 'EnotAll';
	}
} elseif($_POST['op'] == "logout"){
	if(isset($_SESSION['logged']) && $_SESSION['logged'])
		echo 'LOGGED';
	else
		echo 'NOTLOGGED';
} elseif($_POST['op'] == "register"){
	if(isset($_POST['rUser']) && isset($_POST['rPass']) && isset($_POST['rPass2'])){
		if(strlen($_POST['rUser']) > 20){
			echo 'EuserLong';
			exit;
		}
		
		$ruser = trim(strip_tags($_POST['rUser']));
		$ruser = htmlentities($ruser);
		if($ruser == ''){
			echo 'EuserNull';
			exit;
		}
		
		$rpass = trim(strip_tags($_POST['rPass']));
		$rpass2 = trim(strip_tags($_POST['rPass2']));
		if($rpass == ''){
			echo 'EpassNull';
			exit;
		}
		if($rpass2 == ''){
			echo 'Epass2Null';
			exit;
		}
		
		if(md5($rpass) != md5($rpass2)){
			echo 'EpassDiff';
			exit;
		}
		
		if(get_magic_quotes_gpc())
			$ruser = stripslashes($ruser);
			
		$query = sprintf("SELECT * FROM users WHERE name = '%s'", mysql_real_escape_string($ruser, $db_con));
		$result = mysql_query($query) or die('Edb');
		$num_rows = mysql_num_rows($result);
		
		if($num_rows > 0 || strtolower($ruser) == 'anonymous' || $ruser == '-----'){
			echo 'EuserExist';
			mysql_free_result($result);
			exit;
		} else {
			$query = sprintf("INSERT INTO users(name, pass) VALUES ('%s', '%s')", mysql_real_escape_string($ruser, $db_con), mysql_real_escape_string(md5($rpass), $db_con));
			mysql_query($query) or die("Edb");
			echo 'OK';
		}
	} else {
		echo 'EnotAll';
	}
} elseif($_POST['op'] == 'highscores'){
	header('Content-Type: application/json');
	$ret = array();
	foreach(range(5, 9, 2) as $l){
		$query = "SELECT IFNULL(u.name, 'anonymous'), points, u.id
					FROM
						top_scores ts
						LEFT JOIN users u ON u.id = ts.user_id
					WHERE
						colors = %d
					ORDER BY points DESC
					LIMIT 0, 5";
				
		$result = mysql_query(sprintf($query, $l)) or die('Edb');
		$num_rows = mysql_num_rows($result);

		if($num_rows > 0){
			while($row = mysql_fetch_row($result)){
				$ret['col'.$l][] = array('user' => $row[0], 'points' => number_format($row[1], 0, ',', ' '));
			}
		}
		if($num_rows < 5){
			for($t = $num_rows; $t < 5; $t++)
				$ret['col'.$l][] = array('user' => '-----', 'points' => '0');
		}
	}

	echo json_encode($ret);
} elseif($_POST['op'] == 'saveList'){
	if(isset($_SESSION['logged']) && $_SESSION['logged']){
		header('Content-Type: application/json');
		$query = "SELECT id, timestamp
					FROM save_game
					WHERE user_id = ".$_SESSION['id']."
					ORDER BY timestamp";
		
		$result = mysql_query($query) or die('Edb');
		$num_rows = mysql_num_rows($result);
		$ret = array();
		if($num_rows > 0){
			while($row = mysql_fetch_row($result)){
				$ret[] = array('id' => $row[0], 'timestamp' => $row[1]);
			}
			echo json_encode($ret);
		} else
			echo 'NOSLOTS';
			
		mysql_free_result($result);
	} else
		echo 'NOTLOGGED';
} elseif($_POST['op'] == 'saveGame'){
	if(isset($_SESSION['logged']) && $_SESSION['logged']){
		$saveId = intval($_POST['save_id']);
		$number_of_colors = intval($_POST['number_of_colors']);
		$show_next_colors = ($_POST['show_next_colors'] == 'true' ? 1 : 0);
		$animate_movement = ($_POST['animate_movement'] == 'true' ? 1 : 0);
		$play_sound = ($_POST['play_sound'] == 'true' ? 1 : 0);
		$language = intval($_POST['language']);
		$board = trim(strip_tags($_POST['board']));
		$next_colors = trim(strip_tags($_POST['next_colors']));
		$theme = trim(strip_tags($_POST['theme']));
		if(get_magic_quotes_gpc()){
			$board = stripslashes($board);
			$next_colors = stripslashes($next_colors);
		}
		$points = intval($_POST['points']);
	
		if($saveId == 0){
			$query = sprintf("
				INSERT INTO save_game(user_id, play_sound, show_next, colors, language_id, plansza, punkty, nastepne_kolory, animate_move, theme)
				VALUES (%d, $play_sound, $show_next_colors, $number_of_colors, $language, '%s', $points, '%s', $animate_movement, '%s')",
				mysql_real_escape_string($_SESSION['id'], $db_con),
				mysql_real_escape_string($board, $db_con),
				mysql_real_escape_string($next_colors, $db_con),
				mysql_real_escape_string($theme, $db_con)
			);
		} else {
			$query = sprintf("
				UPDATE save_game
				SET play_sound = $play_sound, show_next = $show_next_colors, colors = $number_of_colors, language_id = $language, plansza = '%s', punkty = $points, nastepne_kolory = '%s', timestamp = CURRENT_TIMESTAMP, animate_move = $animate_movement, theme = '%s'
				WHERE id = %d",
				mysql_real_escape_string($board, $db_con),
				mysql_real_escape_string($next_colors, $db_con),
				mysql_real_escape_string($saveId, $db_con),
				mysql_real_escape_string($theme, $db_con)
			);
		}
		mysql_query($query) or die('Edb');
	}
} elseif($_POST['op'] == 'loadGame'){
	if(isset($_SESSION['logged']) && $_SESSION['logged']){
		header('Content-Type: application/json');
		$return = array();
		$query = "SELECT play_sound, show_next, animate_move, colors, language_id, plansza, nastepne_kolory, punkty, theme
					FROM save_game sg
					WHERE user_id = ".$_SESSION['id']." AND sg.id = ".intval($_POST['load_id']);
		
		$result = mysql_query($query) or die('Edb');
		$num_rows = mysql_num_rows($result);
		if($num_rows > 0){
			while($row = mysql_fetch_row($result)){
				$return['play_sound'] = $row[0];
				$return['show_next_colors'] = $row[1];
				$return['animate_movement'] = $row[2];
				$return['number_of_colors'] = $row[3];
				$return['language'] = $row[4];
				$return['board'] = $row[5];
				$return['next_colors'] = $row[6];
				$return['points'] = $row[7];
				$return['theme'] = $row[8];
			}

			echo json_encode($return);
		} else
			echo 'NOGAMESLOT';
			
		mysql_free_result($result);
	} else
		echo 'NOTLOGGED';
} elseif($_POST['op'] == 'checkHighscore'){
	$new_p = intval($_POST['points']);
	
	if($new_p > 0){
		$query = "
			SELECT points
			FROM top_scores
			WHERE colors = ".intval($_POST['number_of_colors'])."
			ORDER BY points DESC
			LIMIT 0, 5";
		$new_p = intval($_POST['points']);
		if(isset($_SESSION['id']))
			$user_id = intval($_SESSION['id']);
		else
			$user_id = 'NULL';
		
		$result = mysql_query($query) or die('Edb');
		$num_rows = mysql_num_rows($result);
		$is_new = false;
		while($row = mysql_fetch_row($result)){
			if(intval($row[0]) < $new_p)
				$is_new = true;
		}
		mysql_free_result($result);
		
		if($is_new == true || $num_rows < 5){
			$query2 = "
				INSERT INTO top_scores(user_id, colors, points)
				VALUES($user_id, ".intval($_POST['number_of_colors']).", $new_p)";
			mysql_query($query2) or die('Edb');
			echo 'newHigh';
		}
	}
} elseif($_POST['op'] == "loadOptions"){
	header('Content-Type: application/json');
	$ret = array('play_sound' => 1, 'show_next_colors' => 1 , 'number_of_colors' => 5, 'language' => geoIP(), 'animate_movement' => 1, 'theme' => 'cosmic');
	
	if(isset($_SESSION['logged']) && $_SESSION['logged']){
		$query = "SELECT play_sound, show_next, colors, l.name, animate_move, theme
					FROM user_defaults ud JOIN languages l on l.id = ud.language_id
					WHERE user_id = ".$_SESSION['id'];
		
		$result = mysql_query($query) or die('Edb');
		$num_rows = mysql_num_rows($result);
		if($num_rows > 0){
			while($row = mysql_fetch_row($result)){
				$ret = array('play_sound' => $row[0], 'show_next_colors' => $row[1] , 'number_of_colors' => $row[2], 'language' => $row[3], 'animate_movement' => $row[4], 'theme' => $row[5]);
			}
		}				
		mysql_free_result($result);
	}
	echo json_encode($ret);
} elseif($_POST['op'] == "saveOptions"){
	if(isset($_SESSION['logged']) && $_SESSION['logged']){
		$number_of_colors = intval($_POST['number_of_colors']);
		$show_next_colors = ($_POST['show_next_colors'] == 'true' ? 1 : 0);
		$animate_movement = ($_POST['animate_movement'] == 'true' ? 1 : 0);
		$play_sound = ($_POST['play_sound'] == 'true' ? 1 : 0);
		$language = intval($_POST['language']);
		$theme =  trim(strip_tags($_POST['theme']));
		
		$query = sprintf("SELECT id FROM user_defaults WHERE user_id = %d", mysql_real_escape_string($_SESSION['id'], $db_con));
		$result = mysql_query($query) or die('Edb');
		$num_rows = mysql_num_rows($result);

		if($num_rows <= 0){
			$query = sprintf("
				INSERT INTO user_defaults(user_id, play_sound, show_next, colors, language_id, animate_move, theme)
				VALUES (%d, $play_sound, $show_next_colors, $number_of_colors, $language, $animate_movement, '%s')",
				mysql_real_escape_string($_SESSION['id'], $db_con),
				mysql_real_escape_string($theme, $db_con)
			);
		} else {
			$query = sprintf("
				UPDATE user_defaults
				SET play_sound = $play_sound, show_next = $show_next_colors, colors = $number_of_colors, language_id = $language, animate_move = $animate_movement, theme = '%s'
				WHERE user_id = %d",
				mysql_real_escape_string($_SESSION['id'], $db_con),
				mysql_real_escape_string($theme, $db_con)
			);
		}

		$result = mysql_query($query) or die("Edb");
	}
} elseif($_POST['op'] == 'setSession'){
	$_SESSION['Grapunkty'] = $_POST['game_points'];
	$_SESSION['Graile_kolorow'] = $_POST['game_number_of_colors'];
	$_SESSION['Graile_losuj'] = $_POST['game_draw'];
	$_SESSION['Grapokazuj_nastepne_kolory'] = setBool($_POST['game_show_next_colors']);
	$_SESSION['Graanimuj_ruch'] = setBool($_POST['game_animate_move']);
	$_SESSION['Gradzwiek'] = setBool($_POST['game_play_sound']);
	$_SESSION['Graaktywna'] = setBool($_POST['game_is_active']);
	$_SESSION['Grajezyk'] = $_POST['game_language'];
	$_SESSION['Granastepne_kolory'] = $_POST['game_next_colors'];
	$_SESSION['Graplansza'] = $_POST['game_board'];
	$_SESSION['Undopunkty'] = $_POST['undo_points'];
	$_SESSION['Undonastepne_kolory'] = $_POST['undo_next_colors'];
	$_SESSION['Undoczy_cofac'] = setBool($_POST['undo_available']);
	$_SESSION['Undoplansza'] = $_POST['undo_board'];
	$_SESSION['Gramotyw'] = $_POST['theme'];
} elseif($_POST['op'] == 'getSession'){
	header('Content-Type: application/json');
	if(isset($_SESSION['Grapunkty']) && !is_null($_SESSION['Grapunkty'])){
		$ret['game_points'] = $_SESSION['Grapunkty'];
		$ret['game_number_of_colors'] = $_SESSION['Graile_kolorow'];
		$ret['game_draw'] = $_SESSION['Graile_losuj'];
		$ret['game_show_next_colors'] = setBool($_SESSION['Grapokazuj_nastepne_kolory']);
		$ret['game_animate_move'] = setBool($_SESSION['Graanimuj_ruch']);
		$ret['game_play_sound'] = setBool($_SESSION['Gradzwiek']);
		$ret['game_is_active'] = setBool($_SESSION['Graaktywna']);
		$ret['game_language'] = $_SESSION['Grajezyk'];
		$ret['game_next_colors'] = $_SESSION['Granastepne_kolory'];
		$ret['game_board'] = $_SESSION['Graplansza'];
		$ret['undo_points'] = $_SESSION['Undopunkty'];
		$ret['undo_next_colors'] = $_SESSION['Undonastepne_kolory'];
		$ret['undo_available'] = setBool($_SESSION['Undoczy_cofac']);
		$ret['undo_board'] = $_SESSION['Undoplansza'];
		$ret['game_theme'] = $_SESSION['Gramotyw'];
		echo json_encode($ret);
	}
} elseif($_POST['op'] == 'changeLanguage'){
	header('Content-Type: application/json');
	$tmp = intval($_POST['language']);
	$language = ($tmp <= 0 ? 1 : $tmp);
	$ret = array();
	
	$query = "
			SELECT t.caption_type, t.caption_id, tc.caption
			FROM
				translations t
				JOIN translations_caption tc ON tc.translations_id = t.id
			WHERE language_id = $language";

	$result = mysql_query($query) or die('Edb');
	while($row = mysql_fetch_row($result)){
		$ret[$row[0]][$row[1]] = $row[2];
	}
	mysql_free_result($result);
		
	echo json_encode($ret);
}

?>