import requests


def test_article_filter_missing_param():
    expected_response = {"message": "Missing required query parameter(s)"}
    # test missing location
    url = "http://seng3011.duckdns.orgarticle/filter?start_date=2019-10-01Txx:xx:xx&end_date=2022-03-01Txx:xx:xx&key_terms=outbreak"
    response = requests.get(url)
    assert response.status_code == 400
    assert response.json() == expected_response
    # test missing key_terms
    url = "http://seng3011.duckdns.orgarticle/filter?start_date=2019-10-01Txx:xx:xx&end_date=2022-03-01Txx:xx:xx&location=california"
    response = requests.get(url)
    assert response.status_code == 400
    assert response.json() == expected_response
    # test missing end_date
    url = "http://seng3011.duckdns.orgarticle/filter?start_date=2019-10-01Txx:xx:xx&key_terms=outbreak&location=california"
    response = requests.get(url)
    assert response.status_code == 400
    assert response.json() == expected_response
    # test missing start_date
    url = "http://seng3011.duckdns.orgarticle/filter?end_date=2019-10-01Txx:xx:xx&key_terms=outbreak&location=california"
    response = requests.get(url)
    assert response.status_code == 400
    assert response.json() == expected_response
    # test missing two or more parameters
    url = "http://seng3011.duckdns.orgarticle/filter?key_terms=outbreak&location=california"
    response = requests.get(url)
    assert response.status_code == 400
    assert response.json() == expected_response
    url = "http://seng3011.duckdns.orgarticle/filter?location=california"
    response = requests.get(url)
    assert response.status_code == 400
    assert response.json() == expected_response
    # test without any parameters
    url = "http://seng3011.duckdns.orgarticle/filter"
    response = requests.get(url)
    assert response.status_code == 400
    assert response.json() == expected_response


def test_report_filter_missing_param():
    expected_response = {"message": "Missing required query parameter(s)"}
    # test missing location
    url = "http://seng3011.duckdns.orgreport/filter?start_date=2019-10-01Txx:xx:xx&end_date=2022-03-01Txx:xx:xx&key_terms=outbreak"
    response = requests.get(url)
    assert response.status_code == 400
    assert response.json() == expected_response
    # test missing key_terms
    url = "http://seng3011.duckdns.orgreport/filter?start_date=2019-10-01Txx:xx:xx&end_date=2022-03-01Txx:xx:xx&location=california"
    response = requests.get(url)
    assert response.status_code == 400
    assert response.json() == expected_response
    # test missing end_date
    url = "http://seng3011.duckdns.orgreport/filter?start_date=2019-10-01Txx:xx:xx&key_terms=outbreak&location=california"
    response = requests.get(url)
    assert response.status_code == 400
    assert response.json() == expected_response
    # test missing start_date
    url = "http://seng3011.duckdns.orgreport/filter?end_date=2019-10-01Txx:xx:xx&key_terms=outbreak&location=california"
    response = requests.get(url)
    assert response.status_code == 400
    assert response.json() == expected_response
    # test missing two or more parameters
    url = "http://seng3011.duckdns.orgreport/filter?key_terms=outbreak&location=california"
    response = requests.get(url)
    assert response.status_code == 400
    assert response.json() == expected_response
    url = "http://seng3011.duckdns.orgreport/filter?location=california"
    response = requests.get(url)
    assert response.status_code == 400
    assert response.json() == expected_response
    # test without any parameters
    url = "http://seng3011.duckdns.orgreport/filter"
    response = requests.get(url)
    assert response.status_code == 400
    assert response.json() == expected_response


def test_article_invalid_start_date():
    expected_response = {"message": "start_date cannot be later than today"}
    url = "http://seng3011.duckdns.orgarticle/filter?start_date=2023-03-01Txx:xx:xx&end_date=2023-03-01Txx:xx:xx&key_terms=outbreak&location=california"
    response = requests.get(url)
    assert response.status_code == 400
    assert response.json() == expected_response


def test_report_invalid_start_date():
    expected_response = {"message": "start_date cannot be later than today"}
    url = "http://seng3011.duckdns.orgreport/filter?start_date=2023-03-01Txx:xx:xx&end_date=2023-03-01Txx:xx:xx&key_terms=outbreak&location=california"
    response = requests.get(url)
    assert response.status_code == 400
    assert response.json() == expected_response


def test_article_invalid_date_range():
    expected_response = {"message": "start_date cannot be later than end_date"}
    url = "http://seng3011.duckdns.orgarticle/filter?start_date=2022-03-10Txx:xx:xx&end_date=2022-03-01Txx:xx:xx&key_terms=outbreak&location=california"
    response = requests.get(url)
    assert response.status_code == 400
    assert response.json() == expected_response


def test_report_invalid_date_range():
    expected_response = {"message": "start_date cannot be later than end_date"}
    url = "http://seng3011.duckdns.orgreport/filter?start_date=2022-03-10Txx:xx:xx&end_date=2022-03-01Txx:xx:xx&key_terms=outbreak&location=california"
    response = requests.get(url)
    assert response.status_code == 400
    assert response.json() == expected_response


def test_missing_url():
    expected_response = {"message": "Missing required query parameter(s)"}
    url = "http://seng3011.duckdns.orgreport/from_article_url"
    response = requests.get(url)
    assert response.status_code == 400
    assert response.json() == expected_response


def test_malformed_url():
    expected_response = {"message": "Malformed url"}
    # test non-CIDRAP urls
    url = "http://seng3011.duckdns.orgreport/from_article_url?url=www.example.com"
    response = requests.get(url)
    assert response.status_code == 404
    assert response.json() == expected_response
    # test invalid urls
    url = "http://seng3011.duckdns.orgreport/from_article_url?url=abcdefg"
    response = requests.get(url)
    assert response.status_code == 404
    assert response.json() == expected_response
    url = "http://seng3011.duckdns.orgreport/from_article_url?url=http://non-existing.com/"
    response = requests.get(url)
    assert response.status_code == 404
    assert response.json() == expected_response
