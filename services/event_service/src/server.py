import httpx

from flask import Flask, make_response, request
from flask_cors import CORS
from sqlalchemy import select, and_

from shared.database.database import session, Event, EventUser
from shared.schemas.events import SGetEvent
from shared.utils.auth import check_auth


app = Flask(__name__)
CORS(app, resources={'/*' : {"origins": "*"}})

@app.route('/events/', methods=['GET'])
def list_events():
    query = select(Event).where(Event.is_available == True)
    results = session.execute(query).scalars()
    events = list(SGetEvent.model_validate(event).model_dump(mode='json') for event in results)

    return make_response(events, 200)


@app.route('/events/me/', methods=['GET'])
def list_user_events():
    is_auth, result = check_auth(request.headers)
    if not is_auth:
        return result
    
    user_id = int(result['id'])
    query = select(EventUser.event_id).where(EventUser.user_id == user_id)
    event_ids = session.execute(query).scalars().all()

    query = select(Event).where(Event.id.in_(event_ids))
    results = session.execute(query).scalars()
    events = list(SGetEvent.model_validate(event).model_dump(mode='json') for event in results)

    return make_response(events, 200)


@app.route('/events/<int:event_id>/', methods=['GET'])
def get_event(event_id: int):
    is_auth, result = check_auth(request.headers)
    if not is_auth:
        return result
    
    user_id = int(result['id'])

    query = select(Event).where(and_(Event.id == event_id, Event.is_available == True))
    event = session.execute(query).scalar_one_or_none()
    if event is None:
        return make_response({'detail': "Event doesn't exist"}, 404)

    query = select(EventUser).where(and_(EventUser.event_id == event.id, EventUser.user_id == user_id))
    is_registered = session.execute(query).scalar_one_or_none() is not None
    event.is_registered = is_registered

    return make_response(SGetEvent.model_validate(event).model_dump(mode='json'), 200)


@app.route('/events/<int:event_id>/register/', methods=['POST'])
def register_for_event(event_id: int):
    event = session.get(Event, event_id)
    if not event:
        return make_response({'detail': 'Мероприятия не существует'}, 400)
    
    is_auth, result = check_auth(request.headers)
    if not is_auth:
        return result

    user_id = result['id']
    existing_registration = session.query(EventUser).filter_by(user_id=user_id, event_id=event_id).first()
    if existing_registration:
        return make_response({'detail': 'Вы уже зарегистрированы на это мероприятие'}), 400

    event_user = EventUser(user_id=user_id, event_id=event_id)
    session.add(event_user)
    session.commit()

    return make_response({"message": "User successfully registered for the event"}, 200)

if __name__ == "__main__":
    server = app.run(host='0.0.0.0', port=5002)
