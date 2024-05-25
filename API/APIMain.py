from fastapi import FastAPI, HTTPException, Request
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
import os
import preRequest
import postRequest
import classes
import json
from hashlib import sha512
app = FastAPI()

# Load the environment variables from the .env file.
load_dotenv('infoContainer.env')
secretInfo = {
    "host": os.getenv("HOST"),
    "user": os.getenv("NAME"),
    "password": os.getenv("PASSWORD"),
    "database": os.getenv("DATABASE")
}

db = mysql.connector.connect(
    host=secretInfo["host"],
    user=secretInfo["user"],
    password=secretInfo["password"],
    database=secretInfo["database"],
    charset='utf8mb4'  # Add this line
)

sessionUserClass = classes.UserSessionData()

class CustomMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        '''This middleware will run before and after the request is processed.'''
        # Extract key parameter from path. Default to None if not present.
        # This is used to identify the user.
        try:
            key = request.query_params['tokenID']
        
        except KeyError:
            key = None

        # Code to run before the request
        preRequest.preRequest(sessionUserClass, key= key)

        # Process the request
        response = await call_next(request)

        # Code to run after the request
        postRequest.postRequest(sessionUserClass, db= db, key= key)
        return response

# Add middleware to the app
app.add_middleware(CustomMiddleware)


origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def getUserID(tokenID):
    cursor = db.cursor()
    cursor.execute("SELECT `UserID` FROM `user` WHERE `tokenID` = %s", (tokenID,))
    try:
        userID = cursor.fetchone()[0]
        return userID
    except:
        return -1

#Views go here

# This is only for testing purposes.
@app.get("/users/")
def read_items(id: int = None):
    cursor = db.cursor()
    print(id)
    try:
        if id:
            print('lol')
            cursor.execute("SELECT * FROM user WHERE UserId = %s", (id,))
            print('lol')
        else:
            cursor.execute("SELECT * FROM user")
        result = cursor.fetchall()
        return {"items": result}
    except Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()

@app.get("/addWords/")
def add_words():
    cursor = db.cursor()

    query = "INSERT INTO word (word, word_length) VALUES (%s, %s)"

    try:        
        data = getListOfWordsFromFile()
        WordInsertTuple = [(word, len(word)) for word in data]

        print('Inserting words into the database...')
        cursor.executemany(query, WordInsertTuple)
        print('Words inserted successfully!')

        return {"message": "Words inserted successfully!"}

    except Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()


# Create a user with the given parameters.
@app.post("/createUser/")
def create_user(email: str, psw: str, fName: str, lName: str):
    cursor = db.cursor()

    # Check if any of the parameters are missing.
    if not email or not psw or not fName or not lName:
        raise HTTPException(status_code=400, detail="Missing parameter(s)")

    try:
        # Gets the token by hashing the email and password.
        tokenID = sha512((email + psw).encode()).hexdigest()
        cursor.execute("SELECT CreateUser(%s, %s, %s, %s, %s) as accountCreated", (tokenID, email, fName, lName, psw))

        couldCreate = cursor.fetchone()[0]

        return {"success": couldCreate, "message": "User created successfully!" if couldCreate == 1 else "User already exists!"}

    except Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()

def getListOfWordsFromFile():
    f = open("svenska-ord.json", "r", encoding="utf-8")
    return json.load(f)


# Loggs in the user with the given email and password.
@app.post("/loginUser/")
def login_user(email: str, psw: str):
    cursor = db.cursor()

    # Check if any of the parameters are missing.
    if not email or not psw:
        raise HTTPException(status_code=400, detail="Missing parameter(s)")

    try:
        cursor.execute("SELECT LoginUser(%s, %s) as userKey", (email, psw))

        success = cursor.fetchone()[0]
        print(success)

        if not success:
            return {"success": success, 'message': "Invalid credentials!", "tokenID": None}

        # Get the user key from the database.
        cursor.execute("SELECT `tokenID` FROM `user` WHERE email = %s AND passwordSHA512 = %s", (email, psw))
        userKey = cursor.fetchone()[0]
        print(userKey)

        return {"success": success, 'message': "User logged in successfully!" if userKey else "Invalid credentials!", "tokenID": userKey}

    except Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()

# Get User Token
@app.get("/getUserToken/")
def get_user_token(email: str, psw: str):
    cursor = db.cursor()

    # Check if any of the parameters are missing.
    if not email or not psw:
        raise HTTPException(status_code=400, detail="Missing parameter(s)")

    try:
        print(email)
        print(psw)
        # cursor.execute("SELECT `tokenID` FROM `user` WHERE email = 'silj20@student.bth.se' AND passwordSHA512 = '6118af136dcbdd816dd295f3233e4f581bc1a81a07ccc2b512b2974be0e1e49cec9982afd3fd7920a92958cde27110b309482eccc5b0a43cb666da3f383c4ab2'")
        # print(cursor.fetchone()[0])
        cursor.execute("SELECT `tokenID` FROM `user` WHERE email = %s AND passwordSHA512 = %s", (email, psw))

        userKey = cursor.fetchone()
        sucess = False if userKey == None else True

        return {"success": sucess, 'tokenID': userKey if userKey else "Invalid credentials!"}

    except Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()

# Get User Info
@app.get("/getUserInfo/")
def get_user_info(tokenID: str):
    cursor = db.cursor()

    # Check if any of the parameters are missing.
    if not tokenID:
        raise HTTPException(status_code=400, detail="Missing parameter(s)")

    try:
        cursor.execute("SELECT `email`, `firstName`, `lastName` FROM `user` WHERE tokenID = %s", (tokenID,))

        userInfo = cursor.fetchone()

        return {"success": True, 'email': userInfo[0], 'firstName': userInfo[1], 'lastName': userInfo[2], 'scoreboard': get_profile_scoreboard()}

    except Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()

# Get user history
@app.get("/getUserHistory/")
def get_user_history():
    cursor = db.cursor()

    # Check if any of the parameters are missing.
    if not sessionUserClass.key:
        raise HTTPException(status_code=400, detail="Missing parameter(s)")

    try:

        cursor.execute("SELECT * FROM `guessHistory` WHERE `UserID` = (SELECT `UserID` FROM `user` WHERE `tokenID` = %s) ORDER BY `dateSearched` DESC", (sessionUserClass.key,))
        userHistory = cursor.fetchall()
        columns = [col[0] for col in cursor.description]

        # Mapping each row of userHistory to a dictionary with keys as column names
        result = [dict(zip(columns, row)) for row in userHistory]

        # print(result)

        if not userHistory:
            return {"success": False, 'message': "No history found!"}

        return {"success": True, 'history': result}

    except Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()

# Get specific user history
@app.get("/getUserHistory/{id}")
def get_specific_user_history(id: int):
    cursor = db.cursor()

    # Check if any of the parameters are missing.
    if not sessionUserClass.key:
        raise HTTPException(status_code=400, detail="Missing parameter(s)")

    try:
        # Check if the history exists and is on the same user.
        cursor.execute("SELECT * FROM `guessHistory` WHERE `UserID` = (SELECT `UserID` FROM `user` WHERE `tokenID` = %s) AND `guessID` = %s ORDER BY `dateSearched` DESC", (sessionUserClass.key, id))
        historyGuess = cursor.fetchone()
        if historyGuess == None:
            return {"success": False, 'message': "History not found!"}
        print('Approved')

        # Mapping each row of userHistory to a dictionary with keys as column names
        resultHistInfo = dict(zip([col[0] for col in cursor.description], historyGuess))
        
        cursor.execute("SELECT word FROM `suggestedWord` WHERE `guessID` = %s", (id,))
        print('Approved')
        userHistory = cursor.fetchall()
        print(userHistory)

        if not userHistory:
            return {"success": False, 'message': "No history found!"}
        
        # Gets the correct word if it exists.
        cursor.execute("SELECT `word` FROM `foundWord` WHERE `guessID` = %s", (id,))
        foundWord = cursor.fetchone()

        return {"success": True, 'historyInfo': resultHistInfo, 'suggestedWords': userHistory, 'foundWord': foundWord[0] if foundWord else None}

    except Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()

#returns if five letter word is in the database
@app.get("/word/")
def get_word(word: str,exclude: str,include: str):
    cursor = db.cursor()
    word = word.lower()
    charWord = word
    word = "'"+word+"'"
    exclude = exclude.lower()
    include = include.lower()

    print(word)
    print(exclude)
    print(include)

    includeText = "wo.word COLLATE utf8mb4_bin LIKE '%" + include[0] + "%'"
    for i in range(1, len(include)):
        includeText += " AND wo.word COLLATE utf8mb4_bin LIKE '%" + include[i]+"%'"
    
    print(includeText)

    excludeText = "wo.word COLLATE utf8mb4_bin NOT LIKE '%" + exclude[0] + "%'"
    for i in range(1, len(exclude)):
        excludeText += " AND wo.word COLLATE utf8mb4_bin NOT LIKE '%" + exclude[i]+"%'"

    print(excludeText)

    sendText = "SELECT * FROM (SELECT word FROM word WHERE word COLLATE utf8mb4_bin LIKE "+ word +") AS wo WHERE ("+ includeText +") AND ("+ excludeText +") LIMIT 200"
    print(sendText)
    try:
        cursor.execute(sendText)
        #this will be more efficient if we filter include and exclude on clintside ie this is just for the sake of the assigment
        result = cursor.fetchall()
        resultList = [row[0] for row in result]
        print(resultList)

        # If the user is logged in, add the search to the history.
        if sessionUserClass.key != 'null':
            print(sessionUserClass.key)
            print('User is logged in')
            userID = getUserID(sessionUserClass.key)
            print(userID)
            cursor.execute("""
            INSERT INTO guessHistory (`UserID`, `dateSearched`, `correctCharPos`, `includedChars`, `excludedChars`) Values
            (%s, NOW(), %s, %s, %s)
            """, (userID, charWord, include, exclude))

            guessID = cursor.lastrowid

            # Execute many
            suggestedWords = [(guessID, word) for word in resultList]
            cursor.executemany("INSERT INTO suggestedWord (`guessID`, `word`) VALUES (%s, %s)", suggestedWords)
            db.commit()

        return {"exists": [row[0] for row in result]}
    except Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()


@app.post("/correctWordGotten/")
def correct_word_gotten(word: str):
    cursor = db.cursor()
    print(word)

    try:
        userID = getUserID(sessionUserClass.key)
        print('userID = ' + str(userID))
        cursor.execute("SELECT guessID FROM `guessHistory` WHERE `UserID` = (SELECT `UserID` FROM `user` WHERE `tokenID` = %s) ORDER BY `dateSearched` DESC LIMIT 1", (sessionUserClass.key,))

        userHistory = cursor.fetchall()
        guessID = userHistory[0][0]

        print(guessID, word)
        cursor.execute("SELECT `guessID` FROM `foundWord` WHERE `guessID` = %s", (guessID,))

        # Remove the word from the foundWord table if it already exists.
        if cursor.fetchone():
            cursor.execute("DELETE FROM foundWord WHERE `guessID` = %s", (guessID,))
            print('Deleted word from foundWord table because it already existed.')

        print('Inserting word into foundWord table...')
        cursor.execute("INSERT INTO foundWord (`guessID`, `word`) VALUES (%s, %s)", (guessID, word))
        db.commit()

        return {"success": True, "message": "Data sent!!"}

    except Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()

@app.get("/getProfileScoreboard/")
def get_profile_scoreboard():
    cursor = db.cursor()

    try:
        cursor.execute("""SELECT word as text, COUNT(*) as amount FROM `foundWord` 
            INNER JOIN `guessHistory` ON `foundWord`.`guessID` = `guessHistory`.`guessID` 
            INNER JOIN `user` ON `guessHistory`.`UserID` = `user`.`UserID` WHERE `user`.`tokenID` = %s GROUP BY word ORDER BY COUNT(*) DESC LIMIT 10""",
            (sessionUserClass.key,)
            )
        userScoreboard = cursor.fetchall()
        columns = [col[0] for col in cursor.description]

        # Mapping each row of userHistory to a dictionary with keys as column names
        result = [dict(zip(columns, row)) for row in userScoreboard]

        # get the amopunt of times a user has searched for a word
        cursor.execute("SELECT COUNT(*) as amount FROM `guessHistory` WHERE `UserID` = (SELECT `UserID` FROM `user` WHERE `tokenID` = %s)", (sessionUserClass.key,))
        userSearches = cursor.fetchone()[0]

        return {"success": True, 'top10Found': result, 'amountSearches': userSearches}

    except Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()


@app.get("/getScoreboard/")
def get_scoreboard():
    cursor = db.cursor()

    try:
        cursor.execute("""SELECT CONCAT(`firstName`, ' ', `lastName`) as text, count(*) as amount FROM `user` 
            INNER JOIN `guessHistory` ON `user`.`UserID` = `guessHistory`.`UserID` GROUP BY `user`.`UserID` 
            ORDER BY COUNT(`guessHistory`.`UserID`) DESC LIMIT 10;"""
            )
        userScoreboard = cursor.fetchall()
        columns = [col[0] for col in cursor.description]

        # Mapping each row of userHistory to a dictionary with keys as column names
        result = [dict(zip(columns, row)) for row in userScoreboard]

        cursor.execute("SELECT word as text, count(*) as amount FROM `foundWord` GROUP BY word ORDER BY COUNT(*) DESC LIMIT 10;")
        top10Found = cursor.fetchall()
        columns = [col[0] for col in cursor.description]

        # Mapping each row of userHistory to a dictionary with keys as column names
        top10Found = [dict(zip(columns, row)) for row in top10Found]

        return {"success": True, 'top10Searched': result, 'top10Found': top10Found}

    except Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()