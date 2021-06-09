from flask import Flask, request, jsonify, session
# from flask.ext.session import Session
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
import uuid
import json
import pickle
# from models import db, Record

app = Flask(__name__)
# sess = Session()

#solve the cross origin issue
CORS(app)

basedir = os.path.abspath(os.getcwd())
# the index of the current NL query
cur_index = 0

sql_queries = None
with open("static/result.json") as f:
    sql_queries = json.load(f)

@app.route('/get_next', methods=["GET"])
def get_next():
    global cur_index
    if cur_index < len(sql_queries):
        data = sql_queries[cur_index]
        cur_index += 1
        data['cur_index'] = cur_index
        data['total_len'] = len(sql_queries)
        return jsonify(data)
    else:
        return "EOF"
    

if __name__ == "__main__":
    app.config['SECRET_KEY'] = 'super secret key'

    # sess.init_app(app)

    app.debug = True
    app.run(host="127.0.0.1", port=5000)

