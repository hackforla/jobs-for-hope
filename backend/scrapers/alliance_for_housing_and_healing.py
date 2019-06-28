from datetime import datetime
import globals
from globals import get_soup, job_insert
from datecleaner import month_to_num
from job import Job
# Alliance for Housing and Healing (Formerly the Serra Project & Aid For Aids)

organization = "Alliance for Housing and Healing"
url = 'https://alliancehh.org/about/jobs/'
organization_id = 3


def run(url):
    soup = get_soup(url)
    jobs_list = soup.find_all('h4')
    job_class = Job(organization, "")
    job_class.organization_id = organization_id
    insert_count = 0
    for job_entry in jobs_list:
        job_class.title = job_entry.a.text
        job_class.info_link = job_entry.a['href']
        listing_soup = get_soup(job_class.info_link)

        if listing_soup.body.find_all('p', string="Job Type: Full-time"):
            job_class.full_or_part = 'Full-time'
        elif listing_soup.body.find_all('p', string="Job Type: Part-time"):
            job_class.full_or_part = 'Part-time'

        date_text = listing_soup.body.find_all(
            'span', {'class': 'subtitle'})[0].text.split()

        month_string = date_text[2]
        day = int(date_text[3][0:len(date_text[3]) - 1])
        year = int(date_text[4])
        month = month_to_num(month_string)

        job_class.post_date = datetime(year, month, day)

        insert_count += job_insert(job_class)
    return insert_count
