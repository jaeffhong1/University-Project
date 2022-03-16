import sys
import os

sys.path.append(os.path.join(os.getcwd(), "API_SourceCode"))

from report_parser import parse_article


def test_parser_simple_report():
    article = {
        "url": "/foo/bar",
        "date_of_publication": "2022-2-21 xx:xx:xx",
        "headline": "This is test number 1",
        "main_text": "read the whole thing",
        "article_text": """
            Around 10 cases of sars, located in Sydney, have been reported on November 14 2021.
            This is an easy sentence to parse a report from.
            """,
    }

    assert list(parse_article(article)) == [
        {
            "diseases": ["sars"],
            "syndromes": [],
            "event_date": "2021-11-14 xx:xx:xx",
            "locations": ["Sydney"],
        }
    ]

def test_parser_ignores_dates_after_article_date():
    article = {
        "url": "/foo/bar",
        "date_of_publication": "2005-2-21 xx:xx:xx",
        "headline": "This is test number 1",
        "main_text": "read the whole thing",
        "article_text": """
            Around 10 cases of sars, located in Sydney, have been reported on November 14 2021.
            The author can see the future.
            """,
    }
    assert list(parse_article(article)) == []

def test_parser_selects_only_valid_dates():
    article = {
        "url": "/foo/bar",
        "date_of_publication": "2022-2-21 xx:xx:xx",
        "headline": "This is test number 1",
        "main_text": "read the whole thing",
        "article_text": """
            Around 10 cases of sars, located in Sydney, have been reported on November 14 2021.
            Experts said "she'll be fine", so we should be good from March 2022 onwards.
            """,
    }
    assert list(parse_article(article)) == [
        {
            "diseases": ["sars"],
            "syndromes": [],
            "event_date": "2021-11-14 xx:xx:xx",
            "locations": ["Sydney"],
        }
    ]



def test_parser_removes_duplicate_locations():
    article = {
        "url": "/foo/bar",
        "date_of_publication": "2022-2-21 xx:xx:xx",
        "headline": "This is test number 1",
        "main_text": "read the whole thing",
        "article_text": """
            Around 10 cases of sars, located in Sydney, have been reported on November 14 2021.
            Sydney has been heavely impacted by this diseases.
            """,
    }
    assert list(parse_article(article)) == [
        {
            "diseases": ["sars"],
            "syndromes": [],
            "event_date": "2021-11-14 xx:xx:xx",
            "locations": ["Sydney"],
        }
    ]
