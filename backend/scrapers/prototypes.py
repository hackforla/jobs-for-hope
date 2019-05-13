import globals
from globals import get_soup, update_db

# Prototypes, A Program of Healthright 360

organization = "Prototypes, A Program of Healthright 360"
url = "https://www.healthright360.org/jobs?f%5B0%5D=field_related_location%3A26"


def run(url):
    soup = get_soup(url)
    page = 1

    while soup:
        for html_element in soup.find_all('div', {'class': 'views-row'}):
            globals.job_title = html_element.find('span', {
                'class': 'field-content'
            }).a.text
            location_div = html_element.find(
                'div', {'class': 'views-field-field-job-city'})
            if location_div:
                globals.job_location = location_div.find('span', {
                    'class': 'field-content'
                }).text
            info_div = html_element.find('div', {'class': 'views-field-url'})
            globals.info_link = info_div.find('span', {
                'class': 'field-content'
            }).a['href']
            info_soup = get_soup(globals.info_link)
            salary_div = info_soup.find(
                'div', {'class': 'views-field-field-compensation-range'})
            if salary_div:
                globals.salary = salary_div.find('span', {
                    'class': 'field-content'
                }).text
                hours_div = info_soup.find(
                    'div', {'class': 'views-field-field-hours-week'})
            if hours_div:
                hours = hours_div.find('span', {'class': 'field-content'}).text
                globals.full_or_part = hours + ' hours/week'
            update_db(organization)

        # If there are more pages, update soup to next page and scrape
        if soup.find('a', {'title': 'Go to next page'}):
            next_page_button = soup.find('a', {'title': 'Go to next page'})
            next_page_url = url + next_page_button['href']
            soup = get_soup(next_page_url)
            page = page + 1
        else:
            soup = False
