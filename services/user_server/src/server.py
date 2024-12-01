import datetime

from flask import Flask, jsonify, request
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
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(minutes=5)

jwt = JWTManager(app)


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'detail': 'Invalid input'}), 400

    query = select(User).where(User.email == email)
    user = session.execute(query).scalar()
    if not user or not user.verify_password(password):
        return jsonify({'detail': 'Could not validate credentials'}, 401)
    
    access_token = create_access_token(identity={
        'id': user.id, 
        'name': user.name, 
        'last_name': user.last_name, 
        'email': user.email, 
        'is_admin': user.is_admin
    })

    return jsonify(access_token=access_token), 200

@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

if __name__ == '__main__':
    server = app.run(host='0.0.0.0', port=5003)
