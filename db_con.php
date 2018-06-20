<?php

$db_con = mysql_connect('DB_HOST', 'DB_USER', 'DB_PASS');
if (!$db_con) die('Edb');
mysql_select_db('DB_SCHEMA', $db_con);
mysql_query("SET NAMES utf8", $db_con) or die('Edb');
mysql_query("SET CHARACTER SET utf8", $db_con) or die('Edb');
mysql_query("SET collation_connection = utf8_polish_ci", $db_con) or die('Edb');

?>
