import globals
from globals import get_soup, job_insert
from job import Job
# Antelope Valley Domestic Violence Council (Valley Oasis)

organization = "Antelope Valley Domestic Violence Council (Valley Oasis)"
url = 'http://www.valleyoasis.org/job-opportunities.html'
organization_id = 4


def run(url):
    soup = get_soup(url)
    jobs_list = soup.find("div", {
        "itemtype": "http://schema.org/WebPage"
    }).find_all('a')
    job_class = Job(organization, "")
    job_class.organization_id = organization_id
    insert_count = 0
    for job_entry in jobs_list:
        temp_link = job_entry['href']
        job_class.title = job_entry.text

        if (job_entry['href'][0:4] == 'http'):
            job_class.info_link = temp_link
        else:
            job_class.info_link = 'http://www.valleyoasis.org' + temp_link

        insert_count += job_insert(job_class)
    return insert_count
