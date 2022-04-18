import flask
import mysql.connector
from flask import Blueprint, render_template, session, abort, jsonify, g as app_ctx
from werkzeug.exceptions import HTTPException

marketplace = Blueprint("marketplace", __name__)


class InputError(HTTPException):
    code = 400
    message = "Input Error"


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


# Yes this isn't a nice way to do it, but this is an MVP and I'm not willing to delve down
# the thread safe SQL connection rabbit hole for an hour longer...
def db_conn():
    return mysql.connector.connect(
        host="172.105.183.203",
        user="seng3011",
        password="@piFethi3011",
        port=5231,
        auth_plugin="mysql_native_password",
        database="marketplace",
    )


def insert_parameters(cur, params, apiID, param_type):
    # Inefficient, but it works
    for param in params:
        cur.execute(
            """
            INSERT INTO parameters (api, param_type, name, description, type)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (apiID, param_type, param["name"], param["description"], param["type"]),
        )


@marketplace.route("/marketplace/api/add", methods=["POST"])
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

    if fields is None:
        abort(400)

    conn = db_conn()
    cursor = conn.cursor()

    try:
        # Insert API
        query = """
        INSERT INTO apis(name, root, url)
        values (%s, %s, %s)
        """
        data = (name, root, url)
        cursor.execute(query, data)
    except:
        mydb.rollback()
        cursor.close()
        raise

    try:
        # Get API id
        query = """
        SELECT LAST_INSERT_ID()
        """
        cursor.execute(query)
        apiID = int(cursor.fetchone()[0])

        # Insert params
        insert_parameters(cursor, params, apiID, "param")
        # Insert fields
        insert_parameters(cursor, fields, apiID, "field")
    except:
        mydb.rollback()
        cursor.close()
        raise

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"status": "success"})


@marketplace.route("/marketplace/api/delete", methods=["POST"])
def delete_api():
    (api_id,) = get_fields_from_body(
        api_id=int,
    )

    api_id = int(api_id)

    conn = db_conn()
    cursor = conn.cursor()

    # Insert API
    query = """
    DELETE FROM apis
    WHERE id = %s
    LIMIT 1
    """
    data = (api_id,)
    cursor.execute(query, data)

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"status": "success"})


def get_params(cur, api, param_type):
    params = []

    # Get all linked params of {type}
    query = """
    SELECT name, type, description
    FROM parameters p
    WHERE p.api = %s
    AND p.param_type = %s
    """
    cur.execute(query, (api, param_type))

    result = cur.fetchall()

    for row in result:
        param = {}
        param["name"] = row[0]
        param["type"] = row[1]
        param["description"] = row[2]
        params.append(param)

    return params


@marketplace.route("/marketplace/api/get", methods=["GET"])
def get_api():

    returnAPIs = dict()

    # Gets all APIs in the marketplace
    conn = db_conn()
    cursor = conn.cursor()

    query = """
    SELECT id, name, url, root
    FROM apis
    """
    cursor.execute(query)
    result = cursor.fetchall()

    # Iterate over marketplace
    for row in result:
        api = {}
        apiID, name, url, root = row
        api["api_id"] = apiID
        api["url"] = url
        api["root"] = root
        api["params"] = get_params(cursor, apiID, "param")
        api["fields"] = get_params(cursor, apiID, "field")

        returnAPIs[name] = api

    cursor.close()
    conn.close()

    return jsonify(returnAPIs)


@marketplace.route("/marketplace/types/get", methods=["GET"])
def get_types():

    returnTypes = []

    # Gets all APIs in the marketplace
    conn = db_conn()
    cursor = conn.cursor()

    query = """
    SELECT * from types
    """
    cursor.execute(query)
    result = cursor.fetchall()

    # Iterate over marketplace
    for dataType in result:
        returnTypes.append(dataType[0])

    cursor.close()
    conn.close()

    return jsonify(returnTypes)


@marketplace.route("/marketplace/types/add", methods=["POST"])
def add_type():

    (new_type,) = get_fields_from_body(new_type=str)

    conn = db_conn()
    cursor = conn.cursor()

    # Insert type
    query = """
    INSERT INTO types(name)
    VALUES (%s)
    """
    data = (new_type,)
    cursor.execute(query, data)

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"status": "success"})
