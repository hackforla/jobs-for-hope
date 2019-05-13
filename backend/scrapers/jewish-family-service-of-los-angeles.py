import globals
from globals import get_soup, get_javascript_soup, update_db, clean_location, city_to_zip

# Jewish Family Service of Los Angeles

organization = "Jewish Family Service of Los Angeles"
url = 'https://chm.tbe.taleo.net/chm02/ats/careers/searchResults.jsp?org=JFSLA&cws=1&org=JFSLA'

def run(url):
    soup = get_javascript_soup(url)

    jobs_list = soup.find('table', {'id':'cws-search-results'}).find_all('tr')[1:]

    for job_entry in jobs_list:
        row_cells = job_entry.find_all('td')
        globals.job_title = row_cells[1].a.text.strip()
        globals.info_link = row_cells[1].a['href']
        globals.job_location = clean_location(row_cells[2].text)
        globals.job_zip_code = city_to_zip(globals.job_location)
        job_soup = get_soup(globals.info_link)
        globals.full_or_part = job_soup.find(text="Employment Duration:").parent.parent.b.text.strip()
        update_db(organization)
