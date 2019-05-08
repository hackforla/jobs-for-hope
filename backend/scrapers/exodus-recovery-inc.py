# vim: set fileencoding=utf8
# Editor configs above to save file in Unicode since this file contains
# non-ASCII characters
import globals
from globals import get_javascript_soup, update_db

# Exodus Recovery, Inc.

organization = "Exodus Recovery, Inc."
url = 'https://www.exodusrecovery.com/employment/'

def run(url):
    soup = get_javascript_soup(url)

    scraping = True
    while scraping:
        jobs_list = soup.find_all('article', {'class':'et_pb_post'})
        for job_entry in jobs_list:
            job_title = job_entry.find('h2', {'class':'entry-title'})
            globals.job_title = job_title.text
            globals.info_link = job_title.a['href']
            globals.job_summary = job_entry.find('div', {'class':'post-content'}).p.text
            update_db(organization)
        ## Check if more job entries on website to scrape
        if soup.find(text="« Older Entries"):
            soup = get_javascript_soup(soup.find(text="« Older Entries").parent['href'])
        else:
            scraping = False
