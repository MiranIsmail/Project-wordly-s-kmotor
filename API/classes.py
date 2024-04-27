class UserSessionData:
    def __init__(self):
        pass

    def __str__(self):
        return f'UserSessionData(user_id={self.user_id}, session_id={self.session_id})'

    def __repr__(self):
        return self.__str__()
    