from flask import Flask, make_response

app = Flask(__name__)

@app.route('/')
def home_page():
    return make_response({'detail': 'Server started!'}, 200)

if __name__ == "__main__":
    server = app.run(host='0.0.0.0', port=5001)
