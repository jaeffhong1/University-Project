import sys
import os

sys.path.append(os.getcwd())

from report_parser import parse_article_text


def test_parser():
    article = """
	Around 10 cases of sars, located in Sydney, have been reported on November 14 2021.
	This is an easy sentence to parse a report from.
	"""

    assert parse_article(article) == [
        {
            "diseases": ["sars"],
            "syndromes": [],
            "event_date": "2021-11-14 xx:xx:xx",
            "locations": ["sydney"],
        }
    ]
