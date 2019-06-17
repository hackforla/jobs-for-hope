import globals
from globals import get_soup, job_insert
from job import Job
# Covenant House

organization = "Covenant House"
url = 'https://covca.hrmdirect.com/employment/job-openings.php?search=true&nohd=&dept=-1&city=-1&state=-1'
organization_id= 15

def run(url):
    soup = get_soup(url)
    jobs_list = soup.find_all("tr", {"class": "reqitem"})
    job_class= Job(organization, "")
    job_class.organization_id= organization_id
    insert_count=0 
    for job_entry in jobs_list:
        for child in job_entry.find_all("td", {"class": "posTitle"}):
            for child2 in child.find_all("a"):
                job_class.title = child.text
                job_class.info_link = "https://covca.hrmdirect.com/" + \
                    child2.get('href')
        for child in job_entry.find_all("td", {"class": "cities"}):
            job_location = child.text
        if(job_location == "Los Angeles"):
            insert_count+= job_insert(job_class)
    return insert_count
