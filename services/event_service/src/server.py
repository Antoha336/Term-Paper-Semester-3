import httpx

from flask import Flask, make_response, jsonify, request
from flask_cors import CORS
from sqlalchemy import select, and_

from shared.database.database import session, Event, EventUser
from shared.schemas.events import SGetEvent, SCreateEvent, SUpdateEvent, SEventQueryParams
from shared.utils.authorization import check_authorization, check_admin_permission


app = Flask(__name__)
CORS(app, resources={'/*' : {"origins": "*"}})

@app.route('/events/', methods=['GET'])
def list_events():
    params = SEventQueryParams(**request.args)

    query = select(Event).order_by(Event.id)
    if params.is_available is not None:
        query = query.where(Event.is_available == params.is_available)
    results = session.execute(query).scalars()
    events = list(SGetEvent.model_validate(event).model_dump(mode='json') for event in results)

    return jsonify(events), 200


@app.route('/events/', methods=['POST'])
def create_event():
    is_auth, result = check_admin_permission(request.headers)
    if not is_auth:
        return result
    
    data = SCreateEvent.model_validate_json(request.json).model_dump()
    event = Event(**data)
    session.add(event)
    session.commit()

    return jsonify(SGetEvent.model_validate(event).model_dump(mode='json')), 201


@app.route('/events/me/', methods=['GET'])
def list_user_events():
    is_auth, result = check_authorization(request.headers)
    if not is_auth:
        return result
    
    user_id = int(result['id'])
    query = select(EventUser.event_id).where(EventUser.user_id == user_id)
    event_ids = session.execute(query).scalars().all()

    query = select(Event).where(Event.id.in_(event_ids)).order_by(Event.id)
    results = session.execute(query).scalars()
    events = list(SGetEvent.model_validate(event).model_dump(mode='json') for event in results)

    return jsonify(events), 200


@app.route('/events/<int:event_id>/', methods=['GET'])
def get_event(event_id: int):
    is_auth, result = check_authorization(request.headers)
    if not is_auth:
        return result
    
    user_id = int(result['id'])

    query = select(Event).where(Event.id == event_id)
    event = session.execute(query).scalar_one_or_none()
    if event is None:
        return make_response({'detail': "Event doesn't exist"}, 404)

    query = select(EventUser).where(and_(EventUser.event_id == event.id, EventUser.user_id == user_id))
    is_registered = session.execute(query).scalar_one_or_none() is not None
    event.is_registered = is_registered

    return jsonify(SGetEvent.model_validate(event).model_dump(mode='json')), 200


@app.route('/events/<int:event_id>/', methods=['PATCH'])
def update_event(event_id: int):
    is_auth, result = check_admin_permission(request.headers)
    if not is_auth:
        return result
    print(request.json)
    data = SUpdateEvent.model_validate_json(request.json).model_dump()
    print(data)
    query = select(Event).where(Event.id == event_id)
    event = session.execute(query).scalar_one_or_none()
    for key, value in data.items():
        if value is not None:
            setattr(event, key, value)
    session.add(event)
    session.commit()

    return make_response(SGetEvent.model_validate(event).model_dump(mode='json'), 200)


@app.route('/events/<int:event_id>/', methods=['DELETE'])
def delete_event(event_id: int):
    is_auth, result = check_admin_permission(request.headers)
    if not is_auth:
        return result
    
    query = select(Event).where(Event.id == event_id)
    event = session.execute(query).scalar_one_or_none()
    if event is None:
        return make_response({'detail': "Event doesn't exist"}, 404)

    session.delete(event)
    session.commit()

    return make_response('', 200)


@app.route('/events/<int:event_id>/register/', methods=['POST'])
def register_for_event(event_id: int):
    event = session.get(Event, event_id)
    if not event:
        return make_response({'detail': 'Мероприятия не существует'}, 400)
    
    is_auth, result = check_authorization(request.headers)
    if not is_auth:
        return result

    user_id = result['id']
    query = select(EventUser).where(and_(EventUser.user_id == user_id, EventUser.event_id == event_id))
    existing_registration = session.execute(query).scalar_one_or_none()
    if (existing_registration is not None):
        session.delete(existing_registration)
        event.is_registered = False
    else:
        event_user = EventUser(user_id=user_id, event_id=event_id)
        session.add(event_user)
        event.is_registered = True
    session.commit()

    return jsonify(SGetEvent.model_validate(event).model_dump(mode='json')), 200

if __name__ == "__main__":
    server = app.run(host='0.0.0.0', port=5002)
