from flask import Flask, request, render_template
from src.yofication import yoficate_text
from src.wikipedia import wikipedia

app = Flask(__name__)
app.register_blueprint(wikipedia)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/yoficate', methods=["POST"])
def yoficate():
    if 'text' not in request.form:
        return 'Нет аргумента `text`', 401

    text = request.form['text']
    return yoficate_text(text)


if __name__ == '__main__':
    app.run(debug=True)
