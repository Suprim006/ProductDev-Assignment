from flask import Blueprint, request, jsonify
from app.models.models import ContactInquiry, db

contact_bp = Blueprint('contact', __name__)

@contact_bp.route('/contacts', methods=['POST'])
def create_contact():
    data = request.json
    try:
        new_contact = ContactInquiry(
            full_name=data['full_name'],
            email=data['email'],
            phone_number=data.get('phone_number'),
            company_name=data.get('company_name'),
            country=data.get('country'),
            job_title=data.get('job_title'),
            job_details=data['job_details']
        )
        db.session.add(new_contact)
        db.session.commit()
        return jsonify({'message': 'Contact inquiry created successfully!'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@contact_bp.route('/contacts', methods=['GET'])
def get_contacts():
    contacts = ContactInquiry.query.all()
    result = [{'id': c.id, 'full_name': c.full_name, 'email': c.email, 'status': c.status} for c in contacts]
    return jsonify(result), 200

@contact_bp.route('/contacts/<int:id>', methods=['PUT'])
def update_contact(id):
    data = request.json
    contact = ContactInquiry.query.get_or_404(id)
    contact.status = data.get('status', contact.status)
    db.session.commit()
    return jsonify({'message': 'Contact inquiry updated successfully!'}), 200

@contact_bp.route('/contacts/<int:id>', methods=['DELETE'])
def delete_contact(id):
    contact = ContactInquiry.query.get_or_404(id)
    db.session.delete(contact)
    db.session.commit()
    return jsonify({'message': 'Contact inquiry deleted successfully!'}), 200
