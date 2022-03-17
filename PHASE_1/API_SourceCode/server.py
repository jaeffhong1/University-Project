from flask import Flask, jsonify, request, make_response
import mysql.connector
from mysql.connector import errorcode
from apscheduler.schedulers.background import BackgroundScheduler
import subprocess
import json
from werkzeug.exceptions import HTTPException, BadRequest, NotFound
import requests
import os
import re
from datetime import datetime


app = Flask(__name__)

mydb = None
mydb = mysql.connector.connect(
    host="172.105.183.203",
    user="seng3011",
    password="@piFethi3011",
    port=5231,
    auth_plugin="mysql_native_password",
)


@app.errorhandler(500)
def server_error_handler(err):
    """customise message for internal server error"""
    response = err.get_response()
    response.data = json.dumps(
        {
            "message": "Potential server failure. Please try http://seng3011.duckdns.org/alive for more information",
        }
    )
    response.content_type = "application/json"
    return response


@app.errorhandler(429)
def server_error_handler(err):
    """customise message for too many requests"""
    response = err.get_response()
    response.data = json.dumps(
        {
            "message": "Too many requests received. Please try again later.",
        }
    )
    response.content_type = "application/json"
    return response


def get_description(self, environ=None, scope=None):
    return self.description


HTTPException.get_description = get_description


@app.errorhandler(HTTPException)
def default_handler(err):
    """default exception handler"""
    response = err.get_response()
    response.data = json.dumps(
        {
            "message": err.get_description(),
        }
    )
    response.content_type = "application/json"
    return response


def check_valid_date_range(start_date, end_date):
    start_date = start_date.replace("x", "0")
    end_date = end_date.replace("x", "0")
    s_date = [int(v) for v in start_date.split("T")[0].split("-")]
    s_time = [int(v) for v in start_date.split("T")[1].split(":")]
    e_date = [int(v) for v in end_date.split("T")[0].split("-")]
    e_time = [int(v) for v in end_date.split("T")[1].split(":")]
    if (s_date[0], s_date[1], s_date[2], s_time[0], s_time[1], s_time[2]) > (
        e_date[0],
        e_date[1],
        e_date[2],
        e_time[0],
        e_time[1],
        e_time[2],
    ):
        raise BadRequest("start_date cannot be later than end_date")
    today = datetime.today()
    if (s_date[0], s_date[1], s_date[2], s_time[0], s_time[1], s_time[2]) > (
        today.year,
        today.month,
        today.day,
        today.hour,
        today.minute,
        today.second,
    ):
        raise BadRequest("start_date cannot be later than today")


def convert_date(date_string):
    date_string = date_string.replace("x", "0")
    # there are inconsistencies
    try:
        return datetime.strptime(date_string, "%Y-%m-%dT%H:%M:%S")
    except ValueError:
        return datetime.strptime(date_string, "%Y-%m-%d %H:%M:%S")


def check_filter_criteria(start_date, end_date, key_terms, location):
    if any(param is None for param in [start_date, end_date, key_terms, location]):
        raise BadRequest("Missing required query parameter(s)")
    # date_format = "^([1-2][0-9]{3}|xxxx)-([0-2][0-9]|xx)-([0-3][0-9]|xx)T([0-2][0-9]|xx):([0-5][0-9]|xx):([0-5][0-9]|xx)"
    date_format = r"^(\d{4})-(\d\d|xx)-(\d\d|xx)T(\d\d|xx):(\d\d|xx):(\d\d|xx)$"
    if not re.search(date_format, start_date):
        raise BadRequest("Invalid start date expression")
    if not re.search(date_format, end_date):
        raise BadRequest("Invalid end date expression")

    check_valid_date_range(start_date, end_date)


def matches_date_range(start, end, date):
    start, end, date = convert_date(start), convert_date(end), convert_date(date)
    return start <= date <= end


@app.route("/", methods=["GET"])
def index():
    return {
        "api_documentation": "https://app.swaggerhub.com/apis/tanyawhy/SENG3011_f0b5/1.0.0",
        "authors": "f0b5",
        "source": "cidrap.umn.edu",
    }


@app.route("/alive", methods=["GET"])
def alive():
    return {"sql_connected": mydb is not None, "scrapy_online": False}


@app.route("/article/filter", methods=["GET"])
def article_filter():
    start_date = request.values.get("start_date")
    end_date = request.values.get("end_date")
    key_terms = request.values.get("key_terms")
    location = request.values.get("location")
    check_filter_criteria(start_date, end_date, key_terms, location)

    articles = []
    for article in load_full_articles_from_db():
        if not matches_date_range(start_date, end_date, article["date_of_publication"]):
            continue

        article["main_text"] = article["article_text"]
        del article["article_text"]  # keys are wrong in the database

        if article["main_text"] is None:
            continue  # what?

        if key_terms != "":
            match = False
            for kt in key_terms.split(","):
                for report in article["reports"]:
                    if kt in report["diseases"] or kt in report["syndromes"]:
                        match = True
            if not match:
                continue

        if location != "":
            match = False
            for report in article["reports"]:
                if location in reports["locations"]:
                    match = True
            if not match:
                continue

        articles.append(article)

    return jsonify(articles)


@app.route("/report/filter", methods=["GET"])
def report_filter():
    start_date = request.values.get("start_date")
    end_date = request.values.get("end_date")
    key_terms = request.values.get("key_terms")
    location = request.values.get("location")
    check_filter_criteria(start_date, end_date, key_terms, location)

    matches = []
    for article in load_full_articles_from_db():
        reports = article["reports"]
        for report in reports:
            if not matches_date_range(start_date, end_date, report["event_date"]):
                continue
            if location != "" and location not in report["locations"]:
                continue

            if key_terms != "":
                match = False
                for kt in key_terms.split(","):
                    if kt in report["diseases"] or kt in report["syndromes"]:
                        match = True
                if not match:
                    continue

            matches.append(report)
    return jsonify(matches)


@app.route("/report/from_article_url", methods=["GET"])
def report_from_article_url():
    url = request.values.get("url")
    if url is None:
        raise BadRequest("Missing required query parameter(s)")
    # if url.startswith("cidrap.umn.edu"):
    #     url = "https://www." + url
    # if url.startswith("www.cidrap.umn.edu"):
    #     url = "https://" + url
    # if "cidrap.umn.edu" not in url or requests.get(url).status_code != 200:
    # if "cidrap.umn.edu" not in url:
    if not url.startswith("/"):
        raise NotFound("Malformed url")

    for article in load_full_articles_from_db():
        if article["url"] == url:
            return jsonify(article["reports"])

    return make_response(
        jsonify({"message": "URL didn't match any known post", "url": url}), 404
    )


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


def load_reports_from_db():
    with open("db_reports/all-reports.json") as fp:
        for line in fp:
            yield json.loads(line)


def load_articles_from_db():
    with open("posts.json") as fp:
        for line in fp:
            yield json.loads(line)


def load_full_articles_from_db():
    with open("db2/full-articles.json") as fp:
        for line in fp:
            yield json.loads(line)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=36042)
