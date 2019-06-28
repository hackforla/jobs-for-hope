class Job:
    """ A job posting """

    def __init__(self, organization_name, job_title):
        self.organization_name = organization_name
        self.title = job_title
        self.organization_id = ''
        self.summary = ''
        self.location = ''
        self.zip_code = ''
        self.post_date = None
        self.full_or_part = ''
        self.salary = ''
        self.info_link = ''
        self.scrape_date = None