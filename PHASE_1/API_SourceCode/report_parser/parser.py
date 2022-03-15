"""
posts.json structure:

{"url": "...", "date_of_publication": "2022-2-21 xx:xx:xx", "headline": "...", "main_text": "summary", "article_text": "<html>"}
{ ... }
{ ... }
{ ... }
{ ... }
"""


import spacy
import warnings
import json
import dateparser
from spacy import displacy
import os
from scrapy.selector import Selector

# dateparser.parse triggers some warnings that we don't care about
warnings.filterwarnings(
    "ignore",
    message="The localize method is no longer necessary, as this time zone supports the fold attribute",
)


with open(os.path.normpath(os.path.join(__file__, '../disease_list.json'))) as fp:
    DISEASES = [d['name'].lower() for d in json.load(fp)]
    
with open(os.path.normpath(os.path.join(__file__, "../syndrome_list.json"))) as fp:
    SYNDROMES = [d['name'].lower() for d in json.load(fp)]


nlp = spacy.load('en_core_web_sm')

# add a pipeline to detect syndromes
ruler = nlp.add_pipe("entity_ruler", config={
    "phrase_matcher_attr": "LOWER",
})

ruler.add_patterns([{"label": "DISEASE", "pattern": d} for d in DISEASES])
ruler.add_patterns([{"label": "SYNDROME", "pattern": s} for s in SYNDROMES])

def get_paragraphs_from_article(article_html):
   
    body = Selector(text=article_html)
    text = ' '.join(s.strip() for s in body.css('#content *::text').getall())
    # break into paragraphs
    for item in body.css('p'):
        yield ' '.join(item.css("*::text").getall())

def get_valid_dates(dates_as_strings, relative_base):
    for s in dates_as_strings:
        # dateparser.parse returns None if it can't parse a date out of the string
        result = dateparser.parse(s, settings={"RELATIVE_BASE": relative_base})
        if result:
            yield result


def seng3011_date_format(date):
    return date # TODO

def get_reports_from_paragraphs(paragraphs, date_of_article, article_url):
    docs = nlp.pipe(paragraphs)
    for doc in docs:
        with_ent = lambda x: [ent for ent in doc.ents if ent.label_ == x]

        diseases = with_ent("DISEASE")
        syndromes = with_ent("SYNDROME")
        dates = with_ent("DATE")
        locations = with_ent("GPE") # countries, cities and states

        if (any(diseases) or any(syndromes)) and any(dates) and any(locations):
            # if there is more than one date, we create a report for each one
            # (I don't have any better ideas right now. We'd rather have false
            # positives than false negatives for this project)
            num_dates = 0
            for date in get_valid_dates((ent.text for ent in dates), date_of_article):
                num_dates += 1
                yield {
                    'diseases': [ent.text for ent in diseases],
                    'syndromes': [ent.text for ent in syndromes],
                    'locations': [ent.text for ent in locations],
                    'event_date': seng3011_date_format(date)
                }
            if num_dates > 1:
                print("[warning] more than one date for the article", article_url)

def parse_article(article):
    paragraphs = get_paragraphs_from_article(article['article_text'])
    article_date = dateparser.parse(article['date_of_publication'].replace(' xx:xx:xx', ''))
    yield from get_reports_from_paragraphs(paragraphs, article_date, article['url'])


def main(posts_file):
    # probably should remove all the current reports from the database
    # maybe back them up somewhere
    with open(posts_file) as fp:
        for line in fp:
            article = json.loads(line)
            for report in parse_article(article):
                print("insert into db:", report)
            
if __name__ == "__main__":
    main('/home/math2001/good-posts.json')