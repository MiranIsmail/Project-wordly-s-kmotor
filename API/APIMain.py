from fastapi import FastAPI, HTTPException, Request
from starlette.middleware.base import BaseHTTPMiddleware
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
import os
import preRequest
import postRequest
import classes
import json

app = FastAPI()

# Load the environment variables from the .env file.
load_dotenv('infoContainer.env')
secretInfo = {
    "host": os.getenv("HOST"),
    "user": os.getenv("name"),
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
@app.get("/createUser/")
def create_user(email: str, psw: str, fName: str, lName: str):
    cursor = db.cursor()

    # Check if any of the parameters are missing.
    if not email or not psw or not fName or not lName:
        raise HTTPException(status_code=400, detail="Missing parameter(s)")

    try:
        cursor.execute("SELECT CreateUser(%s, %s, %s, %s) as accountCreated", (email, fName, lName, psw))

        return {"message": cursor.fetchone()[0]}

    except Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()

def getListOfWordsFromFile():
    f = open("svenska-ord.json", "r", encoding="utf-8")
    return json.load(f)
