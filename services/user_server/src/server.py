import datetime

from flask import Flask, jsonify, request, make_response
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity
)
from sqlalchemy import select
from shared.utils.env import get_env_var
from shared.database.database import session, User


app = Flask(__name__)

app.config['JWT_SECRET_KEY'] = get_env_var('JWT_SECRET')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(hours=1)

jwt = JWTManager(app)


@app.route('/login/', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return make_response({'detail': 'Invalid input'}, 400)

    query = select(User).where(User.email == email)
    user = session.execute(query).scalar()
    if not user or not user.verify_password(password):
        return make_response({'detail': 'Could not validate credentials'}, 401)
    
    access_token = create_access_token(identity={
        'id': user.id, 
        'name': user.name, 
        'last_name': user.last_name, 
        'email': user.email, 
        'is_admin': user.is_admin
    })

    return make_response({'access_token': access_token}, 200)

@app.route('/users/', methods=['POST'])
def registration():
    data = request.json
    name =      data.get('name')
    last_name = data.get('last_name')
    email =     data.get('email')
    password =  data.get('password')

    if not email or not password or not name or not last_name:
        return make_response({'detail': 'Invalid input'}, 400)

    query = select(User).where(User.email == email)
    user = session.execute(query).scalar()
    if user:
        return make_response({'detail': 'User with this email already exist'}, 400)
    
    user = User(
        name=name,
        last_name=last_name,
        email=email,
    )
    user.set_password(password)
    session.add(user)
    session.commit()

    return make_response('', 204)

if __name__ == '__main__':
    server = app.run(host='0.0.0.0', port=5003)
