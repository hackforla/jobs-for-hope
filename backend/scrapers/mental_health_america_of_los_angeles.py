import globals
from globals import get_javascript_soup_delayed_and_click, get_soup, job_insert
from job import Job
# Mental Health America of Los Angeles
organization = "Mental Health America of Los Angeles"
url = 'http://mhala.hrmdirect.com/employment/job-openings.php?nohd'
organization_id = 35


def run(url):
    soup = get_javascript_soup_delayed_and_click(url, 'hrmSearchButton')

    job_listings = soup.find_all('tr', {'class': 'ReqRowClick'})
    job_class = Job(organization, "")
    job_class.organization_id = organization_id
    insert_count = 0
    for job_row in job_listings:
        job_class.title = job_row.find('td', {
            'class': 'posTitle'
        }).text.strip()
        job_class.info_link = 'http://mhala.hrmdirect.com/employment/' + \
            job_row.find('td', {'class': 'posTitle'}).a['href']
        job_class.location = job_row.find('td', {'class': 'cities'}).text
        job_class.zip_code = globals.city_to_zip(job_class.location)
        job_soup = get_soup(job_class.info_link)
        summary = job_soup.find(string=["Summary:", "Summary: "])
        if summary:
            summary_parent = summary.parent
            summary_parent.clear()
            job_class.summary = summary_parent.find_parent("p").text.strip()
        else:
            job_class.summary = ''
        insert_count += job_insert(job_class)
    return insert_count
