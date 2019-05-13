import globals
from globals import get_soup, update_db

# Safe Place for Youth

organization = "Safe Place for Youth"
url= "http://www.safeplaceforyouth.org/employment_opportunities"
def run(url):
    soup = get_soup(url)
    jobs_div = soup.find('div', {'id':'yui_3_16_0_ym19_1_1492463820306_5454'})

    for job_listing in jobs_div.find_all('p'):
        listing_element = job_listing.find_all('a')
        if len(listing_element) > 0:
            globals.job_title = listing_element[0].text
            globals.info_link = listing_element[0]['href']
            update_db(organization)
