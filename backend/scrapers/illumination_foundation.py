import globals
from globals import get_soup, job_insert, clean_location, city_to_zip, date_ago
from job import Job
# Illumination Foundation

organization = "Illumination Foundation"
url = 'https://www.ifhomeless.org/careers/'
organization_id= 24

def run(url):
    soup = get_soup(url)

    jobs_list = soup.find_all('div', {'class': 'list-data'})
    job_class= Job(organization, "")
    job_class.organization_id= organization_id
    insert_count= 0
    for job_entry in jobs_list:
        job_info = job_entry.find('div', {'class': 'job-info'})
        job_class.title = job_info.find(
            'span', {'class': 'job-title'}).text.strip()
        job_class.info_link = job_info.h4.a['href']
        job_class.full_or_part = job_entry.find(
            'div', {'class': 'job-type'}).text.strip()
        job_class.location = clean_location(job_entry.find(
            'div', {'class': 'job-location'}).text.strip())
        job_class.zip_code = city_to_zip(job_class.location)
        relative_date = job_entry.find(
            'div', {'class': 'job-date'}).text.strip().split(' ')
        job_class.post_date = date_ago(
            int(relative_date[1]), relative_date[2])
        job_class.summary = job_entry.find(
            'div', {'class': 'job-description'}).p.text.strip()
        insert_count+= job_insert(job_class)
    return insert_count
