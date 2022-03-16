from flask import Flask, jsonify, request
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
    return response


with open("./report_parser/key_terms_list.json") as fp:
    KEY_TERMS = [kt["name"].lower() for kt in json.load(fp)]


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


def check_filter_criteria(start_date, end_date, key_terms, location):
    if any(param is None for param in [start_date, end_date, key_terms, location]):
        raise BadRequest("Missing required query parameter(s)")
    date_format = "^([1-2][0-9]{3}|xxxx)-([0-2][0-9]|xx)-([0-3][0-9]|xx)T([0-2][0-9]|xx):([0-5][0-9]|xx):([0-5][0-9]|xx)"
    if not re.search(date_format, start_date) or not re.search(date_format, end_date):
        raise BadRequest("Invalid date expression")
    check_valid_date_range(start_date, end_date)
    if key_terms.lower() not in KEY_TERMS:
        raise BadRequest("Unknown key_term")


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
    return {}


@app.route("/report/filter", methods=["GET"])
def report_filter():
    start_date = request.values.get("start_date")
    end_date = request.values.get("end_date")
    key_terms = request.values.get("key_terms")
    location = request.values.get("location")
    check_filter_criteria(start_date, end_date, key_terms, location)
    return {}


@app.route("/report/from_article_url", methods=["GET"])
def report_from_article_url():
    url = request.values.get("url")
    if url.startswith("cidrap.umn.edu"):
        url = "https://www." + url
    if url.startswith("www.cidrap.umn.edu"):
        url = "https://" + url
    if "cidrap.umn.edu" not in url or requests.get(url).status_code != 200:
        raise NotFound("Malformed url")
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
