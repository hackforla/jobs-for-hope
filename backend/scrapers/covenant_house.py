import globals
from globals import get_soup, update_db

# Covenant House

organization = "Covenant House"
url = 'https://covca.hrmdirect.com/employment/job-openings.php?search=true&nohd=&dept=-1&city=-1&state=-1'


def run(url):
    soup = get_soup(url)
    jobs_list = soup.find_all("tr", {"class": "reqitem"})

    for job_entry in jobs_list:
        for child in job_entry.find_all("td", {"class": "posTitle"}):
            for child2 in child.find_all("a"):
                globals.job_title = child.text
                globals.info_link = "https://covca.hrmdirect.com/" + \
                    child2.get('href')
        for child in job_entry.find_all("td", {"class": "cities"}):
            job_location = child.text
        if(job_location == "Los Angeles"):
            update_db(organization)
