from globals import get_soup, job_insert
from job import Job

# Prototypes, A Program of Healthright 360

organization = "Prototypes, A Program of Healthright 360"
organization_id = 41
url = "https://www.healthright360.org"
initialPath = "/jobs?f%5B0%5D=field_related_location%3A26"


def run(url):
    soup = get_soup(url + initialPath)
    page = 1

    while soup:
        for html_element in soup.find_all('div', {'class': 'views-row'}):
            title = html_element.find('span', {
                'class': 'field-content'
            }).a.text
            job = Job(organization_id, title)
            location_div = html_element.find(
                'div', {'class': 'views-field-field-job-city'})
            if location_div:
                job.location = location_div.find('span', {
                    'class': 'field-content'
                }).text
            summarySpan = html_element.find(
                'div', {
                    'class': 'views-field views-field-body-summary'
                }).span

            if (summarySpan != None):
                #if (summarySpan.p != None):
                job.summary = summarySpan.text

            info_div = html_element.find('div', {'class': 'views-field-url'})
            job.info_link = info_div.find('span', {
                'class': 'field-content'
            }).a['href']
            info_soup = get_soup(job.info_link)
            salary_div = info_soup.find(
                'div', {'class': 'views-field-field-compensation-range'})
            if salary_div:
                job.salary = salary_div.find('span', {
                    'class': 'field-content'
                }).text
                hours_div = info_soup.find(
                    'div', {'class': 'views-field-field-hours-week'})
            if hours_div:
                hours = hours_div.find('span', {'class': 'field-content'}).text
                job.full_or_part = hours + ' hours/week'
            job_insert(job)
            print(job)

        # If there are more pages, update soup to next page and scrape
        if soup.find('a', {'title': 'Go to next page'}):
            next_page_button = soup.find('a', {'title': 'Go to next page'})
            next_page_url = url + next_page_button['href']
            print(next_page_url)
            soup = get_soup(next_page_url)
            page = page + 1
        else:
            soup = False
