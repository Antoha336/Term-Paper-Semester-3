import datetime

from flask import Flask, jsonify, request, make_response
from jwt import ExpiredSignatureError, InvalidTokenError, decode, encode
from flask_cors import CORS
from sqlalchemy import select

from shared.utils.env import get_env_var
from shared.database.database import session, User
from shared.schemas.users import STokenPayload

app = Flask(__name__)
CORS(app, resources={'/*' : {"origins": "*"}})

JWT_SECRET = get_env_var('JWT_SECRET')
TOKEN_LIFETIME = datetime.timedelta(hours=1)

@app.route('/users/auth/', methods=['GET'])
def auth():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"error": "Token is missing or invalid"}), 401

    token = auth_header.split(" ")[1]

    try:
        payload = decode(
            jwt=token, 
            key=JWT_SECRET, 
            algorithms=['HS256'],
        )
        return jsonify({"payload": payload}), 200
    except ExpiredSignatureError:
        return jsonify({"error": "Token has expired"}), 401
    except InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401


@app.route('/users/login/', methods=['POST'])
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
    user.exp = datetime.datetime.now() + TOKEN_LIFETIME
    
    access_token = encode(
        payload=STokenPayload.model_validate(user).model_dump(),
        key=JWT_SECRET,
        algorithm='HS256',
    )

    return jsonify({'access_token': access_token}), 200

@app.route('/users/', methods=['POST'])
def registration():
    data     = request.json
    name     = data.get('name')
    lastname = data.get('lastname')
    email    = data.get('email')
    password = data.get('password')

    if not email or not password or not name or not lastname:
        return jsonify({'detail': 'Invalid input'}), 400

    query = select(User).where(User.email == email)
    user = session.execute(query).scalar()
    if user:
        return jsonify({'detail': 'User with this email already exist'}), 400
    
    user = User(
        name=name,
        lastname=lastname,
        email=email,
    )
    user.set_password(password)
    session.add(user)
    session.commit()

    return make_response('', 204)

if __name__ == '__main__':
    server = app.run(host='0.0.0.0', port=5001)
