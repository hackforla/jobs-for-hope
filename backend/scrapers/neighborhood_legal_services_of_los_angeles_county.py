import globals
from globals import get_soup, update_db

# Neighborhood Legal Services of Los Angeles County
organization = "Neighborhood Legal Services of Los Angeles County"
url = 'http://www.nlsla.org/current-employment-opportunities/'


def run(url):
    soup = get_soup(url)

    job_listings = soup.find('article').find_all('a')

    for job_item in job_listings:
        if len(job_item.text.strip()):
            globals.job_title = job_item.text.strip()
            globals.info_link = url + job_item['href']
            update_db(organization)
