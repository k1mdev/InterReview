from flask import Flask, g, request

app = Flask(__name__)

@app.teardown_appcontext
def close_connection(e):
    db_conn = g.pop('db_conn', None)
    if db_conn is not None:
        db_conn.close()

@app.route('/')
def home():
    return "Hello, Flask!"

@app.route('/api/attempt', methods=['POST'])
def upload_recording():
    # file = request.files.get('audio')
    ...
    # verify file is mp3, wav, etc.
    # send to gemini
    # perform additional analysis?


if __name__ == '__main__':
    app.run(debug=True)