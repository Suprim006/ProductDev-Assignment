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
            job_details=data.get('job_details'),  
            company_location=data.get('company_location'),
            interested_product=data.get('interested_product'),
            current_solution=data.get('current_solution'),
            inquiry_reason=data.get('inquiry_reason')
        )
        db.session.add(new_contact)
        db.session.commit()
        return jsonify({'message': 'Contact inquiry created successfully!'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@contact_bp.route('/contacts', methods=['GET'])
def get_contacts():
    status = request.args.get('status')

    if status:
        # Use the static method to filter by status
        contacts = ContactInquiry.get_by_status(status)
    else:
        # If no status is provided, retrieve all contacts
        contacts = ContactInquiry.query.all()

    result = [{
        'id': c.id,
        'full_name': c.full_name,
        'email': c.email,
        'phone_number': c.phone_number,
        'company_name': c.company_name,
        'country': c.country,
        'job_title': c.job_title,
        'job_details': c.job_details,
        'company_location': c.company_location,
        'interested_product': c.interested_product,
        'current_solution': c.current_solution,
        'inquiry_reason': c.inquiry_reason,
        'submission_date': c.submission_date.isoformat(), 
        'status': c.status
    } for c in contacts]

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
