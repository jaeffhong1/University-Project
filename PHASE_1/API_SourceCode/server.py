from flask import Flask

app = Flask(__name__)


@app.route("/alive", methods=["GET"])
def alive():
    return {}


@app.route("/article/filter", methods=["GET"])
def article_filter():
    return {}


@app.route("/report/filter", methods=["GET"])
def report_filter():
    return {}


@app.route("/report/from_article_url", methods=["GET"])
def report_from_article_url():
    return {}


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=36042)
