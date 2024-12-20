# app/routes/chat.py
from flask import Blueprint, jsonify
from app.models.models import User, ContactInquiry, Article, PromotionalEvent, db
from sqlalchemy import func

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route('/dashboard', methods=['GET'])
def get_overview():
    # Total counts
    total_users = User.query.count()
    total_inquiries = ContactInquiry.query.count()
    total_articles = Article.query.count()
    upcoming_events = PromotionalEvent.query.filter_by(is_upcoming=True).count()

    # Response
    return jsonify({
        'total_users': total_users,
        'total_inquiries': total_inquiries,
        'total_articles': total_articles,
        'upcoming_events': upcoming_events,
    })

# Bar chart data: Count inquiries grouped by status
@dashboard_bp.route('/inquiries/status', methods=['GET'])
def get_inquiries_by_status():
    data = (
        db.session.query(ContactInquiry.status, func.count(ContactInquiry.id))
        .group_by(ContactInquiry.status)
        .all()
    )
    response = [{"status": status, "count": count} for status, count in data]
    return jsonify(response)

# Timeline data: Count inquiries by submission date
@dashboard_bp.route('/inquiries/timeline', methods=['GET'])
def get_inquiries_timeline():
    data = (
        db.session.query(func.date(ContactInquiry.submission_date), func.count(ContactInquiry.id))
        .group_by(func.date(ContactInquiry.submission_date))
        .order_by(func.date(ContactInquiry.submission_date))
        .all()
    )
    events = [
        {"date": event.event_start_date.date(), "event_name": event.event_name}
        for event in PromotionalEvent.query.filter(PromotionalEvent.event_start_date.isnot(None)).all()
    ]
    response = {
        "timeline": [{"date": str(date), "count": count} for date, count in data],
        "events": events,
    }
    return jsonify(response)