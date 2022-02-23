import scrapy
import re

class PostsSpider(scrapy.Spider):
    name = "posts"

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
                main_text = post.css('div.field.field-name-field-teaser.field-type-text-long.field-label-hidden div.field-items div.field-item.even p::text').get()

                if main_text is None:
                    main_text = post.css('div.field.field-name-field-bullet-points.field-type-text.field-label-hidden div.field-items div.field-item::text').getall()
                    main_text = ', '.join(main_text) 

                article_info = {
                    'url': url,
                    'date_of_publication': date,
                    'headline': headline,
                    'main_text': main_text
                }
                # Goes into the article url and calls the parseArticle method on that article page.
                next_news = response.urljoin(url)
                request = scrapy.Request(next_news, callback=self.parseArticle)
                request.meta['item'] = article_info

                yield request

        # Go to the next page of articles and call the parse method again for that page.

        # Get the next pages url.
        next_page = response.css('li.pager-next a::attr(href)').get()
        # Make sure that a next page does exist.
        if next_page is not None:
            next_page = response.urljoin(next_page)
            # Call the parse method again for the next page.
            yield scrapy.Request(next_page, callback=self.parse)

    # Retrieves the raw html of a given article.
    def parseArticle(self, response):
        article_info = response.meta['item']
        article_text = response.css('div.clearfix').get()
        article_info['article_text'] = article_text

        yield article_info