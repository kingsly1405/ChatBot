import urllib2
from bs4 import BeautifulSoup
import re

opener = urllib2.build_opener()

url = ('https://search.cerner.com/search?q=time%20codes&dateType=relevance')

readableUrl = opener.open(url).read()

soup = BeautifulSoup(readableUrl, 'lxml')

print soup
title = soup.title

body = soup.find(text="Time Codes")

print body