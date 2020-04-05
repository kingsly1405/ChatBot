import scrapy


class SwaggerSpider(scrapy.Spider):
    name = 'ACM Spider'
    allowed_domains = ['wiki.cerner.com', 'search.cerner.com','cernerprod.sharepoint.com']
    start_urls = ['https://wiki.cerner.com/display/RevCycleDev/Acute+Case+Management']
    
    
    def parse(self, response):

        