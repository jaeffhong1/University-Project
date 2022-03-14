import scrapy
import re
import json
import os
from json.decoder import JSONDecodeError


class PostsSpider(scrapy.Spider):
    name = "posts"
    # The list that will hold the contents of the file to output.
    current_posts = []
    new_articles = []
    path_to_json = ""

    start_urls = ["https://www.cidrap.umn.edu/news-perspective"]

    def monthToNum(self, month):
        return {
            "Jan": 1,
            "Feb": 2,
            "Mar": 3,
            "Apr": 4,
            "May": 5,
            "Jun": 6,
            "Jul": 7,
            "Aug": 8,
            "Sep": 9,
            "Oct": 10,
            "Nov": 11,
            "Dec": 12,
        }[month]

    def __init__(self, num_pages="", file_to_output="", **kwargs):
        self.pages = int(num_pages)
        self.file_to_output = file_to_output
        self.i = 0
        # Opens up the file to output to and copy its contents into current_posts.
        self.path_to_json = os.path.join(
            os.path.dirname(os.path.abspath(__file__)), "..", "..", self.file_to_output
        )
        with open(self.path_to_json) as news_posts:
            for line in news_posts:
                self.current_posts.append(json.loads(line))

        super().__init__(**kwargs)

    def parse(self, response):
        # If i reaches the page number then return.
        if self.i == self.pages:
            return
        # For each date, loop through each article that was published on that date.
        for date_published in response.css("div.views-set"):
            date = date_published.css("span.date-display-single::text").get()

            month = date[0:3]
            month = self.monthToNum(month)
            day = date[4:6]
            year = date[8:]

            # Turn date into the correct format of year:month:day hour:minutes:seconds (hour:minutes:seconds is xx:xx:xx because I could not find it)
            date = str(year) + "-" + str(month) + "-" + str(day) + " xx:xx:xx"

            for post in date_published.css(
                "div.fieldlayout-region-body.fieldlayout-region-body-teaser"
            ):
                url = post.css("h3 a::attr(href)").get()
                headline = post.css("h3 a::text").get()

                article_info = {
                    "url": url,
                    "date_of_publication": date,
                    "headline": headline,
                }

                # If it finds the article is already in the file to output then it should just return.
                found_duplicate = 0
                for posts in self.current_posts:
                    if url == posts["url"]:
                        found_duplicate = 1
                        break

                if (self.pages == -1 and found_duplicate):
                    return
                elif (self.pages != -1 and found_duplicate):
                    continue

                # Else we should keep parsing articles.
                # Goes into the article url and calls the parseArticle method on that article page.
                next_news = response.urljoin(url)
                request = scrapy.Request(next_news, callback=self.parseArticle)
                request.meta["item"] = article_info

                yield request

        self.i += 1

        # Get the next pages url.
        next_page = response.css("li.pager-next a::attr(href)").get()
        # Make sure that a next page does exist.
        # Go to the next page of articles and call the parse method again for that page.
        if next_page is not None:
            next_page = response.urljoin(next_page)
            # Call the parse method again for the next page.
            yield scrapy.Request(next_page, callback=self.parse)

    # Retrieves the raw html of a given article.
    def parseArticle(self, response):
        article_info = response.meta["item"]
        article_text = response.css("div.clearfix").get()
        article_info["article_text"] = article_text
        # If there were already news entries in the file to output then we should append to it.
        yield article_info
