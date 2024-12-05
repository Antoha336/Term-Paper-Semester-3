import httpx

from flask import Flask, make_response, request
from flask_cors import CORS
from sqlalchemy import select

from shared.database.database import session, Event, EventUser
from shared.schemas.event import SGetEvent


app = Flask(__name__)
CORS(app, resources={'/*' : {"origins": "*"}})

@app.route('/events/', methods=['GET'])
def list_events():
    query = select(Event)
    results = session.execute(query).scalars()
    events = list(SGetEvent.model_validate(event).model_dump(mode='json') for event in results)

    return make_response(events, 200)


@app.route('/events/<int:event_id>/register/', methods=['POST'])
def register_for_event(event_id):
    event = session.get(Event, event_id)
    if not event:
        return make_response({'detail': 'Мероприятия не существует'}, 400)
    
    with httpx.Client() as client:
        response = client.get('http://user-service:5001/users/auth/', headers=request.headers)

    if response.is_error:
        if response.status_code == 401:
            return make_response({'detail': 'Вход не выполнен'}, 401)
        else:
            return make_response({'detail': 'Сервис пользователей не доступен'}, 502)

    user_id = response.json()['payload']['id']
    existing_registration = session.query(EventUser).filter_by(user_id=user_id, event_id=event_id).first()
    if existing_registration:
        return make_response({'detail': 'Вы уже зарегистрированы на это мероприятие'}), 400

    event_user = EventUser(user_id=user_id, event_id=event_id)
    session.add(event_user)
    session.commit()

    return make_response({"message": "User successfully registered for the event"}, 200)

if __name__ == "__main__":
    server = app.run(host='0.0.0.0', port=5002)
