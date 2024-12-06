import httpx

from flask import make_response


def check_auth(headers: dict[str, str]) -> tuple[bool, any]:
    with httpx.Client() as client:
        response = client.get('http://user-service:5001/users/auth/', headers=headers)
    if response.is_error:
        if response.status_code == 401:
            return False, make_response({'detail': 'Вход не выполнен'}, 401)
        else:
            return False, make_response({'detail': 'Сервис пользователей не доступен'}, 502)
    
    return True, response.json()['payload']