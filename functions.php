<?php

function geoIP(){
	global $db_con;
	$geo_ip = 2;
	
	if(isset($_SERVER['HTTP_X_FORWARDED_FOR']))
		$ip_address = $_SERVER['HTTP_X_FORWARDED_FOR'];
	else
		$ip_address = $_SERVER['REMOTE_ADDR'];
		
	if($ip_address == '127.0.0.1')
		$geo_ip = 1;
	else {
		$result = mysql_query("SELECT id FROM ip_pl WHERE ".ip2long($ip_address)." BETWEEN ip_start AND ip_end");
		while($row = mysql_fetch_row($result)){
			$geo_ip = $row[0];
		}
		mysql_free_result($result);
		
		$result = mysql_query("SELECT id FROM languages WHERE id = $geo_ip");
		$num_rows = mysql_num_rows($result);
		if($num_rows == 0)
			$geo_ip = 2;
		mysql_free_result($result);
	}
	
	return $geo_ip;
}

function languagesList(){
	global $db_con;
	$ret = '';
	
	$result = mysql_query("SELECT id, name FROM languages ORDER BY name");
	while($row = mysql_fetch_row($result)){
		$ret .= '<option value="'.$row[0].'">'.$row[1].'</option>';
	}
	mysql_free_result($result);
	
	return $ret;
}

function setBool($v){
	if(is_string($v) && ($v === "true" || $v === "false"))
		return ($v == "true" ? true : false);
	else
		return (bool)$v;
}

function getThemes(){
	$ret = '';
	$result = mysql_query("SELECT lower(name), name FROM themes ORDER BY name");
	while($row = mysql_fetch_row($result))
		$ret .= '<option value="'.$row[0].'">'.$row[1].'</option>';
	mysql_free_result($result);
	return $ret;
}

function getUserTheme(){
	$ret = 'cosmic';
	
	if(isset($_SESSION['logged']) && $_SESSION['logged']){
		$query = "SELECT theme FROM user_defaults WHERE user_id = ".$_SESSION['id'];
		$result = mysql_query($query) or die('Edb');
		$num_rows = mysql_num_rows($result);
		if($num_rows > 0){
			while($row = mysql_fetch_row($result))
				$ret = $row[0];
		}				
		mysql_free_result($result);
	}
	
	if(isset($_SESSION['Gramotyw']) && trim($_SESSION['Gramotyw']) != '')
		$ret = $_SESSION['Gramotyw'];
	
	return $ret;
}

?>