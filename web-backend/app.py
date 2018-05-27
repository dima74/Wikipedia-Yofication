from flask import Flask, request, render_template, jsonify
from flask_cors import CORS
from flask_sslify import SSLify
from src.yofication import yoficate_text
from src.wikipedia import wikipedia

app = Flask(__name__)
app.register_blueprint(wikipedia)
app.config['JSON_AS_ASCII'] = False
CORS(app)
SSLify(app, permanent=True)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/yoficate', methods=["POST"])
def yoficate():
    if 'text' not in request.form:
        return 'Нет аргумента `text`', 400
    if 'minFrequency' not in request.form:
        return 'Нет аргумента minFrequency`', 400

    text = request.form['text']
    minimum_replace_frequency = int(request.form['minFrequency'])
    text_yoficated, number_replaces = yoficate_text(text, minimum_replace_frequency=minimum_replace_frequency)
    return jsonify({'text_yoficated': text_yoficated, 'number_replaces': number_replaces})


if __name__ == '__main__':
    # sys.setdefaultencoding('utf-8')
    app.run(debug=True)
