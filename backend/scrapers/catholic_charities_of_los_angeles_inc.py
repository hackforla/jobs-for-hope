import globals
from globals import get_javascript_soup_delayed, job_insert, date_ago
from job import Job
# Catholic Charities Of Los Angeles, Inc.

organization = "Catholic Charities Of Los Angeles, Inc."
url = "https://workforcenow.adp.com/mascsr/default/mdf/recruitment/recruitment.html?cid=b4842dc2-cd32-4f0f-88d3-b259fbc96f09&ccId=19000101_000001&type=MP&lang"
organization_id= 9

def run(url):
    soup = get_javascript_soup_delayed(url, 'current-openings-item')
    jobs_list = soup.find_all('div', {'class': 'current-openings-details'})
    job_class= Job(organization, "")
    job_class.organization_id= organization_id
    insert_count=0
    for job_entry in jobs_list:
        job_class.title = job_entry.find(
            'span', {'class': 'current-opening-title'}).text.strip()
        if job_entry.find('span', {'class': 'current-opening-location-item'}):
            job_class.location = job_entry.find(
                'span', {'class': 'current-opening-location-item'}).text.strip()
        else:
            job_class.location = ''
        # Calculate post date relative to current date and store it
        posted_ago = job_entry.find(
            'span', {'class': 'current-opening-post-date'}).text.split(' ')
        if posted_ago[0] == 'a':
            job_class.post_date = date_ago(1, posted_ago[1])
        elif posted_ago[0].lower() == 'today':
            job_class.post_date = date_ago(0, 'day')
        elif posted_ago[0].lower() == 'yesterday':
            job_class.post_date = date_ago(1, 'day')
        elif posted_ago[0] == '30+':
            # over 30 days ago
            job_class.post_date = date_ago(31, posted_ago[1])
        else:
            job_class.post_date = date_ago(int(posted_ago[0]), posted_ago[1])
        if job_entry.find(
                'span', {'class': 'current-opening-worker-catergory'}):
            job_class.full_or_part = job_entry.find(
                'span', {'class': 'current-opening-worker-catergory'}).text.strip()
        else:
            job_class.full_or_part = ''
        job_class.info_link = 'https://workforcenow.adp.com/mascsr/default/mdf/recruitment/recruitment.html?cid=b4842dc2-cd32-4f0f-88d3-b259fbc96f09&ccId=19000101_000001&type=MP&lang'
        insert_count+= job_insert(job_class)
    return insert_count
