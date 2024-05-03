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
    database=secretInfo["database"]
)

class CustomMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        '''This middleware will run before and after the request is processed.'''
        # Extract key parameter from path. Default to None if not present.
        # This is used to identify the user.
        try:
            key = request.query_params['key']
        
        except KeyError:
            key = None

        # Code to run before the request
        sessionUserClass = classes.UserSessionData()
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

    query = "INSERT INTO word (word, length) VALUES (%s, %s)"

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

        # Get the user key from the database.
        cursor.execute("SELECT `tokenID` FROM `user` WHERE email = %s AND passwordSHA512 = %s", (email, psw))
        userKey = cursor.fetchone()[0]

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

        return {"success": True, 'email': userInfo[0], 'firstName': userInfo[1], 'lastName': userInfo[2]}

    except Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()