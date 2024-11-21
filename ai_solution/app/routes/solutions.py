from flask import Blueprint, request, jsonify
from app.models.models import Solution, db

solution_bp = Blueprint('solution', __name__)

@solution_bp.route('/solutions', methods=['POST'])
def create_solution():
    data = request.json
    try:
        new_solution = Solution(
            customer_id=data['customer_id'],
            title=data['title'],
            description=data.get('description'),
            industry=data.get('industry'),
            key_features=data.get('key_features'),
            image_url=data.get('image_url')
        )
        db.session.add(new_solution)
        db.session.commit()
        return jsonify({'message': 'Solution created successfully!'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@solution_bp.route('/solutions', methods=['GET'])
def get_solutions():
    solutions = Solution.query.all()
    result = [
        {
            'id': solution.id,
            'customer_id': solution.customer_id,
            'title': solution.title,
            'description': solution.description,
            'industry': solution.industry,
            'key_features': solution.key_features,
            'image_url': solution.image_url
        } for solution in solutions
    ]
    return jsonify(result), 200

@solution_bp.route('/solutions/<int:id>', methods=['PUT'])
def update_solution(id):
    data = request.json
    solution = Solution.query.get_or_404(id)
    solution.title = data.get('title', solution.title)
    solution.description = data.get('description', solution.description)
    solution.industry = data.get('industry', solution.industry)
    solution.key_features = data.get('key_features', solution.key_features)
    solution.image_url = data.get('image_url', solution.image_url)
    db.session.commit()
    return jsonify({'message': 'Solution updated successfully!'}), 200

@solution_bp.route('/solutions/<int:id>', methods=['DELETE'])
def delete_solution(id):
    solution = Solution.query.get_or_404(id)
    db.session.delete(solution)
    db.session.commit()
    return jsonify({'message': 'Solution deleted successfully!'}), 200
