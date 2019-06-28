import globals
from globals import get_soup, get_javascript_soup, job_insert, clean_location, city_to_zip, date_ago
from job import Job
# Step Up on Second Street, Inc.

organization = "Step Up on Second Street, Inc."
url = "https://www.indeedjobs.com/step-up-on-second-street-inc/jobs"
organization_id = 49


def run(url):
    soup = get_javascript_soup(url)

    current_openings = soup.findAll(attrs={"data-tn-element": "jobLink[]"})
    job_class = Job(organization, "")
    job_class.organization_id = organization_id
    insert_count = 0
    for current_opening in current_openings:

        detail_page_link = current_opening.find('a')['href']
        detail_page_soup = get_soup(detail_page_link)
        detail_page_desc = detail_page_soup.find(
            'div', {"data-tn-component": "jobDescription"})

        job_class.title = detail_page_desc.find('h1').text.strip()

        job_summary_parts = detail_page_desc.findAll(['p', 'li'])
        job_class.summary = ' '.join(
            map(lambda a: a.getText(), job_summary_parts[1:-1])).strip()

        job_class.location = detail_page_desc.find(
            'dt', string="Location").findNext().get_text()

        location_parts = job_class.location.split(',')
        if len(location_parts) > 1 and len(
                location_parts[-1]
        ) and location_parts[-1].strip().lower() != 'ca':
            # skip job if state is not CA
            print('Skip location: %s' % job_class.location)
            continue
        job_class.zip_code = city_to_zip(location_parts[0])

        posted_ago = job_summary_parts[-1].get_text().split(' ')
        length = posted_ago[1]
        if (length[-1:] == '+'):
            length = length[:1]
        length = int(length)
        unit = posted_ago[2]
        job_class.post_date = date_ago(length, unit)

        job_class.full_or_part = detail_page_desc.find(
            'dt', string="Job Type").findNext().get_text()

        salary_search = detail_page_desc.find('dt', string="Salary")
        if (salary_search is not None):
            job_class.salary = salary_search.findNext().get_text()

        job_class.info_link = detail_page_link

        insert_count += job_insert(job_class)
    return insert_count
