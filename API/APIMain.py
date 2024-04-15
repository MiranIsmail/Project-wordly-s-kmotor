from fastapi import FastAPI, HTTPException
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
import os

app = FastAPI()

# Load the environment variables from the .env file.
load_dotenv('infoContainer.env')
secretInfo = {
    "host": os.getenv('HOST'),
    "user": os.getenv('USER'),
    "password": os.getenv('PASSWORD'),
    "database": os.getenv('DATABASE')
}

db = mysql.connector.connect(
    host=secretInfo['host'],
    user=secretInfo['user'],
    password=secretInfo['password'],
    database=secretInfo['database'],
)


# This is only for testing purposes.
@app.get("/items/")
def read_items():
    cursor = db.cursor()
    try:
        cursor.execute("SELECT * FROM likes")
        result = cursor.fetchall()
        return {"items": result}
    except Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()