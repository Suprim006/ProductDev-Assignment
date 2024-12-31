import google.generativeai as genai
from typing import Dict
import json
from pathlib import Path
from app.config import Config
from app.models.models import Article, PromotionalEvent
from datetime import datetime
from flask import current_app

class ChatbotService:
    def __init__(self):
        genai.configure(api_key=Config.GEMINI_API_KEY)
        self.model = genai.GenerativeModel("gemini-1.5-flash")
        self.company_context = self._load_company_context()
        self.system_prompt = self._generate_system_prompt()
        
    def _load_company_context(self) -> Dict:
        """Load company-specific information from JSON file"""
        context_path = Path("app/data/company_context.json")
        with open(context_path, 'r') as f:
            return json.load(f)
    
    def _generate_system_prompt(self) -> str:
        """Generate the system prompt that defines chatbot behavior"""
        return f"""You are an AI assistant for {self.company_context['company_name']}. 
        
        ROLE AND SCOPE:
        - You are a customer service representative who helps with questions about our company, products, and services
        - Only answer questions related to:
            1. Company information and background
            2. Products and services listed in our catalog
            3. Upcoming events and articles
            4. General inquiries about working with us
            5. Technical support for our products
            6. Queries related to problems faced by customers which can be solved by our products and services (e.g. help to become software engineer using our product, etc.)
        
        DO NOT answer questions about:
        - Topics unrelated to our company or services
        - Personal advice or recommendations
        - Competitor information
        - Sensitive business information
        - Political, social, or controversial topics
        
        If you receive questions outside your scope, respond with:
        "I can only assist with questions related to {self.company_context['company_name']}, our products, and services. Please rephrase your question or contact our support team for other inquiries."
        
        COMPANY CONTEXT:
        {json.dumps(self.company_context, indent=2)}
        """

    def _get_relevant_db_content(self, user_message: str) -> str:
        """Retrieve relevant content from database based on user query"""
        relevant_content = []
        
        # Get recent articles
        articles = Article.query.limit(5).all()
        if articles:
            relevant_content.append("Recent Articles:")
            for article in articles:
                relevant_content.append(f"- {article.title}: {article.content[:200]}...")
        
        # Get upcoming events
        events = PromotionalEvent.query.filter(
            PromotionalEvent.event_start_date >= datetime.utcnow(),
            PromotionalEvent.is_upcoming == True
        ).limit(3).all()
        if events:
            relevant_content.append("\nUpcoming Events:")
            for event in events:
                relevant_content.append(
                    f"- {event.event_name} ({event.event_start_date.strftime('%Y-%m-%d')}): {event.event_description}"
                )
        
        return "\n".join(relevant_content)

    async def get_ai_response(self, user_message: str) -> str:
        """Generate AI response using RAG approach"""
        try:
            # Initialize chat with system prompt
            chat = self.model.start_chat(history=[])
            
            # Get relevant database content
            with current_app.app_context():
                db_context = self._get_relevant_db_content(user_message)
            
            # Construct full context for the current query
            current_context = f"""
            {self.system_prompt}
            
            CURRENT RELEVANT CONTENT:
            {db_context}
            
            USER QUERY: {user_message}
            """
            
            # Generate response
            response = chat.send_message(current_context)
            return response.text or "I apologize, but I encountered an issue processing your request."
            
        except Exception as e:
            print(f"Error generating AI response: {str(e)}")
            return "I apologize, but I'm having trouble processing your request right now. Please try again later."