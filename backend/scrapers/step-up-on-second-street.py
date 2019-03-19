import globals
from globals import get_soup, get_javascript_soup, update_db, reset_vars, clean_location, city_to_zip, date_ago

# Step Up on Second Street, Inc.

organization = "Step Up on Second Street"
url = "https://www.indeedjobs.com/step-up-on-second-street-inc/jobs"

def run(url):
    soup = get_javascript_soup(url)

    current_openings = soup.findAll(attrs={"data-tn-element" : "jobLink[]"})

    for current_opening in current_openings:

        detail_page_link = current_opening.find('a')['href']
        detail_page_soup = get_soup(detail_page_link)
        detail_page_desc = detail_page_soup.find('div', {"data-tn-component": "jobDescription"})

        globals.job_title = detail_page_desc.find('h1').text.strip()

        job_summary_parts = detail_page_desc.findAll(['p', 'li'])
        globals.job_summary = ' '.join(map(lambda a : a.getText(), job_summary_parts[1:-1])).strip()

        globals.job_location = detail_page_desc.find('dt' , string="Location").findNext().get_text()
        globals.job_zip_code = city_to_zip(globals.job_location)

        posted_ago = job_summary_parts[-1].get_text().split(' ')
        length = posted_ago[1]
        if (length[-1:] == '+'):
            length = length[:1]
        length = int(length)
        unit = posted_ago[2]
        globals.job_post_date = date_ago(length, unit)

        globals.full_or_part = detail_page_desc.find('dt' , string="Job Type").findNext().get_text()

        salary_search = detail_page_desc.find('dt' , string="Salary")
        if (salary_search is not None):
            globals.salary = salary_search.findNext().get_text()

        globals.info_link = detail_page_link

        update_db(organization)
        reset_vars()
