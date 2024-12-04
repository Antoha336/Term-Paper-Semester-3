from flask import Flask, make_response
from flask_cors import CORS

from shared.database.database import session


app = Flask(__name__)
CORS(app, resources={'/*' : {"origins": "http://localhost:5002"}})

@app.route('/')
def home_page():
    return make_response({'detail': 'Server started!'}, 200)

if __name__ == "__main__":
    server = app.run(host='0.0.0.0', port=5001)
