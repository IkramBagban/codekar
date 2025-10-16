"""
Quick test script to verify API endpoints
Run this after starting the server with: uv run uvicorn main:app --reload
"""

import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_register():
    """Test user registration"""
    print("\n=== Testing Registration ===")
    url = f"{BASE_URL}/api/v1/auth/register"
    data = {
        "email": "testuser@example.com",
        "password": "testpass123",
        "name": "Test User"
    }
    
    response = requests.post(url, json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.json()

def test_login():
    """Test user login"""
    print("\n=== Testing Login ===")
    url = f"{BASE_URL}/api/v1/auth/login"
    data = {
        "email": "testuser@example.com",
        "password": "testpass123"
    }
    
    response = requests.post(url, json=data)
    print(f"Status: {response.status_code}")
    result = response.json()
    print(f"Response: {json.dumps(result, indent=2)}")
    
    if result.get("success") and result.get("data"):
        return result["data"]["token"]
    return None

def test_get_me(token):
    """Test getting current user info"""
    print("\n=== Testing Get Current User ===")
    url = f"{BASE_URL}/api/v1/users/me"
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    response = requests.get(url, headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

def test_get_users(token):
    """Test getting all users"""
    print("\n=== Testing Get All Users ===")
    url = f"{BASE_URL}/api/v1/users/"
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    response = requests.get(url, headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

if __name__ == "__main__":
    try:
        # Test registration
        register_result = test_register()
        
        # Test login
        token = test_login()
        
        if token:
            # Test protected routes with token
            test_get_me(token)
            test_get_users(token)
        else:
            print("\n❌ Login failed, cannot test protected routes")
            
    except requests.exceptions.ConnectionError:
        print("\n❌ Error: Cannot connect to server. Make sure it's running on http://127.0.0.1:8000")
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
