class Job:
    """ A job posting """

    def __init__(self, organization_id, title):

        self.organization_id = organization_id
        self.title = title
        self.summary = ''
        self.location = ''
        self.zip_code = ''
        self.post_date = None
        self.full_or_part = ''
        self.salary = ''
        self.info_link = ''
        self.scrape_date = None