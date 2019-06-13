import globals
from globals import get_soup, get_javascript_soup, job_insert, clean_location, city_to_zip
from job import Job
# Jewish Family Service of Los Angeles

organization = "Jewish Family Service of Los Angeles"
url = 'https://chm.tbe.taleo.net/chm02/ats/careers/searchResults.jsp?org=JFSLA&cws=1&org=JFSLA'
organization_id= 26

def run(url):
    soup = get_javascript_soup(url)

    jobs_list = soup.find(
        'table', {'id': 'cws-search-results'}).find_all('tr')[1:]
    job_class= Job(organization, "")
    job_class.organization_id= organization_id
    insert_count= 0
    for job_entry in jobs_list:
        row_cells = job_entry.find_all('td')
        job_class.title = row_cells[1].a.text.strip()
        job_class.info_link = row_cells[1].a['href']
        job_class.location = clean_location(row_cells[2].text)
        job_class.zip_code = city_to_zip(job_class.location)
        job_soup = get_soup(job_class.info_link)
        job_class.full_or_part = job_soup.find(
            text="Employment Duration:").parent.parent.b.text.strip()
        insert_count+= job_insert(job_class)
    return insert_count
