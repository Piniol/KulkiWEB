CREATE TABLE IF NOT EXISTS `translations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `caption_type` varchar(10) NOT NULL,
	`caption_id` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `translations_caption` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
	`translations_id` int(11) NOT NULL,
  `language_id` int(11) NOT NULL,
	`caption` text,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8;

INSERT INTO `translations` VALUES (1,'caption','newGameCaption'),(2,'caption','openCaption'),(3,'caption','saveCaption'),(4,'caption','undoCaption'),(5,'caption','optionsCaption'),(6,'caption','scoresCaption'),(7,'caption','aboutCaption'),(8,'caption','logoutCaption'),(9,'caption','loginCaption'),(10,'caption','registerCaption'),(11,'caption','nextColorsCaption2'),(12,'caption','colorsNumberCaption'),(13,'caption','languageCaption'),(14,'caption','newGameMessageCaption'),(15,'caption','registerLoginCaption'),(16,'caption','registerPasswordCaption'),(17,'caption','registerRePasswordCaption'),(18,'caption','loginLoginCaption'),(19,'caption','loginPasswordCaption'),(20,'caption','logoutWindowCaption'),(21,'caption','gamerRulesCaption'),(22,'caption','aboutGameCaption'),(23,'caption','magneticClassCaption'),(24,'caption','overwriteCaption'),(25,'caption','breakCaption'),(26,'caption','newHighscoreCaption'),(27,'caption','endGameCaption'),(28,'alert','EuserNull'),(29,'alert','EpassNull'),(30,'alert','EnotAll'),(31,'alert','NOTOK'),(32,'alert','Edb'),(33,'alert','EuserLong'),(34,'alert','Epass2Null'),(35,'alert','EpassDiff'),(36,'alert','EuserExist'),(37,'alert','NOTLOGGED'),(38,'alert','NOGAMESLOT'),(39,'data','okButton'),(40,'data','cancelButton'),(41,'data','closeButton');

INSERT INTO `translations_caption` VALUES (1,1,1,'Nowa gra'),(2,2,1,'Wczytaj grę'),(3,3,1,'Zapisz grę'),(4,4,1,'Cofnij'),(5,5,1,'Ustawienia'),(6,6,1,'Wyniki'),(7,7,1,'O...'),(8,8,1,'Wyloguj'),(9,9,1,'Zaloguj'),(10,10,1,'Zarejestruj się'),(11,11,1,'Pokazuj następne kolory'),(12,12,1,'Ilość kolorów'),(13,13,1,'Język'),(14,14,1,'Czy chcesz przerwać aktualną grę?'),(15,15,1,'Użytkownik'),(16,16,1,'Hasło'),(17,17,1,'Powtórz hasło'),(18,18,1,'Użytkownik'),(19,19,1,'Hasło'),(20,20,1,'Czy chcesz się wylogować?'),(21,21,1,'Podczas gry przesuwa się kulki na planszy w taki sposób aby tworzyły linie. Jeżeli linia ma co najmniej pięć kulek to jest usuwana z planszy. W przypadku wykonania ruchu, który nie jest zakończony zbiciem, dodawane są w losowych miejscach i o losowych kolorach dodatkowe kulki. Należy dbać o to, aby w jak największej ilości posunięć tworzyć linie. Za każdą zbitą kulkę otrzymuje się odpowiednią ilość punktów. Gra kończy się gdy nie można wykonać ruchu.'),(22,22,1,'Program udostępniony jako Freeware. Autor nie bierze odpowiedzialności za ewentualne szkody powstałe w skutek jego działania.'),(23,23,1,'Oryginalny kod klasy Magnetic: '),(24,24,1,'Czy nadpisać zapisaną grę?'),(25,25,1,'Czy chcesz przerwać aktualną grę?'),(26,26,1,'Gratulacje! Nowy rekord!'),(27,27,1,'Koniec gry. Chcesz zagrać jeszcze raz?'),(28,28,1,'Nazwa użytkownika nie może być pusta.'),(29,29,1,'Hasło nie może być puste.'),(30,30,1,'Musisz wypełnić wszystkie pola.'),(31,31,1,'Nieprawidłowa nazwa użytkownika lub hasło.'),(32,32,1,'Błąd bazy danych. Spróbój ponownie.'),(33,33,1,'Nazwa użytkownika jest za długa.'),(34,34,1,'Powtórzenie hasła nie może być puste.'),(35,35,1,'Powtórzenie hasła różni się od podanego hasła.'),(36,36,1,'Użytkownik o podanej nazwie już istnieje.'),(37,37,1,'Nie jesteś zalogowany.'),(38,38,1,'Stan gry nie istnieje w bazie.'),(39,39,1,'Potwierdź'),(40,40,1,'Anuluj'),(41,1,2,'New Game'),(42,2,2,'Load game'),(43,3,2,'Save game'),(44,4,2,'Undo'),(45,5,2,'Settings'),(46,6,2,'Highscores'),(47,7,2,'About'),(48,8,2,'Logout'),(49,9,2,'Login'),(50,10,2,'Register'),(51,11,2,'Show next colors'),(52,12,2,'Number of colors'),(53,13,2,'Language'),(54,14,2,'Do you want to quit actual game?'),(55,15,2,'User'),(56,16,2,'Password'),(57,17,2,'Retype Password'),(58,18,2,'User'),(59,19,2,'Password'),(60,20,2,'Are you sure you want to log out?'),(61,21,2,'During the game you move the balls such way they will create lines. If there is at least five balls the line is removed. If the move is not ended with the line creation there are added additional balls in random color and places. You need to take care to make lines in many moves. For each removed ball you get suitable amount of points. The game is over when you cannot make any move.'),(62,22,2,'Program is distributed as Freeware. Author does not take any responsibility for eventual damages made by this software.'),(63,23,2,'Original Magnetic class code: '),(64,24,2,'Overwrite saved game?'),(65,25,2,'Do you want to quit actual game?'),(66,26,2,'Congratulations! New highscore!'),(67,27,2,'Game over. Do you want to play again?'),(68,28,2,'Username cannot be empty.'),(69,29,2,'Password cannot be empty.'),(70,30,2,'You have to fill all fields.'),(71,31,2,'Incorrect usename or password.'),(72,32,2,'Database error. Try again.'),(73,33,2,'Username is too long.'),(74,34,2,'Please retype the password.'),(75,35,2,'Retyped password differs from entered password.'),(76,36,2,'Given username already exists.'),(77,37,2,'You are not logged in.'),(78,38,2,'Save game does not exist.'),(79,39,2,'Confirm'),(80,40,2,'Cancel'),(81,41,1,'Zamknij'),(82,41,2,'Close');

CREATE TABLE IF NOT EXISTS `themes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
	`name`text,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8;

INSERT INTO `themes` VALUES (1,'Classic');
INSERT INTO `themes` VALUES (2,'Cosmic');

ALTER TABLE save_game ADD COLUMN theme text;
UPDATE save_game SET theme = 'cosmic';

ALTER TABLE user_defaults ADD COLUMN theme text;
UPDATE user_defaults SET theme = 'cosmic';

INSERT INTO translations(caption_type, caption_id)
VALUES ('caption','themeCaption');

INSERT INTO translations_caption(translations_id, language_id, caption)
SELECT id, 1, 'Motyw' FROM translations WHERE caption_id = 'themeCaption';

INSERT INTO translations_caption(translations_id, language_id, caption)
SELECT id, 2, 'Theme' FROM translations WHERE caption_id = 'themeCaption';

INSERT INTO `themes` VALUES (3,'Zombie');
INSERT INTO `themes` VALUES (4,'Flower');
INSERT INTO `themes` VALUES (5,'Fantasy');