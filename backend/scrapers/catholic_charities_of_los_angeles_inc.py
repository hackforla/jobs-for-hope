import globals
from globals import get_javascript_soup_delayed, update_db, date_ago

# Catholic Charities Of Los Angeles, Inc.

organization = "Catholic Charities Of Los Angeles, Inc."
url = "https://workforcenow.adp.com/mascsr/default/mdf/recruitment/recruitment.html?cid=b4842dc2-cd32-4f0f-88d3-b259fbc96f09&ccId=19000101_000001&type=MP&lang"


def run(url):
    soup = get_javascript_soup_delayed(url, 'current-openings-item')
    jobs_list = soup.find_all('div', {'class': 'current-openings-details'})

    for job_entry in jobs_list:
        globals.job_title = job_entry.find(
            'span', {'class': 'current-opening-title'}).text.strip()
        if job_entry.find('span', {'class': 'current-opening-location-item'}):
            globals.job_location = job_entry.find(
                'span', {'class': 'current-opening-location-item'}).text.strip()
        else:
            globals.job_location = ''
        # Calculate post date relative to current date and store it
        posted_ago = job_entry.find(
            'span', {'class': 'current-opening-post-date'}).text.split(' ')
        if posted_ago[0] == 'a':
            globals.job_post_date = date_ago(1, posted_ago[1])
        elif posted_ago[0].lower() == 'today':
            globals.job_post_date = date_ago(0, 'day')
        elif posted_ago[0].lower() == 'yesterday':
            globals.job_post_date = date_ago(1, 'day')
        elif posted_ago[0] == '30+':
            # over 30 days ago
            globals.job_post_date = date_ago(31, posted_ago[1])
        else:
            globals.job_post_date = date_ago(int(posted_ago[0]), posted_ago[1])
        if job_entry.find(
                'span', {'class': 'current-opening-worker-catergory'}):
            globals.full_or_part = job_entry.find(
                'span', {'class': 'current-opening-worker-catergory'}).text.strip()
        else:
            globals.full_or_part = ''
        globals.info_link = 'https://workforcenow.adp.com/mascsr/default/mdf/recruitment/recruitment.html?cid=b4842dc2-cd32-4f0f-88d3-b259fbc96f09&ccId=19000101_000001&type=MP&lang'
        update_db(organization)
