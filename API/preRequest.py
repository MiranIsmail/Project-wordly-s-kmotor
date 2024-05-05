import classes

# This function is called before the request is processed.
def preRequest(UserSessionData, key):
    print(key)
    UserSessionData.setKey(key)
    if UserSessionData.key:
        print('tokenID = ' + UserSessionData.key)
    print("Pre-request logic")
    return