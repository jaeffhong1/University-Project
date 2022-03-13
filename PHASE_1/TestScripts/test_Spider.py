import subprocess
from json.decoder import JSONDecodeError
import os
import json
import re

# Test the overall structure of the json file and check each articles url and date are in the correct format.
def test_format():

    path_to_testFile = os.path.join(
        os.path.dirname(os.path.abspath(__file__)), "..", "API_SourceCode", "testposts.json"
    )
    # Clear contents of test_posts first
    open(path_to_testFile, "w").close()
    path_to_run = os.path.join(
        os.path.dirname(os.path.abspath(__file__)), "..", "API_SourceCode"
    )

    subprocess.Popen(
        [
            "scrapy",
            "crawl",
            "posts",
            "-a",
            "num_pages=10",
            "-a",
            "file_to_output=testposts.json",
            "-o",
            "testposts.json",
            "-t",
            "jsonlines",
        ],
        cwd=path_to_run,
    ).communicate()
    # .communicate makes the program wait until the process is completely finished before moving on.

    current_posts = []
    amount_of_posts = 0
    with open(path_to_testFile) as news_posts:
        for line in news_posts:
            amount_of_posts += 1
            current_posts.append(json.loads(line))
    # Since each page has 10 articles, going through 10 pages, there must be 100 articles.
    assert amount_of_posts == 100

    # Check each articles url and date.
    for post in current_posts:
        amount_of_posts += 1
        url, date = (
            post["url"],
            post["date_of_publication"],
        )

        date_in_url = (date.split(" "))[0]
        date_in_url = date_in_url.split("-")
        year, month = date_in_url[0], date_in_url[1]
        if len(month) == 1:
            month = "0" + str(month)

        # url must be /news-perspective/ followed by the date. /news-perspective/2022/03/
        url_regex = (
            r"^/news-perspective/"
            + str(year)
            + r"/"
            + str(month)
            + r"/"
        )

        assert re.search(url_regex, url) is not None
        # date must be in format 2022-3-11 xx:xx:xx
        date_regex = r"^\d{4}-([1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\sxx:xx:xx$"
        assert re.search(date_regex, date) is not None


# Test if an article is not present in the file, it will be added and only the file not present will be added.
# This test will fail if the very first article to be put into testposts.json is not the very top article.
# Thats because for this test, we will first run scraper, produce a json and then remove the very top 
# article, then call the scraper again and since the scraper will run and add to testposts.json until it hits a duplicate
# ,if the very top article was not the first article to be put into the json file then the scraper will immediately stop.
def test_stopped(): 
    path_to_testFile = os.path.join(
        os.path.dirname(os.path.abspath(__file__)), "..", "API_SourceCode", "testposts.json"
    )
    # Clear contents of test_posts first
    open(path_to_testFile, "w").close()
    path_to_run = os.path.join(
        os.path.dirname(os.path.abspath(__file__)), "..", "API_SourceCode"
    )
    subprocess.Popen(
        [
            "scrapy",
            "crawl",
            "posts",
            "-a",
            "num_pages=1",
            "-a",
            "file_to_output=testposts.json",
            "-o",
            "testposts.json",
            "-t",
            "jsonlines",
        ],
        cwd=path_to_run,
    ).communicate()

    current_posts = []
    with open(path_to_testFile) as news_posts:
        for line in news_posts:
            current_posts.append(json.loads(line))

    all_current_urls = []
    for post in current_posts:
        all_current_urls.append(post["url"])

    # Remove the first article
    current_posts.pop(0)
    # Clear contents of test_posts 
    open(path_to_testFile, "w").close()

    # Fill the testposts.json file with the contents of current_posts
    with open(path_to_testFile, 'a') as news_posts:
        for i in range (0, 9):
            news_posts.write(json.dumps(current_posts[i]) + '\n')

    # Removed the first article so there should only be nine
    assert len(current_posts) == 9

    # Calling the process again should only add the first removed article.
    subprocess.Popen(
        [
            "scrapy",
            "crawl",
            "posts",
            "-a",
            "num_pages=1",
            "-a",
            "file_to_output=testposts.json",
            "-o",
            "testposts.json",
            "-t",
            "jsonlines",
        ],
        cwd=path_to_run,
    ).communicate()

    current_posts = []
    with open(path_to_testFile) as news_posts:
        for line in news_posts:
            current_posts.append(json.loads(line))

    # If its 9, then most likely the first article to be added into the json was not the very top article.
    # so just assert True?
    if (len(current_posts) == 9):
        assert True

    # The deleted article should now be appended to the end of the current_posts list
    assert len(current_posts) == 10

    # This means all_current_urls[0] should equal the last post["url"]
    i = 1
    for post in current_posts:
        assert post["url"] == all_current_urls[i]
        i += 1
        i = i%10

    return True
