from backend.app import create_app
import json

app = create_app()
with app.app_context():
    client = app.test_client()
    # Attempt signup
    resp = client.post('/api/auth/signup', json={'email':'test@example.com','password':'pass123','username':'Tester'})
    print('SIGNUP', resp.status_code)
    try:
        print(json.dumps(resp.get_json(), indent=2))
    except Exception:
        print(resp.data)
    # Attempt login
    resp2 = client.post('/api/auth/login', json={'email':'test@example.com','password':'pass123'})
    print('LOGIN', resp2.status_code)
    try:
        print(json.dumps(resp2.get_json(), indent=2))
    except Exception:
        print(resp2.data)
