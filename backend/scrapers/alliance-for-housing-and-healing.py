from datetime import datetime
import globals
from globals import get_soup, update_db
from datecleaner import month_to_num

# Alliance for Housing and Healing (Formerly the Serra Project & Aid For Aids)

organization = "Alliance for Housing and Healing"
url = 'https://alliancehh.org/about/jobs/'

def run(url):
    soup = get_soup(url)
    jobs_list = soup.find_all('h4')

    for job_entry in jobs_list:
        globals.job_title = job_entry.a.text
        globals.info_link = job_entry.a['href']
        listing_soup = get_soup(globals.info_link)

        if listing_soup.body.find_all('p', string="Job Type: Full-time"):
            globals.full_or_part = 'Full-time'
        elif listing_soup.body.find_all('p', string="Job Type: Part-time"):
            globals.full_or_part = 'Part-time'

        date_text = listing_soup.body.find_all('span', {'class': 'subtitle'})[0].text.split()

        month_string = date_text[2]
        day = int(date_text[3][0:len(date_text[3])-1])
        year = int(date_text[4])
        month = month_to_num(month_string)

        globals.job_post_date = datetime(year, month, day)

        update_db(organization)
