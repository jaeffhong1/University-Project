import sys
import os
import json
import pytest

sys.path.append(os.path.join(os.getcwd(), "../API_SourceCode"))

import server


@pytest.fixture()
def app():
    app = server.app
    app.config.update(
        {
            "TESTING": True,
        }
    )
    yield app


@pytest.fixture()
def client(app):
    return app.test_client()


def test_article_filter_missing_param(client):
    expected_response = {"message": "Missing required query parameter(s)"}
    # test missing location
    url = "/article/filter?start_date=2019-10-01Txx:xx:xx&end_date=2022-03-01Txx:xx:xx&key_terms=outbreak"
    response = client.get(url)
    assert response.status_code == 400
    assert json.loads(str(response.get_data(), "utf-8")) == expected_response
    # test missing key_terms
    url = "/article/filter?start_date=2019-10-01Txx:xx:xx&end_date=2022-03-01Txx:xx:xx&location=california"
    response = client.get(url)
    assert response.status_code == 400
    assert json.loads(str(response.get_data(), "utf-8")) == expected_response
    # test missing end_date
    url = "/article/filter?start_date=2019-10-01Txx:xx:xx&key_terms=outbreak&location=california"
    response = client.get(url)
    assert response.status_code == 400
    assert json.loads(str(response.get_data(), "utf-8")) == expected_response
    # test missing start_date
    url = "/article/filter?end_date=2019-10-01Txx:xx:xx&key_terms=outbreak&location=california"
    response = client.get(url)
    assert response.status_code == 400
    assert json.loads(str(response.get_data(), "utf-8")) == expected_response
    # test missing two or more parameters
    url = "/article/filter?key_terms=outbreak&location=california"
    response = client.get(url)
    assert response.status_code == 400
    assert json.loads(str(response.get_data(), "utf-8")) == expected_response
    url = "/article/filter?location=california"
    response = client.get(url)
    assert response.status_code == 400
    assert json.loads(str(response.get_data(), "utf-8")) == expected_response
    # test without any parameters
    url = "/article/filter"
    response = client.get(url)
    assert response.status_code == 400
    assert json.loads(str(response.get_data(), "utf-8")) == expected_response


def test_report_filter_missing_param(client):
    expected_response = {"message": "Missing required query parameter(s)"}
    # test missing location
    url = "/report/filter?start_date=2019-10-01Txx:xx:xx&end_date=2022-03-01Txx:xx:xx&key_terms=outbreak"
    response = client.get(url)
    assert response.status_code == 400
    assert json.loads(str(response.get_data(), "utf-8")) == expected_response
    # test missing key_terms
    url = "/report/filter?start_date=2019-10-01Txx:xx:xx&end_date=2022-03-01Txx:xx:xx&location=california"
    response = client.get(url)
    assert response.status_code == 400
    assert json.loads(str(response.get_data(), "utf-8")) == expected_response
    # test missing end_date
    url = "/report/filter?start_date=2019-10-01Txx:xx:xx&key_terms=outbreak&location=california"
    response = client.get(url)
    assert response.status_code == 400
    assert json.loads(str(response.get_data(), "utf-8")) == expected_response
    # test missing start_date
    url = "/report/filter?end_date=2019-10-01Txx:xx:xx&key_terms=outbreak&location=california"
    response = client.get(url)
    assert response.status_code == 400
    assert json.loads(str(response.get_data(), "utf-8")) == expected_response
    # test missing two or more parameters
    url = "/report/filter?key_terms=outbreak&location=california"
    response = client.get(url)
    assert response.status_code == 400
    assert json.loads(str(response.get_data(), "utf-8")) == expected_response
    url = "/report/filter?location=california"
    response = client.get(url)
    assert response.status_code == 400
    assert json.loads(str(response.get_data(), "utf-8")) == expected_response
    # test without any parameters
    url = "/report/filter"
    response = client.get(url)
    assert response.status_code == 400
    assert json.loads(str(response.get_data(), "utf-8")) == expected_response


def test_article_invalid_start_date(client):
    expected_response = {"message": "start_date cannot be later than today"}
    url = "/article/filter?start_date=2023-03-01Txx:xx:xx&end_date=2023-03-01Txx:xx:xx&key_terms=outbreak&location=california"
    response = client.get(url)
    assert response.status_code == 400
    assert json.loads(str(response.get_data(), "utf-8")) == expected_response


def test_report_invalid_start_date(client):
    expected_response = {"message": "start_date cannot be later than today"}
    url = "/report/filter?start_date=2023-03-01Txx:xx:xx&end_date=2023-03-01Txx:xx:xx&key_terms=outbreak&location=california"
    response = client.get(url)
    assert response.status_code == 400
    assert json.loads(str(response.get_data(), "utf-8")) == expected_response


def test_article_invalid_date_range(client):
    expected_response = {"message": "start_date cannot be later than end_date"}
    url = "/article/filter?start_date=2022-03-10Txx:xx:xx&end_date=2022-03-01Txx:xx:xx&key_terms=outbreak&location=california"
    response = client.get(url)
    assert response.status_code == 400
    assert json.loads(str(response.get_data(), "utf-8")) == expected_response


def test_report_invalid_date_range(client):
    expected_response = {"message": "start_date cannot be later than end_date"}
    url = "/report/filter?start_date=2022-03-10Txx:xx:xx&end_date=2022-03-01Txx:xx:xx&key_terms=outbreak&location=california"
    response = client.get(url)
    assert response.status_code == 400
    assert json.loads(str(response.get_data(), "utf-8")) == expected_response


def test_missing_url(client):
    expected_response = {"message": "Missing required query parameter(s)"}
    url = "/report/from_article_url"
    response = client.get(url)
    assert response.status_code == 400
    assert json.loads(str(response.get_data(), "utf-8")) == expected_response


def test_malformed_url(client):
    expected_response = {"message": "Malformed url"}
    # test non-CIDRAP url
    url = "/report/from_article_url?url=www.example.com"
    response = client.get(url)
    assert response.status_code == 404
    assert json.loads(str(response.get_data(), "utf-8")) == expected_response
    # test invalid urls
    url = "/report/from_article_url?url=abcdefg"
    response = client.get(url)
    assert response.status_code == 404
    assert json.loads(str(response.get_data(), "utf-8")) == expected_response
    url = "/report/from_article_url?url=http://non-existing.com/"
    response = client.get(url)
    assert response.status_code == 404
    assert json.loads(str(response.get_data(), "utf-8")) == expected_response
