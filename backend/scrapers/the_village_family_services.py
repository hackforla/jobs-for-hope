import globals
from globals import get_soup, job_insert
from datetime import datetime
from datecleaner import month_to_num
from job import Job
# The Village Family Services

organization = "The Village Family Services"
url = 'http://new.thevillagefs.org/jobs/type/default/'
organization_id= 55

def run(url):
    soup = get_soup(url)

    job_grid = soup.find('div', {'class': 'wpjb-job-list'})
    job_class= Job(organization, "")
    job_class.organization_id= organization_id
    insert_count= 0
    for job_div in job_grid.find_all('div', {'class': 'wpjb-col-main'}):
        major_line = job_div.find('div', {'class': 'wpjb-line-major'})
        job_class.title = major_line.a.text
        job_class.info_link = major_line.a['href']
        job_class.full_or_part = major_line.find(
            'span', {'class': 'wpjb-sub-title'}).text.strip()
        minor_line = job_div.find('div', {'class': 'wpjb-line-minor'})
        job_class.location = minor_line.find(
            'span', {'class': 'wpjb-job_location'}).text.strip()
        date = minor_line.find(
            'span', {'class': 'wpjb-job_created_at'}).text.strip().split(', ')
        month = month_to_num(date[0])
        day = int(date[1])
        if month <= datetime.now().month:
            year = datetime.now().year
        else:
            year = datetime.now().year - 1
        job_class.post_date= datetime(year, month, day)
        insert_count+= job_insert(job_class)
    return insert_count
