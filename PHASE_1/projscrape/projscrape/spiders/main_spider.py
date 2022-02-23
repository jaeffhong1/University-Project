import scrapy
import re

class PostsSpider(scrapy.Spider):
    name = "posts"

    start_urls = [
        'https://www.cidrap.umn.edu/news-perspective'
    ]

    def monthToNum(month):
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
                    'main_text': main_text,
                    'reports': []
                }
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

    # Method for retrieving the reports from each article.
    # This is a really bad solution to finding the reports in the article.
    # It loops through each paragraph in the article, if a paragraph contains a date and a country name then it assumes that it is a report and adds it into the report dictionary for that article.

    # I was thinking of making a sort of point system, for example if a paragraph contains a country then it receives 5 points, if it also contains a date then it recieves another 5 points
    # for a total of 10 points. For every country or date it finds, the points get reduced so the second time it finds a country it will only receive something like 3 points and then 1 and then
    # points are reduced if it contains more than 3?
    # For a paragraph to be added into the reports maybe it needs to accumulate 15 points so we can add other things like if it contains words like "report" or "\d+ cases" then 2 points are added.
    def parseArticle(self, response):
        article_info = response.meta['item']

        countries = ["afghanistan", "australia", "bangladesh", "brazil", "cambodia", "canada", "chile", "china", "germany", "india", "japan", "korea", "russia", "singapore", "united", "states", "africa", "america"]
        reports = {}

        # The articles and scans have different structures for how they display their "filed under" section so the response.css has to be different for both.
        filed_under = response.css('div.field.field-name-field-related-topics.field-type-node-reference.field-label-hidden')
        if len(filed_under) == 0:
            filed_under = response.css('div.field.field-name-field-related-topics.field-type-node-reference.field-label-inline.clearfix')

        # Assume all diseases in the "filed under" section are in the report if there is a report in the article.
        diseases = filed_under.css('div.field-items div.field-item.even a::text').getall()

        all_paragraphs = response.css('div.field.field-name-field-body.field-type-text-long.field-label-hidden div.field-items div.field-item.even p::text').getall()

        for paragraph in all_paragraphs:
            # Make the entire paragraph into lowercase so its easier to deal with regex and other checks.
            paragraph = paragraph.lower()
            # Regex to find dates that look like "jan 16 " or "jan  16," or "january 16 "
            # Could be better since it also accepts things like "jan 55 "
            dates_regex = re.findall("(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s\d{1,2}[\s,]", paragraph)
            dates = [x[:-1] for x in dates_regex]
            new_dates = []

            # Convert date into year-month-day hr:min:sec format
            for date in dates:
                month = date[0:3].title()
                month = self.monthToNum(month)
                day = date[4:6]
                year = article_info['date_of_publication']
                year = year[0:4]

                date = str(year) + "-" + str(month) + "-" + str(day) + " xx:xx:xx"
                new_dates.append(date)

            locations = []
            split_paragraph = paragraph.split()

            for words in split_paragraph:
                # See if any of the words in the paragraph is a country name using the country list.
                # It uses startswith in case the article uses a word such as "australia's".
                for country in countries:
                    if words.startswith(country):
                        locations.append(country)
            
            # Check that a location and a date was found in the paragraph.
            # If they do then fill the reports dictionary with elements.
            if len(locations)!=0 and len(new_dates)!=0:
                reports["locations"] = locations
                reports["dates"] = new_dates 
                reports['diseases'] = diseases
                reports['syndrome'] = []

        # Add the reports object into the articles info.
        article_info['reports'] = reports

        yield article_info