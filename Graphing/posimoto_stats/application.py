from flask import Flask, render_template, g, flash, redirect, url_for, session, request
from datetime import *
import db  # if error, right-click parent directory "mark directory as" "sources root"

app = Flask(__name__)
app.config['SECRET_KEY'] = 'SUPER SECRET SKELINGTON'

# Various Form classes

@app.before_request
def before_request():
    db.open_db_connection()


@app.teardown_request
def teardown_request(exception):
    db.close_db_connection()


@app.route('/')
def index():
    return render_template('index.html')


@app.context_processor
def test_debug():

    def console_log(input_1,  input_2 = '', input_3 = ''):
        print("logging", input_1)
        print(input_2)
        print(input_3)
        return input_1

    return dict(log=console_log)



# -------------------------------------------
if '__main__' == __name__:
    app.run(ssl_context='adhoc', host='0.0.0.0',debug=True)

