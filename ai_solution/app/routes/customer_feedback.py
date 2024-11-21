from flask import Blueprint, request, jsonify
from app.models.models import CustomerFeedback, db

feedback_bp = Blueprint('feedback', __name__)

@feedback_bp.route('/feedbacks', methods=['POST'])
def create_feedback():
    data = request.json
    try:
        new_feedback = CustomerFeedback(
            customer_id=data['customer_id'],
            feedback_text=data.get('feedback_text'),
            rating=data.get('rating')
        )
        db.session.add(new_feedback)
        db.session.commit()
        return jsonify({'message': 'Feedback created successfully!'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@feedback_bp.route('/feedbacks', methods=['GET'])
def get_feedbacks():
    feedbacks = CustomerFeedback.query.all()
    result = [
        {
            'id': feedback.id,
            'customer_id': feedback.customer_id,
            'feedback_text': feedback.feedback_text,
            'rating': feedback.rating,
            'feedback_date': feedback.feedback_date
        } for feedback in feedbacks
    ]
    return jsonify(result), 200

@feedback_bp.route('/feedbacks/<int:id>', methods=['PUT'])
def update_feedback(id):
    data = request.json
    feedback = CustomerFeedback.query.get_or_404(id)
    feedback.feedback_text = data.get('feedback_text', feedback.feedback_text)
    feedback.rating = data.get('rating', feedback.rating)
    db.session.commit()
    return jsonify({'message': 'Feedback updated successfully!'}), 200

@feedback_bp.route('/feedbacks/<int:id>', methods=['DELETE'])
def delete_feedback(id):
    feedback = CustomerFeedback.query.get_or_404(id)
    db.session.delete(feedback)
    db.session.commit()
    return jsonify({'message': 'Feedback deleted successfully!'}), 200
