from datetime import datetime
import globals
from globals import get_soup, update_db

# Special Service for Groups, Inc.

organization = "Special Service for Groups, Inc."
url = 'http://www.ssg.org/about-us/careers/'


def run(url):
    soup = get_soup(url)
    article = soup.find('article')
    jobs_list = article.find_all('p')

    for job_entry in jobs_list:
        if 'Posted ' in job_entry.text:
            job_element = job_entry.find('a')
            globals.job_title = job_element.text
            globals.info_link = job_element['href']
            date = job_entry.text.split('Posted ')[1].split('/')
            month = int(date[0])
            day = int(date[1])
            year = int(date[2])
            globals.job_post_date = datetime(year, month, day)
            update_db(organization)
