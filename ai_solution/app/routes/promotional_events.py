from flask import Blueprint, request, jsonify
from app.models.models import PromotionalEvent, db

event_bp = Blueprint('event', __name__)

@event_bp.route('/events', methods=['POST'])
def create_event():
    data = request.json
    try:
        new_event = PromotionalEvent(
            event_name=data['event_name'],
            event_description=data.get('event_description'),
            event_start_date=data.get('event_start_date'),
            event_end_date=data.get('event_end_date'),
            location=data.get('location'),
            image_url=data.get('image_url'),
            is_upcoming=data.get('is_upcoming', True)
        )
        db.session.add(new_event)
        db.session.commit()
        return jsonify({'message': 'Event created successfully!'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@event_bp.route('/events', methods=['GET'])
def get_events():
    # Update the is_upcoming status for all events
    PromotionalEvent.update_is_upcoming()

    is_filterby_upcomming_events = request.args.get('filter')

    if is_filterby_upcomming_events is not None:
        is_filterby_upcomming_events = is_filterby_upcomming_events.lower() == 'true'
        events = PromotionalEvent.get_events(is_filterby_upcomming_events)
    else:
        events = PromotionalEvent.query.all()

    result = [
        {
            'id': event.id,
            'event_name': event.event_name,
            'event_description': event.event_description,
            'event_start_date': event.event_start_date,
            'event_end_date': event.event_end_date,
            'location': event.location,
            'is_upcoming': event.is_upcoming
        } for event in events
    ]
    return jsonify(result), 200

@event_bp.route('/events/<int:id>', methods=['PUT'])
def update_event(id):
    data = request.json
    event = PromotionalEvent.query.get_or_404(id)
    event.event_name = data.get('event_name', event.event_name)
    event.event_description = data.get('event_description', event.event_description)
    event.event_start_date = data.get('event_start_date', event.event_start_date)
    event.event_end_date = data.get('event_end_date', event.event_end_date)
    event.location = data.get('location', event.location)
    event.is_upcoming = data.get('is_upcoming', event.is_upcoming)
    db.session.commit()
    return jsonify({'message': 'Event updated successfully!'}), 200

@event_bp.route('/events/<int:id>', methods=['DELETE'])
def delete_event(id):
    event = PromotionalEvent.query.get_or_404(id)
    db.session.delete(event)
    db.session.commit()
    return jsonify({'message': 'Event deleted successfully!'}), 200

@event_bp.route('/events/<int:id>', methods=['GET'])
def get_event_by_id(id):
    try:
        event = PromotionalEvent.query.get_or_404(id)
        result = {
            'id': event.id,
            'event_name': event.event_name,
            'event_description': event.event_description,
            'event_start_date': event.event_start_date,
            'event_end_date': event.event_end_date,
            'location': event.location,
            'image_url': event.image_url,
            'is_upcoming': event.is_upcoming
        }
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': f'Event not found: {str(e)}'}), 404
