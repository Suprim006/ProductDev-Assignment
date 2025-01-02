from flask import Blueprint, request, jsonify
from app.models.models import Article, db

article_bp = Blueprint('article', __name__)

@article_bp.route('/articles', methods=['POST'])
def create_article():
    data = request.json
    try:
        new_article = Article(
            title=data['title'],
            content=data['content'],
            author_id=data['author_id'],
            category=data.get('category'),
            image_url=data.get('image_url')
        )
        db.session.add(new_article)
        db.session.commit()
        return jsonify({'message': 'Article created successfully!'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@article_bp.route('/articles', methods=['GET'])
def get_articles():
    articles = Article.query.all()
    result = [
        {
            'id': article.id,
            'title': article.title,
            'content': article.content,
            'author_id': article.author_id,
            'author_name': article.author.username, 
            'category': article.category,
            'published_date': article.published_date,
            'image_url': article.image_url
        } for article in articles
    ]
    return jsonify(result), 200


@article_bp.route('/articles/<int:id>', methods=['PUT'])
def update_article(id):
    data = request.json
    article = Article.query.get_or_404(id)
    article.title = data.get('title', article.title)
    article.content = data.get('content', article.content)
    article.category = data.get('category', article.category)
    article.image_url = data.get('image_url', article.image_url)
    db.session.commit()
    return jsonify({'message': 'Article updated successfully!'}), 200

@article_bp.route('/articles/<int:id>', methods=['DELETE'])
def delete_article(id):
    article = Article.query.get_or_404(id)
    db.session.delete(article)
    db.session.commit()
    return jsonify({'message': 'Article deleted successfully!'}), 200

@article_bp.route('/articles/<int:id>', methods=['GET'])
def get_article_by_id(id):
    try:
        article = Article.query.get_or_404(id)
        result = {
            'id': article.id,
            'title': article.title,
            'content': article.content,
            'author_id': article.author_id,
            'author_name': article.author.username,
            'category': article.category,
            'published_date': article.published_date,
            'image_url': article.image_url
        }
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': f'Article not found: {str(e)}'}), 404
