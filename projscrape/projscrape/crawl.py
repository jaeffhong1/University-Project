'''
    crawl.py
    
    Import crawl.py to call the crawler programatically/dynamically.
    
    - crawl.py should be callable via a exportable "hook".
    - crawl.py should add crawled data to the database.
'''

from scrapy.crawler import CrawlerProcess
#from scrapy.utils.project import get_project_settings # can use settings from scrapy.cfg
from spiders.main_spider import PostsSpider # import spiders here

# call this method from api
def crawl():
    process = CrawlerProcess()
    process.crawl(PostsSpider)
    process.start()
    
    # retrieve data
    # TODO: decide how data is retrieved
    # 1. simply read from .json file
    # 2. have it sent via a pipeline
    
if __name__ == "__main__":
    crawl()
    