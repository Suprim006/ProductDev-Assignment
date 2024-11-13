from app import create_app, db
from app.models.models import User

app = create_app()

@app.cli.command("create-admin")
def create_admin():
    """Create an admin user"""
    username = input("Enter admin username: ")
    email = input("Enter admin email: ")
    password = input("Enter admin password: ")
    
    admin = User(
        username=username,
        email=email,
        role='admin'
    )
    admin.set_password(password)
    
    db.session.add(admin)
    db.session.commit()
    print("Admin user created successfully!")

if __name__ == '__main__':
    app.run(debug=True)