from datetime import datetime, timezone
import uuid
from services import gemini_service_simple, db_service, s3_service

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

            # Inputs
            file = request.files.get('file')
            question = request.form.get('question')
            user_id = request.form.get('user_id')

            # Basic validation
            if not file:
                return jsonify({'status': 'error', 'message': 'Missing audio file.'}), 400
            if not question:
                return jsonify({'status': 'error', 'message': 'Missing question.'}), 400
            if not user_id:
                return jsonify({'status': 'error', 'message': 'Missing user_id.'}), 400

            # validate file type is mp3 or wav (MIME values: audio/mpeg, audio/wav)
            head = file.read(261)
            kind = filetype.guess(head)
            file.seek(0)
            if not kind or kind.mime not in ['audio/mpeg', 'audio/wav']:
                return jsonify({'status': 'error', 'message': 'Invalid file type. Must be MP3 or WAV.'}), 415
            
            import tempfile
            # Save uploaded audio temporarily to a file
            with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp:
                file.save(tmp.name)
                tmp_path = tmp.name  # path to the saved file

            # Evaluate with Gemini using the temp file path
            analysis = gemini_service_simple.evaluate_response(question, tmp_path)
            if 'error' in analysis:
                return jsonify({'status': 'error', 'message': f"Gemini error: {analysis['error']}"}), 502

            # generate a key to use for the S3 bucket and the pkey of the Attempt record
            attempt_uuid = uuid.uuid4()

            # save to bucket
            # reset pointer in case Gemini consumed it
            try:
                file.seek(0)
            except Exception:
                pass
            s3_service.upload_audio(file, attempt_uuid, user_id)

            # identify the user's answer as text and Gemini's feeback as JSON
            answer = analysis.get('transcription', '')
            feedback = analysis.get('feedback')

            # save attempt to DB
            db_service.save_attempt(attempt_uuid, question, answer, feedback, user_id, timestamp)

            data = {
                "attempt_id": str(attempt_uuid),
                "question": question,
                "answer": answer,
                "feedback": feedback,
                "user_id": user_id,
                "created": timestamp.isoformat(),
                "audio": s3_service.get_audio(attempt_uuid, user_id)
            }

            return jsonify({'status': 'success', 'data': data}), 200
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