import logging
from flask import Flask, jsonify, request, make_response, current_app, g as app_ctx
import mysql.connector
from mysql.connector import errorcode
from apscheduler.schedulers.background import BackgroundScheduler
import subprocess
import json
from werkzeug.exceptions import HTTPException, BadRequest
import requests
import os
import re
from datetime import datetime
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import time
from geoid import find_geo_id
from idToHierarchy import find_hierarchy2
import pytz

from scrapy.selector import Selector

app = Flask(__name__)
logging.basicConfig(
    filename="server.log",
    level=logging.DEBUG,
    format="[%(asctime)s] [%(levelname)s] [%(message)s]",
)

mydb = None
mydb = mysql.connector.connect(
    host="172.105.183.203",
    user="seng3011",
    password="@piFethi3011",
    port=5231,
    auth_plugin="mysql_native_password",
)

limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["200 per minute"],
)


@app.before_request
def logging_before():
    # Store the start time for the request
    app_ctx.start_time = time.perf_counter()


@app.after_request
def logging_after(response):
    # Get total time in milliseconds
    total_time = time.perf_counter() - app_ctx.start_time
    time_in_ms = int(total_time * 1000)
    # Log the time taken for the endpoint
    current_app.logger.info(
        "%s ms %s %s %s", time_in_ms, request.method, request.path, dict(request.args)
    )
    return response


@app.errorhandler(500)
def server_error_handler(err):
    """customise message for internal server error"""
    response = err.get_response()
    response.data = json.dumps(
        {
            "message": "Potential server failure. Please try http://seng3011.duckdns.org/alive for more information or contact the development team.",
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


@app.errorhandler(404)
def server_error_handler(err):
    """customise message for too many requests"""
    response = err.get_response()
    response.data = json.dumps(
        {
            "message": "It looks like you've reached a URL that doesn't exist. Please check the API documentation on https://app.swaggerhub.com/apis/tanyawhy/SENG3011_f0b5/1.0.0#/",
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


ALL_TIMEZONES = pytz.all_timezones
CIDRAP_TIMEZONE = "US/Central"


def check_filter_criteria(start_date, end_date, key_terms, location, timezone):
    if any(param is None for param in [start_date, end_date, key_terms, location]):
        raise BadRequest("Missing required query parameter(s)")
    date_format = r"^([1-2][0-9]{3}|xxxx)-(0[1-9]|1[0-2]|xx)-(0[1-9]|[12][0-9]|3[01]|xx)T([0-2][0-9]|xx):([0-5][0-9]|xx):([0-5][0-9]|xx)$"
    if not re.search(date_format, start_date) or not re.search(date_format, end_date):
        raise BadRequest("Invalid date expression")
    check_valid_date_range(start_date, end_date)
    if timezone not in ALL_TIMEZONES:
        raise BadRequest("Invalid timezone expression")
    if find_geo_id(location) < 0:
        raise BadRequest("Invalid location")


def convert_date(date_string, timezone):
    date_string = date_string.replace("x", "0")
    cidrap_timezone = pytz.timezone(CIDRAP_TIMEZONE)
    input_timezone = pytz.timezone(timezone)
    # there are inconsistencies
    try:
        dt = datetime.strptime(date_string, "%Y-%m-%dT%H:%M:%S")
    except ValueError:
        dt = datetime.strptime(date_string, "%Y-%m-%d %H:%M:%S")
    return cidrap_timezone.localize(dt).astimezone(input_timezone)


def matches_date_range(start, end, date, timezone=CIDRAP_TIMEZONE):
    start, end, date = (
        convert_date(start, timezone),
        convert_date(end, timezone),
        convert_date(date, timezone),
    )
    return start <= date <= end


@app.route("/", methods=["GET"])
def index():
    return {
        "api_documentation": "https://app.swaggerhub.com/apis/tanyawhy/SENG3011_f0b5/1.0.0",
        "authors": "f0b5",
        "source": "cidrap.umn.edu",
    }


@app.route("/alive", methods=["GET"])
@limiter.exempt
def alive():
    return {"sql_connected": mydb is not None, "scrapy_online": True}


@app.route("/article/filter", methods=["GET"])
def article_filter():
    start_date = request.values.get("start_date")
    end_date = request.values.get("end_date")
    key_terms = request.values.get("key_terms")
    location = request.values.get("location")
    timezone = request.values.get("timezone")
    if timezone is None:
        timezone = CIDRAP_TIMEZONE
    check_filter_criteria(start_date, end_date, key_terms, location, timezone)

    articles = []
    for article in load_full_articles_from_db():
        if not matches_date_range(
            start_date, end_date, article["date_of_publication"], timezone
        ):
            continue

        article["main_text"] = article["article_text"]
        del article["article_text"]  # keys are wrong in the database

        if article["main_text"] is None:
            continue  # what?

        if key_terms != "":
            match = False
            for kt in key_terms.split(","):
                kt = kt.lower()
                if kt in article["main_text"].lower():
                    match = True
                for report in article["reports"]:
                    if kt in (d.lower() for d in report["diseases"]) or kt in (
                        s.lower() for s in report["syndromes"]
                    ):
                        match = True
            if not match:
                continue

        if location != "":
            match = False
            for report in article["reports"]:
                if location_matches(location, report["locations"]):
                    match = True
            if not match:
                continue

        valid_reports = []
        for report in article["reports"]:
            convert_location_in_report(report)
            if len(report["locations"]) > 0:
                valid_reports.append(report)

        if len(valid_reports) > 0:
            article["reports"] = valid_reports
            articles.append(article)

        convert_main_text_article(article)
    return jsonify(articles)


def location_matches(location, locations):
    location = location.lower()
    return location in (l.lower() for l in locations)


def get_matching_reports(start_date, end_date, key_terms, location, timezone):
    if timezone is None:
        timezone = CIDRAP_TIMEZONE
    check_filter_criteria(start_date, end_date, key_terms, location, timezone)

    matches = []
    for article in load_full_articles_from_db():
        reports = article["reports"]
        for report in reports:
            if not matches_date_range(
                start_date, end_date, report["event_date"], timezone
            ):
                continue
            if not location_matches(location, report["locations"]):
                continue

            if key_terms != "":
                match = False
                for kt in key_terms.split(","):
                    kt = kt.lower()
                    if kt in (d.lower() for d in report["diseases"]) or kt in (
                        s.lower() for s in report["syndromes"]
                    ):
                        match = True
                if not match:
                    continue

            convert_location_in_report(report)
            if len(report["locations"]) > 0:
                matches.append(report)
    return matches


@app.route("/report/filter", methods=["GET"])
def report_filter():
    start_date = request.values.get("start_date")
    end_date = request.values.get("end_date")
    key_terms = request.values.get("key_terms")
    location = request.values.get("location")
    timezone = request.values.get("timezone")
    matches = get_matching_reports(start_date, end_date, key_terms, location, timezone)
    return jsonify(matches)


@app.route("/report/from_article_url", methods=["GET"])
@limiter.limit("10 per minute")
def report_from_article_url():
    url = request.values.get("url")
    if url is None:
        raise BadRequest("Missing required query parameter(s)")
    if url.startswith("cidrap.umn.edu"):
        url = "https://www." + url
    if url.startswith("www.cidrap.umn.edu"):
        url = "https://" + url
    if "cidrap.umn.edu" not in url or requests.get(url).status_code != 200:
        raise BadRequest("Malformed url")
    url = url.replace("https://www.cidrap.umn.edu", "")
    for article in load_full_articles_from_db():
        if article["url"] == url:
            return jsonify(article["reports"])
    raise BadRequest("URL didn't match any known post")


@app.route("/report/filter/internal", methods=["GET"])
def report_filter_for_internal_use():
    start_date = request.values.get("start_date")
    end_date = request.values.get("end_date")
    key_terms = request.values.get("key_terms")
    location = request.values.get("location")
    timezone = request.values.get("timezone")
    matches = get_matching_reports(start_date, end_date, key_terms, location, timezone)
    for report in matches:
        relevant_locations = []
        for location in report["locations"]:
            location_hierarchy = find_hierarchy2(int(location["geonames_id"]))
            rel_location = {
                "location": convert_geo_tup(location_hierarchy[0]),
                "state": convert_geo_tup(location_hierarchy[1]),
                "country": convert_geo_tup(location_hierarchy[2]),
                "continent": convert_geo_tup(location_hierarchy[3]),
            }
            relevant_locations.append(rel_location)
        report["locations"] = relevant_locations
    return jsonify(matches)


@app.route("/location/hierarchy", methods=["GET"])
def get_country_by_geoid():
    geoid = request.values.get("geoid")
    if geoid is None or not geoid.isdigit():
        raise BadRequest("Geoid must be a number")
    location_hierarchy = find_hierarchy2(int(geoid))
    result = {}
    result["location"] = convert_geo_tup(location_hierarchy[0])
    result["state"] = convert_geo_tup(location_hierarchy[1])
    result["country"] = convert_geo_tup(location_hierarchy[2])
    result["continent"] = convert_geo_tup(location_hierarchy[3])
    return jsonify(result)


def convert_geo_tup(geo_tuple):
    locaiton_info = {}
    locaiton_info["geoid"] = geo_tuple[0]
    locaiton_info["name"] = geo_tuple[1]
    locaiton_info["lat"] = geo_tuple[2]
    locaiton_info["lng"] = geo_tuple[3]
    return locaiton_info


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
    path_to_articles = os.path.join(
        os.path.dirname(os.path.abspath(__file__)), "db2", "full-articles.json"
    )
    with open(path_to_articles) as fp:
        for line in fp:
            yield json.loads(line)


def convert_location_in_report(report):
    for i in range(len(report["locations"])):
        geoname_ids = []
        geoname_id = find_geo_id(report["locations"][i])
        if geoname_id > 0:
            geoname_ids.append({"geonames_id": geoname_id})
    report["locations"] = geoname_ids


def convert_main_text_article(article):
    html_text = Selector(text=article["main_text"])
    main_text = html_text.css(
        "div.fieldlayout-region-body.fieldlayout-region-body-full *::text"
    ).getall()
    whole_main_text = "".join(main_text)
    article["main_text"] = whole_main_text


if __name__ == "__main__":
    test_scrape()
    scheduler = BackgroundScheduler()
    scrape_job = scheduler.add_job(test_scrape, "interval", hours=24)
    scheduler.start()
    app.run(host="0.0.0.0", port=36042)
