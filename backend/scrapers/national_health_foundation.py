import globals
from globals import get_soup, update_db

# National Health Foundation
organization = "National Health Foundation"
url = 'http://nationalhealthfoundation.org/careers/'


def run(url):

    soup = get_soup(url)

    job_listings = soup.find(
        'div', {'class': 'tf-sh-78847e2ef97967b68fdec32a2997ab8f'})

    for job_item in job_listings.find_all('a'):
        globals.job_title = job_item.text.strip()
        globals.info_link = job_item['href']
        update_db(organization)
