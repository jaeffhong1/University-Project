import scrapy
import re
import json
import os
from json.decoder import JSONDecodeError

class PostsSpider(scrapy.Spider):
    name = "posts"
    # The variable that will hold the contents of posts.json
    current_posts = ""
    path_to_json = ""

    start_urls = [
        'https://www.cidrap.umn.edu/news-perspective'
    ]

    def monthToNum(self, month):
        return {
            'Jan': 1,
            'Feb': 2,
            'Mar': 3,
            'Apr': 4,
            'May': 5,
            'Jun': 6,
            'Jul': 7,
            'Aug': 8,
            'Sep': 9, 
            'Oct': 10,
            'Nov': 11,
            'Dec': 12
        }[month]

    def parse(self, response):
        # For each date, loop through each article that was published on that date.

        # Open up posts.json and copy its contents into current_posts.
        self.path_to_json = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'posts.json')
        with open(self.path_to_json) as news_posts:
            try:
                self.current_posts = json.load(news_posts)
                news_posts.close()
            except JSONDecodeError:
                pass

        for date_published in response.css('div.views-set'):
            date = date_published.css('span.date-display-single::text').get()

            month = date[0:3]
            month = self.monthToNum(month)
            day = date[4:6]
            year = date[8:]

            # Turn date into the correct format of year:month:day hour:minutes:seconds (hour:minutes:seconds is xx:xx:xx because I could not find it)
            date = str(year) + "-" + str(month) + "-" + str(day) + " xx:xx:xx"
            
            for post in date_published.css('div.fieldlayout-region-body.fieldlayout-region-body-teaser'):
                url = post.css('h3 a::attr(href)').get()
                headline = post.css('h3 a::text').get()

                article_info = {
                    'url': url,
                    'date_of_publication': date,
                    'headline': headline,
                }

                # Check first 10 articles and see if the article that we are trying to scrape is not already in there by its date.
                # If it finds the articles date is already in posts.json then it should just return.
                if self.current_posts != "":
                    for i in range(len(self.current_posts)-1):
                        if url == self.current_posts[i]['url']:
                            return
                # Else we should keep parsing articles.
                # Goes into the article url and calls the parseArticle method on that article page.
                next_news = response.urljoin(url)
                request = scrapy.Request(next_news, callback=self.parseArticle)
                request.meta['item'] = article_info

                yield request

        # Get the next pages url.
        next_page = response.css('li.pager-next a::attr(href)').get()
        # Make sure that a next page does exist.
        # Go to the next page of articles and call the parse method again for that page.
        if next_page is not None:
            next_page = response.urljoin(next_page)
            # Call the parse method again for the next page.
            yield scrapy.Request(next_page, callback=self.parse)

    # Retrieves the raw html of a given article.
    def parseArticle(self, response):
        article_info = response.meta['item']
        article_text = response.css('div.clearfix').get()
        article_info['article_text'] = article_text
        # If there were already news entries in posts.json then we should append to it.
        if self.current_posts != "":
            self.current_posts.insert(0, article_info)
            with open(self.path_to_json, "w") as news_posts:
                json.dump(self.current_posts, news_posts)
                news_posts.close()
        else:
            yield article_info