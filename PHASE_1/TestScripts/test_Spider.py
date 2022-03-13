import subprocess
from json.decoder import JSONDecodeError
import os
import json
import re

# Test the overall structure of the json file and check each articles url and date are in the correct format.
def test_format():
    # Clear contents of test_posts first
    open('testposts.json', 'w').close()
    path_to_run = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "API_SourceCode")
    subprocess.Popen(["scrapy", "crawl", "posts", "-a", "num_pages=10", "-a", "file_to_output=testposts.json", "-o", "testposts.json"], cwd=path_to_run)

    path_to_json = os.path.join(os.path.dirname(os.path.abspath(__file__)), "testposts.json")
    current_posts = []
    with open(path_to_json) as news_posts:
        try:
            current_posts = json.load(news_posts)
            news_posts.close()
        except ValueError as e:
            return False

    amount_of_posts = 0
    # Check each articles url and date.
    for post in current_posts:
        amount_of_posts += 1
        url, date, headline, text = post['url'], post['date_of_publication'], post['headline'], post['article_text']
        headline_in_url = headline.lower()
        headline_in_url = headline_in_url.replace(" ", "-")
        headline_in_url = headline_in_url.replace(",", "")
        headline_in_url = headline_in_url.replace("'", "")

        date_in_url = (date.split(" "))[0]
        date_in_url = date_in_url.split("-")
        year, month = date_in_url[0], date_in_url[1]
        if len(month) == 1:
            month = "0" + str(month)

        # url must be /news-perspective/ followed by the date and headline. /news-perspective/2022/03/global-covid-19-deaths-may-be-3-times-higher-recorded
        url_regex = r"^/news-perspective/" + str(year) + r"/" + str(month) + r"/" + headline_in_url
        if not re.search(url_regex, url):
            return False
        # date must be in format 2022-3-11 xx:xx:xx
        date_regex = r"^\d{4}-([1-9]|1[0-2])-([1-9]|[12][0-9]|3[01])$"
        if not re.search(date_regex, date):
            return False

    # Since each page has 10 articles, going through 10 pages, there must be 100 articles.
    assert amount_of_posts == 100

# Test if an article is not present in the file, it will be added and only the file not present will be added.
def test_stopped():
    # Clear contents of test_posts first
    open('testposts.json', 'w').close()
    path_to_run = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "API_SourceCode")
    subprocess.Popen(["scrapy", "crawl", "posts", "-a", "num_pages=1", "-a", "file_to_output=testposts.json", "-o", "testposts.json"], cwd=path_to_run)

    path_to_json = os.path.join(os.path.dirname(os.path.abspath(__file__)), "testposts.json")
    current_posts = []
    with open(path_to_json) as news_posts:
        try:
            current_posts = json.load(news_posts)
            news_posts.close()
        except ValueError as e:
            return False

    all_current_urls = []
    for post in current_posts:
        all_current_urls.append(post['url'])
    
    # Remove the first article
    current_posts.pop(0)
    with open(path_to_json, "w") as news_posts:
        json.dump(current_posts, news_posts)
        news_posts.close()

    # Removed the first article so there should only be nine 
    if not len(current_posts) == 9:
        return False

    # Calling the process again should only add the first removed article.
    subprocess.Popen(["scrapy", "crawl", "posts", "-a", "num_pages=1", "-a", "file_to_output=testposts.json", "-o", "testposts.json"], cwd=path_to_run)
    with open(path_to_json) as news_posts:
        try:
            current_posts = json.load(news_posts)
            news_posts.close()
        except ValueError as e:
            return False

    if not len(current_posts) == 10:
        return False

    i = 0
    for post in current_posts:
        if post["url"] != all_current_urls[i]:
            return False
        i += 1
    
    return True
        

