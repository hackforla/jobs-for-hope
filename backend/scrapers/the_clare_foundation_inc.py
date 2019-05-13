import globals
from globals import get_soup, update_db

# The Clare Foundation, Inc.
organization = "The Clare Foundation, Inc."
url = 'http://clarefoundation.org/careers/'


def run(url):
    soup = get_soup(url)

    listings_container = soup.find('ul', {'class': 'display-posts-listing'})

    for listing in listings_container.find_all('li'):
        globals.job_title = listing.text
        globals.info_link = listing.a['href']
        update_db(organization)
