import classes

# This function is called before the request is processed.
def preRequest(UserSessionData, key):
    print(key)
    print("Pre-request logic")
    return