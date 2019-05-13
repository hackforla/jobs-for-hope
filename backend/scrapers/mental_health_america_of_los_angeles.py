import globals
from globals import get_javascript_soup_delayed_and_click, get_soup, update_db

# Mental Health America of Los Angeles
organization = "Mental Health America of Los Angeles"
url = 'http://mhala.hrmdirect.com/employment/job-openings.php?nohd'


def run(url):
    soup = get_javascript_soup_delayed_and_click(url, 'hrmSearchButton')

    job_listings = soup.find_all('tr', {'class': 'ReqRowClick'})

    for job_row in job_listings:
        globals.job_title = job_row.find(
            'td', {'class': 'posTitle'}).text.strip()
        globals.info_link = 'http://mhala.hrmdirect.com/employment/' + \
            job_row.find('td', {'class': 'posTitle'}).a['href']
        globals.job_location = job_row.find('td', {'class': 'cities'}).text
        globals.job_zip_code = globals.city_to_zip(globals.job_location)
        job_soup = get_soup(globals.info_link)
        summary = job_soup.find(string=["Summary:", "Summary: "])
        if summary:
            summary_parent = summary.parent
            summary_parent.clear()
            globals.job_summary = summary_parent.find_parent("p").text.strip()
        else:
            globals.job_summary = ''
        update_db(organization)
