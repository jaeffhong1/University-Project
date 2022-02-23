from flask import Flask
from flask_restplus import Api, Resource, fields, reqparse, marshal
from json import dumps

app = Flask(__name__)
app.config.setdefault("RESTPLUS_MASK_SWAGGER", False)
api = Api(
    app,
    title="SENG3011_f0b5",
    description="Analytics Platform for Predicting Epidemics",
)

"""
Models
"""
location_obj = api.schema_model(
    "Location",
    {
        "properties": {
            "country": {"type": "string", "example": "Netherlands"},
            "location": {"type": "string", "example": "North Holland Province"},
        },
        "type": "object",
    },
)

report_obj = api.schema_model(
    "Report",
    {
        "properties": {
            "diseases": {
                "type": "array",
                "items": {"type": "string"},
                "example": ["influenza a/h5n1"],
            },
            "syndromes": {
                "type": "array",
                "items": {"type": "string"},
                "example": ["Fever of unknown Origin"],
            },
            "event_date": {"type": "string", "example": "2021-11-05  xx:xx:xx"},
            "locations": {"type": "array", "items": {"$ref": "#/definitions/Location"}},
        },
        "type": "object",
    },
)

article_obj = api.schema_model(
    "Article",
    {
        "properties": {
            "url": {
                "type": "string",
                "example": "https://www.cidrap.umn.edu/news-perspective/2021/11/news-scan-nov-08-2021",
            },
            "date_of_publication": {
                "type": "string",
                "example": "2021-11-08  xx:xx:xx",
            },
            "headline": {"type": "string", "example": "News Scan for Nov 08, 2021"},
            "main_text": {
                "type": "string",
                "example": "COVID and rheumatologic disease; Increased antibiotics for sepsis; Jamestown Canyon cases; Zika in India; H5N1 avian flu outbreaks",
            },
            "reports": {"type": "array", "items": {"$ref": "#/definitions/Report"}},
        },
        "type": "object",
    },
)

""" 
Argument Parser
"""
parser = reqparse.RequestParser()
# date inclusive/disclusive?
parser.add_argument(
    "start_date",
    case_sensitive=False,
    help="news issued after this date will be returned",
)
parser.add_argument(
    "end_date",
    case_sensitive=False,
    help="news issued before this date will be returned",
)
parser.add_argument(
    "key_terms", case_sensitive=False, help="key search terms"
)  # action='split'
parser.add_argument("location", case_sensitive=False, help="geographic location")


@api.route("/location")
class LocationAPI(Resource):
    @api.expect(parser)
    @api.marshal_with(location_obj)
    @api.response(400, "start_date cannot be later than end_date")
    def get(self):
        return dumps({})


@api.route("/report")
class ReportAPI(Resource):
    @api.expect(parser)
    @api.marshal_with(report_obj)
    @api.response(400, "start_date cannot be later than end_date")
    @api.response(400, "invalid location")
    def get(self):
        return dumps({})

    # do we need an API to scrape reports by article url?


@api.route("/article")
class ArticleAPI(Resource):
    @api.expect(parser)
    @api.marshal_with(article_obj)
    @api.response(400, "start_date cannot be later than end_date")
    @api.response(400, "invalid location")
    def get(self):
        return dumps({})


if __name__ == "__main__":
    app.run(debug=True)
