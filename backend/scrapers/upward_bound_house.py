import globals
from globals import get_soup, update_db

# Upward Bound House
organization = "Upward Bound House"
url = 'https://upwardboundhouse.org/about-us/careers/'


def run(url):
    soup = get_soup(url)
    jobs_div = soup.find('h1', text='Careers').parent

    for job_listing in jobs_div.find_all('a'):
        globals.job_title = job_listing.text
        globals.info_link = job_listing['href']
        update_db(organization)
