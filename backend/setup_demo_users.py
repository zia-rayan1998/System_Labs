"""
Quick script to create demo users for testing
Run this to ensure demo accounts exist
"""
from backend.app import create_app
from backend.models import db, User

def create_demo_users():
    app = create_app()
    
    with app.app_context():
        # Create admin user
        admin_user = User.query.filter_by(email='admin@example.com').first()
        if not admin_user:
            admin_user = User(
                id='admin-1',
                email='admin@example.com',
                username='Admin',
                role='admin'
            )
            admin_user.set_password('admin123')
            db.session.add(admin_user)
            print("✅ Created admin user: admin@example.com / admin123")
        else:
            print("ℹ️  Admin user already exists: admin@example.com / admin123")
        
        # Create regular user
        regular_user = User.query.filter_by(email='user@example.com').first()
        if not regular_user:
            regular_user = User(
                id='user-1',
                email='user@example.com',
                username='TestUser',
                role='user'
            )
            regular_user.set_password('user123')
            db.session.add(regular_user)
            print("✅ Created user: user@example.com / user123")
        else:
            print("ℹ️  Regular user already exists: user@example.com / user123")
        
        db.session.commit()
        print("\n✅ Demo users are ready!")
        print("\nYou can now sign in with:")
        print("  Admin: admin@example.com / admin123")
        print("  User:  user@example.com / user123")

if __name__ == '__main__':
    create_demo_users()

