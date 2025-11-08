from datetime import datetime, timezone
from services import gemini_service, db_service, s3_service
import uuid

from flask import Flask, g, request, jsonify
import filetype

app = Flask(__name__)

@app.teardown_appcontext
def close_connection(e):
    db_conn = g.pop('db_conn', None)
    if db_conn is not None:
        db_conn.close()

@app.route('/')
def home():
    return "Hello, Flask!"

@app.route('/api/attempt', methods=['POST', 'GET'])
def attempt():
    if request.method == 'POST': # POST request
        try:
            # get timestamp before any processing begins
            timestamp = datetime.now(timezone.utc)

            # validate file type is mp3 or wav
            file = request.files.get('audio')
            kind = filetype.guess(file.read(261)) 
            file.seek(0)
            if not kind or not kind.mime in ['mp3', 'wav']:
                return jsonify({'status': 'error', 'message': 'Invalid file type. File must be a .mp3 or .wav.'}), 415
            
            # get feedback from Gemini
            question = request.form.get('question')
            analysis = gemini_service.analyze_interview(question, file)

            # generate a key to use for the S3 bucket and the pkey of the Attempt record
            _uuid = uuid.uuid4()
            user_id = request.form.get('user_id')

            # save to bucket
            s3_service.upload_audio(_uuid, user_id)

            # identify the user's answer as text and Gemini's feeback as JSON
            answer = analysis.transcript
            feedback = {
                "overall_feedback": analysis.overall_feedback,
                "timestamped_feedback": analysis.timestamped_feedback
            }

            # save attempt to DB
            db_service.save_attempt(_uuid, question, answer, feedback, user_id, timestamp)

            return jsonify({'status': 'success'}), 200
        except Exception as e:
            return jsonify({'status': 'error', 'message': f'Error saving to DB: {e}'}), 500

    else: # GET requests
        try:
            if request.args.get('attempt_id') is not None and request.args.get('user_id') is not None: 
                # need attempt_id and user_id to retrieve the specified attempt
                attempt_id = request.args.get('attempt_id')
                user_id = request.args.get('user_id')
                # fetch attempt from DB
                res = db_service.get_attempt_by_id(attempt_id)
                # get audio file
                audio_file = s3_service.get_audio(attempt_id, user_id)
                res['audio'] = audio_file
                return jsonify({'status': 'success', 'data': res}), 200
            elif request.args.get('user_id') is not None:
                # if only the user_id is specified, then retrieve all attempts associated with the user
                # this is to be displayed on the sidebar
                user_id = request.args.get('user_id')
                # fetch attempts from DB
                res = db_service.get_attempts_by_user_id(user_id)
                return jsonify({'status': 'success', 'data': res}), 200
            
        except Exception as e:
            return jsonify({'status': 'error', 'message': f'Error fetching from DB: {e}'}), 500
          
if __name__ == '__main__':
    app.run(debug=True)