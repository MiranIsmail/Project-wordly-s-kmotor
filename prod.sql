CREATE DATABASE prod;
USE prod;

CREATE TABLE word(
    word VARCHAR(100),
    word_length SMALLINT,
    word_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (word_id)
);

CREATE Table user(
    UserID INT NOT NULL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    firstName VARCHAR(50),
    lastName VARCHAR(50),
    passwordSHA512 CHAR(128)
);




CREATE Table guessHistory(
    guessID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL ,
    dateSearched DATETIME,
    correctCharPos VARCHAR(100),
    unknownChars VARCHAR(100),
    excludedChars VARCHAR(100),
    FOREIGN KEY (UserID) REFERENCES user(UserID)
);



CREATE TABLE suggestedWord(
    guessID INT NOT NULL,
    word_id INT UNSIGNED NOT NULL,
    FOREIGN KEY(guessID) REFERENCES guessHistory(guessID),
    FOREIGN KEY (word_id) REFERENCES word(word_id)
);


CREATE FUNCTION `CreateUser`(
    inTokenID VARCHAR(255),
    inEmail VARCHAR(255),
    inFirst VARCHAR(50),
    inLast VARCHAR(50),
    inPassSHA512 CHAR(128)
) RETURNS int
    DETERMINISTIC
BEGIN
    DECLARE AccoutCreated INT DEFAULT 0;
    DECLARE NumberOfSameAccounts INT DEFAULT 0;
    DECLARE UserIDIn INT DEFAULT 0;

    SELECT COALESCE(MAX(`UserID`), 0) + 1 INTO UserIDIn FROM `user`;

    SELECT COUNT(*) INTO NumberOfSameAccounts FROM `user` WHERE email = inEmail;
    IF NumberOfSameAccounts > 0 THEN
        SET AccoutCreated = 0;
    ELSE
        INSERT INTO `user` (`UserID`, `email`, `tokenID`, `firstName`, `lastName`, `passwordSHA512`) VALUES (UserIDIn, inEmail, inTokenID, inFirst, inLast, inPassSHA512);
        SET AccoutCreated = 1;
    END IF;
    
    return AccoutCreated;
END


CREATE FUNCTION `LoginUser`(
    inEmail VARCHAR(255),
    inPassSHA512 CHAR(128)
) RETURNS int
    DETERMINISTIC
BEGIN
    DECLARE isMatched INT DEFAULT 0;
    SELECT count(*) into isMatched FROM `user` WHERE email = inEmail AND passwordSHA512 = inPassSHA512;
    return isMatched;
END