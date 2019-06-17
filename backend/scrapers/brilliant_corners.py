import globals
from globals import get_soup, job_insert
from job import Job
# Brilliant Corners

organization = "Brilliant Corners"
url = 'https://careers.jobscore.com/careers/brilliantcorners'
organization_id= 8

def run(url):
    soup = get_soup(url)
    jobs_list = soup.find_all("div", {"class": "js-job-container"})
    job_class= Job(organization, "")
    job_class.organization_id= organization_id
    insert_count= 0
    for job_entry in jobs_list:
        job_class.title = job_entry.find(
            "span", {"class", "js-job-title"}).a.text
        job_class.info_link = 'https://careers.jobscore.com' + \
            job_entry.find("span", {"class", "js-job-title"}).a['href']
        job_class.location = job_entry.find(
            "span", {"class", "js-job-location"}).text.strip()

        job_soup = get_soup(job_class.info_link)
        job_class.full_or_part = job_soup.find(
            "h2", {"class": "js-subtitle"}).text.split(' | ')[2]
        insert_count+= job_insert(job_class)
    return insert_count
