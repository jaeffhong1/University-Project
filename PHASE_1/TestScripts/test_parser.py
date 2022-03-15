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
