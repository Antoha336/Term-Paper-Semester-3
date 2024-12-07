import httpx

from flask import make_response


def check_authorization(headers: dict[str, str]) -> tuple[bool, any]:
    with httpx.Client() as client:
        response = client.get('http://user-service:5001/users/auth/', headers={'Authorization': headers.get('Authorization')})

    if response.is_error:
        if response.status_code == 401:
            return False, make_response({'detail': 'Вход не выполнен'}, 401)
        else:
            return False, make_response({'detail': 'Сервис пользователей не доступен'}, 502)
    
    return True, response.json()['payload']

def check_admin_permission(headers: dict[str, str]) -> tuple[bool, any]:
    is_success, detail = check_authorization(headers)
    if not is_success:
        return False, detail
    elif not detail['is_admin']:
        return False, make_response({'detail': 'Permission denied'}, 403)
    
    return True, detail
