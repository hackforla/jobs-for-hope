import globals
from globals import get_javascript_soup, update_db

# Los Angeles LGBT Center

organization = "Los Angeles LGBT Center"
url = 'https://lalgbtcenter.org/about-the-center/careers'


def run(url):
    soup = get_javascript_soup(url)

    job_divs = soup.find_all('div', {'class': 'ui-accordion-content'})

    for job_div in job_divs:
        for job_listing in job_div.find_all('li'):
            globals.job_title = job_listing.text.strip()
            globals.info_link = 'https://lalgbtcenter.org' + \
                job_listing.find_all('a')[-1]['href']
            update_db(organization)

    job_lists = soup.find_all('ul', {'class': 'ui-accordion-content'})

    for job_list in job_lists:
        for job_listing in job_list.find_all('li'):
            globals.job_title = job_listing.text.strip()
            globals.info_link = 'https://lalgbtcenter.org' + \
                job_listing.find_all('a')[-1]['href']
            update_db(organization)
