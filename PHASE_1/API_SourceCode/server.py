from flask import Flask, jsonify
import mysql.connector
from mysql.connector import errorcode
from apscheduler.schedulers.background import BackgroundScheduler
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


def test_scrape():
    subprocess.Popen(
        [
            "scrapy",
            "crawl",
            "posts",
            "-a",
            "num_pages=-1",
            "-a",
            "file_to_output=posts.json",
            "-o",
            "posts.json",
            "-t",
            "jsonlines",
        ]
    )


if __name__ == "__main__":
    test_scrape()
    scheduler = BackgroundScheduler()
    scrape_job = scheduler.add_job(test_scrape, "interval", hours=24)
    scheduler.start()
    app.run(host="0.0.0.0", port=36042)
