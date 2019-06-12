from datetime import datetime
import globals
from globals import get_soup, job_insert
from job import Job
# Special Service for Groups, Inc.

organization = "Special Service for Groups, Inc."
url = 'http://www.ssg.org/about-us/careers/'
organization_id= 47

def run(url):
    soup = get_soup(url)
    article = soup.find('article')
    jobs_list = article.find_all('p')
    job_class= Job(organization, "")
    job_class.organization_id= organization_id
    insert_count= 0
    for job_entry in jobs_list:
        if 'Posted ' in job_entry.text:
            job_element = job_entry.find('a')
            job_class.title = job_element.text
            job_class.info_link = job_element['href']
            date = job_entry.text.split('Posted ')[1].split('/')
            month = int(date[0])
            day = int(date[1])
            year = int(date[2])
            job_class.post_date = datetime(year, month, day)
            insert_count+= job_insert(job_class)
    return insert_count
