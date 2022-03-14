"""
posts.json structure:

[
	{
		"url": "...",
		"date_of_publication": "2022-2-21 xx:xx:xx",
		"headline": "...",
		"main_text": "summary",
		"article_text": "<html>"
	},
	{ ... }
]
"""

import json
import re
from scrapy.selector import Selector
import datefinder
import spacy

entities_recognizer_model = spacy.load("en_core_web_sm")

SCRAPE_RESULT_FILE = "./projscrape/posts.json"


def read_list_of_names(filename):
    name_list = []
    with open(filename) as fp:
        for item in json.load(fp):
            name_list.append(item["name"].lower())
    return name_list


diseases = read_list_of_names("./report_parser/disease_list.json")
syndromes = read_list_of_names("./report_parser/syndrome_list.json")


def break_into_sentences(text):
    return text.split(".")


def log(*args, **kwargs):
    return
    print(*args, **kwargs)


def parse_article(article):
    html = article["article_text"]
    body = Selector(text=html)
    text = " ".join(s.strip() for s in body.css("#content *::text").getall())
    return parse_article_text(text)


def format_date(dates):
    """TODO: support date ranges"""
    datetime = None
    for d in dates:
        datetimes = list(datefinder.find_dates(d))
        if len(datetimes) != 0:
            datetime = datetimes[0]
            break

    if not datetime:
        return "xxxx-xx-xx xx:xx:xx"

    datetime_format = "%Y-%m-%d %H:%M:%S"
    if datetime.second == 0:
        datetime_format = datetime_format.replace("%S", "xx")
    if datetime.minute == 0:
        datetime_format = datetime_format.replace("%M", "xx")
    if datetime.hour == 0:
        datetime_format = datetime_format.replace("%H", "xx")
    if datetime.day == 0:
        datetime_format = datetime_format.replace("%d", "xx")
    if datetime.month == 0:
        datetime_format = datetime_format.replace("%m", "xx")
    if datetime.year == 0:
        datetime_format = datetime_format.replace("%Y", "xxxx")

    return datetime.strftime(datetime_format)


def parse_article_text(article):
    """Return a list of reports"""
    article = article.lower()
    sentences = break_into_sentences(article)

    reports = []

    for sen in sentences:
        diseases_present = []
        syndromes_present = []
        for d in diseases:
            if d in sen:
                diseases_present.append(d)
        for s in syndromes:
            if s in sen:
                syndromes_present.append(s)

        if len(diseases_present) == len(syndromes_present) == 0:
            continue  # nothing to report

        doc = entities_recognizer_model(sen)
        dates = [
            ent.text
            for ent in doc.ents
            if ent.label_ == "DATE" and ent.text != "covid-19"
        ]
        locations = [ent.text for ent in doc.ents if ent.label_ == "GPE"]
        log(f"sen: {sen} locations={locations} dates={dates} ents={doc.ents}")

        if len(dates) == 0:
            log(f"[warning] would report, but no date: {repr(sen)}")
            continue

        if len(dates) != 1:
            log(f"[warning] found more than one date in {repr(sen)}, {dates}")

        reports.append(
            {
                "diseases": diseases_present,
                "syndromes": syndromes_present,
                "event_date": format_date(dates),
                "locations": locations,
            }
        )

    return reports


def add_reports_to_database(reports):
    # for now do nothing, because i don't have the database setup script
    pass


if __name__ == "__main__":
    with open(SCRAPE_RESULT_FILE, "r") as fp:
        articles = json.load(fp)

    for article in articles:
        reports = parse_article(article)

        add_reports_to_database(reports)
