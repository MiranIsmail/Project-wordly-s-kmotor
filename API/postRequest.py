import classes
import mysql.connector

# This function is called after the request has been processed.
def postRequest(UserSessionData, db):
    print("Post-request logic")
    db.commit()
    return