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


def check_filter_criteria_internal(start_date, end_date, key_terms, location, timezone):
    if any(param is None for param in [start_date, end_date]):
        raise BadRequest("Missing required query parameter(s)")
    date_format = r"^([1-2][0-9]{3}|xxxx)-(0[1-9]|1[0-2]|xx)-(0[1-9]|[12][0-9]|3[01]|xx)T([0-2][0-9]|xx):([0-5][0-9]|xx):([0-5][0-9]|xx)$"
    if not re.search(date_format, start_date) or not re.search(date_format, end_date):
        raise BadRequest("Invalid date expression")
    check_valid_date_range(start_date, end_date)
    if timezone not in ALL_TIMEZONES:
        raise BadRequest("Invalid timezone expression")
    if location != "" and find_geo_id(location) < 0:
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

def insert_parameters(cur, params, apiID, param_type):

    # Inefficient, but it works
    for param in params:
        cur.execute(
            """
            INSERT INTO parameters (api, param_type, name, decription, type)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (apiID, param_type, param['name'], param['description'], param['type'])
        )


@app.route("/marketplace/api/add", methods=["POST"])
def add_api():
    name, root, url, params, fields = get_fields_from_body(
        name=str,
        root=str,
        url=str,
        params=list,
        fields=list,
    )
    
    # name = "NSW COVID LGA"
    # url = "https://nswdac-covid-19-postcode-heatmap.azurewebsites.net/datafiles/postcode_daily_cases.json"
    # root = "data"
    
    cursor = mydb.cursor()

    # Insert API
    query = """
    INSERT INTO apis(name, root, url)
    values (%s, %s, %s)
    """
    data = (name, root, url)

    try:
        cursor.execute(query, data)
        cursor.commit()
    except:
        conn.rollback()
        abort(500)

    # Get API id
    query = """
    SELECT LAST_INSERT_ID()
    """
    cursor.execute(query)
    apiID = int(cursor.fetchone()[0])

    # Insert params
    insert_parameters(cursor, params, apiID, "param")

    # Insert fields
    if fields is None:
        abort(500)
    insert_parameters(cursor, fields, apiID, "field")

    # query = ""
    # data = (test,)
    # cursor.execute(query, data)
    # result = cursor.fetchall()
    # for x in result:
    #     print(x)

    cursor.close()

    mydb.close()

def get_params(cur, api, param_type):
    params = []

    # Get all linked params of {type}
    cursor = mydb.cursor()
    query = """
    SELECT name, type, description
    FROM parameters p
    WHERE p.api = %s
    AND p.param_type = %s
    """
    cursor.execute(query, (api,param_type))
    result = cursor.fetchall()

    for row in result:
        param = {}
        param["name"] = row[0]
        param["type"] = row[1]
        param["description"] = row[2]
        params.append(param)

    return params

@app.route("/marketplace/api/get", methods=["GET"])
def get_api():
    
    returnAPIs = {}

    # Gets all APIs in the marketplace
    cursor = mydb.cursor()
    query = """
    SELECT id, name, url, root
    FROM apis
    """
    cursor.execute(query)
    result = cursor.fetchall()
    
    # Iterate over marketplace
    for api in result:
        api = {}
        apiID, name, url, root = api
        api['url'] = url
        api['root'] = root
        api['params'] = get_params(cursor, apiID, "param")
        api['fields'] = get_params(cursor, apiID, "field")

        returnAPIS[name] = api

    return jsonify(returnAPIs)

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


def get_matching_reports_internal(start_date, end_date, key_terms, location, timezone):
    if timezone is None:
        timezone = CIDRAP_TIMEZONE
    if key_terms is None:
        key_terms = ""
    if location is None:
        location = ""
    check_filter_criteria_internal(start_date, end_date, key_terms, location, timezone)

    matches = []
    for article in load_full_articles_from_db():
        reports = article["reports"]
        for report in reports:
            if not matches_date_range(
                start_date, end_date, report["event_date"], timezone
            ):
                continue
            if location != "" and not location_matches(location, report["locations"]):
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
    matches = get_matching_reports_internal(
        start_date, end_date, key_terms, location, timezone
    )
    for report in matches:
        relevant_locations = []
        for location in report["locations"]:
            location_hierarchy = find_hierarchy2(int(location["geonames_id"]))
            rel_location = ""
            if len(location_hierarchy) == 4:
                rel_location = {
                    "location": convert_geo_tup(location_hierarchy[0]),
                    "state": convert_geo_tup(location_hierarchy[1]),
                    "country": convert_geo_tup(location_hierarchy[2]),
                    "continent": convert_geo_tup(location_hierarchy[3]),
                }
            elif len(location_hierarchy) == 3:
                rel_location = {
                    "location": convert_geo_tup(location_hierarchy[0]),
                    "state": "",
                    "country": convert_geo_tup(location_hierarchy[1]),
                    "continent": convert_geo_tup(location_hierarchy[2]),
                }
            elif len(location_hierarchy) == 2:
                rel_location = {
                    "location": convert_geo_tup(location_hierarchy[0]),
                    "state": "",
                    "country": "",
                    "continent": convert_geo_tup(location_hierarchy[1]),
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
    location_info = {}
    location_info["geoid"] = geo_tuple[0]
    location_info["name"] = geo_tuple[1]
    location_info["lat"] = geo_tuple[2]
    location_info["lng"] = geo_tuple[3]
    return location_info


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

def get_fields_from_body(**fields_type):
    """
    foo, bar = get_fields_from_body(foo=str, bar=list)
    foo # guaranted to be a string
    bar # guaranted to be a list
    The order of the argument must match the order of the variables on LHS.
    Careful, if you are using one value, you have to do:
    foo, = get_fields_from_body(foo=str)
    #  ^ notice the extra comma
    For post requests (when json is specified) each type can be a list of types
    foo, bar = get_fields_from_body(foo=[int, str, type(None)], bar=list)
    """

    if flask.request.method == "GET":
        body = dict(flask.request.args)
    elif flask.request.method == "POST":
        if not flask.request.is_json:
            raise InputError("expect JSON response")
        body = flask.request.get_json()
    else:
        raise InputError(f"invalid method {flask.request.method}")

    if type(body) != dict:
        raise InputError(f"any JSON body should be an object (dict), got {type(body)}")

    for field_name, field_type in fields_type.items():
        if field_name not in body:
            raise InputError(f"field name {field_name!r} missing from body")

        if type(field_type) == list:
            for element in field_type:
                assert (
                    type(element) == type
                ), f"if you are providing a list, you should provide a list of types ({element} isn't a type)"

        elif type(field_type) != type:
            raise ValueError(
                f"You, the developer, made a mistake. {field_type} isn't a type. "
                f"A type is something like str or int for example."
                f"Feel free to message Mathieu if you want some help"
            )

        if flask.request.method == "GET":
            if field_type == bool:
                if body[field_name] in ("true", "True", "TRUE"):
                    body[field_name] = True
                elif body[field_name] in ("false", "False", "FALSE"):
                    body[field_name] = False
                else:
                    raise InputError(
                        f"Field {field_name!r} should be a boolean, got {body[field_name]!r}"
                    )
            elif field_type == int:
                try:
                    body[field_name] = int(body[field_name])
                except ValueError as e:
                    raise InputError(
                        f"Field {field_name!r} should be an int, got {body[field_name]!r}"
                    )
            elif field_type != str:
                raise ValueError(
                    f"You, the developer, made a mistake. On a GET request, the only accepted"
                    f"field types are (bool, int, str)"
                )
        else:
            if type(field_type) == list:
                if type(body[field_name]) not in field_type:
                    raise InputError(
                        f"Allowed field types are {field_type}, got {type(body[field_name])}"
                    )
            elif type(body[field_name]) != field_type:
                raise InputError(
                    f"field {field_name!r} is of wrong type, expected {field_type}, got {type(body[field_name])}"
                )

        yield body[field_name]

    # if you find a parameter that isn't required, raise an error
    for key in body:
        if key not in fields_type:
            raise InputError(f"invalid parameter: {key} is unused")

if __name__ == "__main__":
    test_scrape()
    scheduler = BackgroundScheduler()
    scrape_job = scheduler.add_job(test_scrape, "interval", hours=24)
    scheduler.start()
    app.run(host="0.0.0.0", port=36042)
