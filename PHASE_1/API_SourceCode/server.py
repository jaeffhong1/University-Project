from flask import Flask, jsonify
import mysql.connector
from mysql.connector import errorcode
import subprocess


app = Flask(__name__)

mydb = None
mydb = mysql.connector.connect(
    host="172.105.183.203",
    user="seng3011",
    password="@piFethi3011",
    port=5231,
    auth_plugin="mysql_native_password",
)


@app.route("/alive", methods=["GET"])
def alive():
    return {"sql_connected": mydb is not None, "scrapy_online": False}


@app.route("/article/filter", methods=["GET"])
def article_filter():
    return {}


@app.route("/report/filter", methods=["GET"])
def report_filter():
    return {}


@app.route("/report/from_article_url", methods=["GET"])
def report_from_article_url():
    return {}

@app.route("/test/scrape")
def test_scrape():
    subprocess.check_output(['scrapy', 'crawl', 'posts', "-o", "posts.json"])
    return {'status': 'done'}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=36042)
