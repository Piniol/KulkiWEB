<?php

error_reporting(0);
$kulki_web = 'KulkiWEB 2.0';

session_start();
session_regenerate_id();

include_once('db_con.php');
include_once('functions.php');

if(isset($_POST['logout']) && $_POST['logout'] == 1){
	session_unset();
}

$theme = getUserTheme();

?>
<!DOCTYPE html>
<html lang="pl">
	<head>
		<link rel="shortcut icon" href="graphics/favicon.ico" />
		<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
		<meta name="keywords" content="Kulki, KulkiEx, KulkiWEB, Piniol, Wiecheć" />
		<title>KulkiWEB</title>
		<link href="css/style.css" rel="stylesheet" type="text/css" />
		<link href="themes/<?php echo $theme; ?>/<?php echo $theme; ?>.css" rel="stylesheet" type="text/css" />
		<script type="text/javascript" src="themes/<?php echo $theme; ?>/<?php echo $theme; ?>.js"></script>
		<script type="text/javascript" src="js/variables.js"></script>
		<script type="text/javascript" src="js/functions.js"></script>
		<script type="text/javascript" src="js/selection.js"></script>
		<script type="text/javascript" src="js/game.js"></script>
		<script type="text/javascript" src="js/particle.js"></script>
		<script type="text/javascript" src="js/ajax.js"></script>
	</head>
	<body onload="initBoard();">
		<script type="text/javascript">
			Game.theme = '<?php echo $theme; ?>';
			oldTheme = '<?php echo $theme; ?>';
		</script>
		<div class="divBackground"></div>
		<div class="menu-wrapper">
			<div id="menu" class="menu">
				<div id="newGameCaption" class="menuItem" onclick="newGame();">Nowa gra</div>
				<?php
				if(isset($_SESSION['logged']) && $_SESSION['logged']){
				?>
				<div id="openCaption" class="menuItem" onclick="showWindowConditional('loadWindow');">Otwórz</div>
				<div id="saveCaption" class="menuItem" onclick="showWindowConditional('saveWindow');">Zapisz</div>
				<?php
				}
				?>
				<div id="undoCaption" class="menuItem" onclick="undoMove();">Cofnij</div>
				<div id="optionsCaption" class="menuItem" onclick="showOptions();">Ustawienia</div>
				<div id="scoresCaption" class="menuItem" onclick="highscores();">Wyniki</div>
				<div id="aboutCaption" class="menuItem" onclick="showWindow('aboutWindow');">O...</div>
				<?php
				if(isset($_SESSION['logged']) && $_SESSION['logged']){
				?>
				<div id="logoutCaption" class="menuItem" onclick="showWindow('logoutWindow');">Wyloguj</div>
				<?php
				} else {
				?>
				<div id="loginCaption" class="menuItem" onclick="showWindow('loginWindow');">Zaloguj</div>
				<div id="registerCaption" class="menuItem" onclick="showWindow('registerWindow');">Zarejestruj się</div>
				<?php
				}
				?>
			</div>
		</div>
	
		<canvas id="board" width="900" height="558" class="canvas1" style="z-index: 1;"></canvas>
		<canvas id="actualTile" width="900" height="558" class="canvas1" style="z-index: 2;"></canvas>
		<canvas id="balls" width="900" height="558" class="canvas1" style="z-index: 3;"></canvas>
		<canvas id="animations" width="1100" height="758" class="canvas2" style="z-index: 4;"></canvas>
		<canvas id="curPos" width="900" height="558" class="canvas1" style="z-index: 5;"></canvas>
		
		<div id="backWindow" class="back"></div>
		<div id="backAlertWindow" class="backAlert"></div>
		
		<div id="optionsWindow" class="messageWindow">
			<table class="tableWindow">
				<tr>
					<td id="nextColorsCaption2" class="textRight" style="width: 50%;"></td>
					<td class="textLeft"><input type="checkbox" name="nextColors" id="nextColors" /></td>
				</tr>
				<tr>
					<td id="colorsNumberCaption" class="textRight"></td>
					<td class="textLeft">
						<select name="numberColors" id="numberColors">
							<option value="5">5</option>
							<option value="7">7</option>
							<option value="9">9</option>
						</select>
					</td>
				</tr>
				<tr>
					<td id="languageCaption" class="textRight"></td>
					<td class="textLeft">
						<select name="language" id="language">
							<?php
							echo languagesList();
							?>
						</select>
					</td>
				</tr>
				<tr>
					<td id="themeCaption" class="textRight"></td>
					<td class="textLeft">
						<select name="theme" id="theme">
							<?php
							echo getThemes();
							?>
						</select>
					</td>
				</tr>
				<tr>
					<td class="textRight"><span class="button" onclick="saveOptions();" data-okButton="1">Ok</span></td>
					<td class="textLeft"><span class="button" onclick="hideWindow('optionsWindow');" data-cancelButton="1">Anuluj</span></td>
				</tr>
			</table>
		</div>
		
		<div id="newGameWindow" class="messageWindow">
			<table class="tableWindow">
				<tr>
					<td id="newGameMessageCaption" class="textCenter" colspan="2">Czy chcesz przerwać aktualną grę?</td>
				</tr>
				<tr>
					<td class="textRight"><span class="button" onclick="resetGame();" data-okButton="1">Ok</span></td>
					<td class="textLeft"><span class="button" onclick="hideWindow('newGameWindow');" data-cancelButton="1">Anuluj</span></td>
				</tr>
			</table>
		</div>
		
		<div id="registerWindow" class="messageWindow">
			<table class="tableWindow">
				<tr>
					<td id="registerLoginCaption" class="textCenter" style="width: 50%;">Login</td>
					<td style="width: 50%;"><input id="registerLogin" name="registerLogin" type="text" onkeyup="registerSubmit(event);"></td>
				</tr>
				<tr>
					<td id="registerPasswordCaption" class="textCenter">Hasło</td>
					<td><input id="registerPassword" name="registerPassword" type="password" onkeyup="registerSubmit(event);"></td>
				</tr>
				<tr>
					<td id="registerRePasswordCaption" class="textCenter">Powtórz hasło</td>
					<td><input id="registerRePassword" name="registerRePassword" type="password" onkeyup="registerSubmit(event);"></td>
				</tr>
				<tr>
					<td class="textRight"><span class="button" onclick="register();" data-okButton="1">Ok</span></td>
					<td class="textLeft"><span class="button" onclick="hideWindow('registerWindow');" data-cancelButton="1">Anuluj</span></td>
				</tr>
			</table>
		</div>
		
		<div id="loginWindow" class="messageWindow">
			<form id="loginForm" method="POST">
				<table class="tableWindow">
					<tr>
						<td id="loginLoginCaption" class="textCenter" style="width: 50%;">Login</td>
						<td style="width: 50%;"><input id="loginLogin" name="loginLogin" type="text" onkeyup="loginSubmit(event);"></td>
					</tr>
					<tr>
						<td id="loginPasswordCaption" class="textCenter">Hasło</td>
						<td><input id="loginPassword" name="loginPassword" type="password" onkeyup="loginSubmit(event);"></td>
					</tr>
					<tr>
						<td class="textRight"><span class="button" onclick="login();" data-okButton="1">Ok</span></td>
						<td class="textLeft"><span class="button" onclick="hideWindow('loginWindow');" data-cancelButton="1">Anuluj</span></td>
					</tr>
				</table>
			</form>
		</div>
		
		<div id="logoutWindow" class="messageWindow">
			<form id="logoutForm" method="POST">
				<input type="hidden" name="logout" value="1">
				<table class="tableWindow">
					<tr>
						<td colspan="2" id="logoutWindowCaption" class="textCenter">Czy chcesz się wylogować?</td>
					</tr>
					<tr>
						<td class="textRight"><span class="button" onclick="logout();" data-okButton="1">Ok</span></td>
						<td class="textLeft"><span class="button" onclick="hideWindow('logoutWindow');" data-cancelButton="1">Anuluj</span></td>
					</tr>
				</table>
			</form>
		</div>
		
		<div id="aboutWindow" class="messageWindow">
			<table class="tableWindow">
				<tr>
					<td class="aboutGame"><?php echo $kulki_web; ?></td>
				</tr>
				<tr>
					<td class="textCenter" id="gamerRulesCaption">Podczas gry przesuwa się kulki na planszy w taki sposób aby tworzyły linie. Jeżeli linia ma co najmniej pięć kulek to jest usuwana z planszy. W przypadku wykonania ruchu, który nie jest zakończony zbiciem, dodawane są w losowych miejscach i o losowych kolorach dodatkowe kulki. Należy dbać o to, aby w jak największej ilości posunięć tworzyć linie. Za każdą zbitą kulkę otrzymuje się odpowiednią ilość punktów. Gra kończy się gdy nie można wykonać ruchu.</td>
				</tr>
				<tr>
					<td class="textCenter" id="aboutGameCaption">Program udostępniony jako Freeware. Autor nie bierze odpowiedzialności za ewentualne szkody powstałe w skutek jego działania.</td>
				</tr>
				<tr>
					<td class="textCenter"><span id="magneticClassCaption">Oryginalny kod klasy Magnetic: </span><a href="http://hakim.se/" target="_blank">Hakim El Hattab</a></td>
				</tr>
				<tr>
					<td class="textCenter">Copyright (c) 2014, <a href="mailto:wiechec.przemyslaw@gmail.com">Przemysław Wiecheć</a></td>
				</tr>
				<tr>
					<td class="textCenter"><span class="button" onclick="hideWindow('aboutWindow');" data-closeButton="1">Ok</span></td>
				</tr>
			</table>
		</div>
		
		<div id="highscoresWindow" class="messageWindow" style="width: 760px;">
			<table class="tableWindowScore">
				<tr>
					<td colspan="2" class="textCenter" style="background: #FCF590;">9</td>
					<td colspan="2" class="textCenter" style="background: #E3E3E3;">7</td>
					<td colspan="2" class="textCenter" style="background: #C9BC9D;">5</td>
				</tr>
				<tr>
					<td class="textLeftScore" id="user91"></td>
					<td class="textRightScore" id="score91"></td>
					<td class="textLeftScore" id="user71"></td>
					<td class="textRightScore" id="score71"></td>
					<td class="textLeftScore" id="user51"></td>
					<td class="textRightScore" id="score51"></td>
				</tr>
				<tr>
					<td class="textLeftScore" id="user92"></td>
					<td class="textRightScore" id="score92"></td>
					<td class="textLeftScore" id="user72"></td>
					<td class="textRightScore" id="score72"></td>
					<td class="textLeftScore" id="user52"></td>
					<td class="textRightScore" id="score52"></td>
				</tr>
				<tr>
					<td class="textLeftScore" id="user93"></td>
					<td class="textRightScore" id="score93"></td>
					<td class="textLeftScore" id="user73"></td>
					<td class="textRightScore" id="score73"></td>
					<td class="textLeftScore" id="user53"></td>
					<td class="textRightScore" id="score53"></td>
				</tr>
				<tr>
					<td class="textLeftScore" id="user94"></td>
					<td class="textRightScore" id="score94"></td>
					<td class="textLeftScore" id="user74"></td>
					<td class="textRightScore" id="score74"></td>
					<td class="textLeftScore" id="user54"></td>
					<td class="textRightScore" id="score54"></td>
				</tr>
				<tr>
					<td class="textLeftScore" id="user95"></td>
					<td class="textRightScore" id="score95"></td>
					<td class="textLeftScore" id="user75"></td>
					<td class="textRightScore" id="score75"></td>
					<td class="textLeftScore" id="user55"></td>
					<td class="textRightScore" id="score55"></td>
				</tr>
				<tr>
					<td colspan="6" class="textCenter"><span class="button" onclick="hideWindow('highscoresWindow');" data-closeButton="1">Ok</span></td>
				</tr>
			</table>
		</div>
		
<?php
if(isset($_SESSION['logged']) && $_SESSION['logged']){
?>
		<div id="saveWindow" class="messageWindow">
			<table class="tableWindow">
<?php
for($s = 0; $s < 10; $s++){
	echo '
				<tr>
					<td class="textCenter slot" id="Slot'.$s.'">--- SLOT ---</td>
				</tr>';
}
?>
				<tr>
					<td class="textCenter"><span class="button" onclick="hideWindow('saveWindow');" data-cancelButton="1">Anuluj</span></td>
				</tr>
			</table>
		</div>

		<div id="overwriteWindow" class="alertWindow">
				<input type="hidden" name="saveOverwriteFlag" id="saveOverwriteFlag" value="0">
				<table class="tableWindow">
					<tr>
						<td colspan="2" id="overwriteCaption" class="textCenter">Czy nadpisać zapisaną grę?</td>
					</tr>
					<tr>
						<td class="textRight"><span class="button" onclick="confirmOverwrite();" data-okButton="1">Ok</span></td>
						<td class="textLeft"><span class="button" onclick="hideWindow2('overwriteWindow');" data-cancelButton="1">Anuluj</span></td>
					</tr>
				</table>
		</div>
	
		<div id="loadWindow" class="messageWindow">
			<table class="tableWindow">
<?php
for($s = 0; $s < 10; $s++){
	echo '
				<tr>
					<td class="textCenter slot" id="LoadSlot'.$s.'">--- SLOT ---</td>
				</tr>';
}
?>
				<tr>
					<td class="textCenter"><span class="button" onclick="hideWindow('loadWindow');" data-cancelButton="1">Anuluj</span></td>
				</tr>
			</table>
		</div>
		
		<div id="breakLoadWindow" class="alertWindow">
			<input type="hidden" name="loadBreakFlag" id="loadBreakFlag" value="0">
				<table class="tableWindow">
					<tr>
						<td colspan="2" id="breakCaption" class="textCenter">Czy przerwać aktualną grę?</td>
					</tr>
					<tr>
						<td class="textRight"><span class="button" onclick="confirmBreak();" data-okButton="1">Ok</span></td>
						<td class="textLeft"><span class="button" onclick="hideWindow2('breakLoadWindow');" data-cancelButton="1">Anuluj</span></td>
					</tr>
				</table>
		</div>
<?php } ?>
		
		<div id="alertWindow" class="alertWindow">
			<table class="tableWindow">
				<tr>
					<td id="alertText" class="textCenter"></td>
				</tr>
				<tr>
					<td class="textCenter"><span class="button" onclick="hideAlert();" data-closeButton="1">Ok</span></td>
				</tr>
			</table>
		</div>
		
		<div class="messageWindow" id="newHighscoreWindow">
			<table class="tableWindow">
				<tr>
					<td id="newHighscoreCaption" class="aboutGame">Gratulacje! Nowy rekord!</td>
				</tr>
				<tr>
					<td class="textCenter"><span class="button" onclick="hideWindow2('newHighscoreWindow');" data-closeButton="1">Ok</span></td>
				</tr>
			</table>
		</div>
		
		<div class="messageWindow" id="endGameWindow">
			<table class="tableWindow">
				<tr>
					<td colspan="2" id="endGameCaption" class="textCenter">Koniec gry. Chcesz zagrać jeszcze raz?</td>
				</tr>
				<tr>
					<td class="textRight"><span class="button" onclick="hideWindow('endGameWindow'); newGame();" data-okButton="1">Ok</span></td>
					<td class="textLeft"><span class="button" onclick="hideWindow('endGameWindow');" data-cancelButton="1">Anuluj</span></td>
				</tr>
			</table>
		</div>
		
		<div class="messageWindow" style="display: block; text-align: center;" id="gameLoadingWindow">
			<img src="graphics/loader.gif" border="0" />
		</div>
		
		<div class="footer-wrapper">
			<div class="footer">
				<div>
					<div style="float: right; padding: 0px 10px;">
						<div class="nextColor"><img class="nextColorImg" id="nextColor1" src="graphics/none.png" alt="" /></div>
						<div class="nextColor"><img class="nextColorImg" id="nextColor2" src="graphics/none.png" alt="" /></div>
						<div class="nextColor"><img class="nextColorImg" id="nextColor3" src="graphics/none.png" alt="" /></div>
					</div>
					<div class="score" id="score">0</div>
				</div>
			</div>
		</div>
  </body>
</html>