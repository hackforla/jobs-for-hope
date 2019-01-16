c = ''
db = ''
organization_name = ''
job_title = ''
job_summary = ''
job_location = ''
job_zip_code = ''
job_post_date = ''
full_or_part = ''
salary = ''
info_link = ''

# FUNCTIONS

def error_handler(error_msg):
    print error_msg
    exit()

def reset_vars():
    global job_title
    global job_summary
    global job_location
    global job_zip_code
    global job_post_date
    global full_or_part
    global salary
    global info_link

    job_title = ""
    job_summary = ""
    job_location = ""
    job_zip_code = ""
    job_post_date = ""
    full_or_part = ""
    salary = ""
    info_link = ""

def print_vars():
    global job_title
    global job_summary
    global job_location
    global job_zip_code
    global job_post_date
    global full_or_part
    global salary
    global info_link

    print "Title: ", job_title
    print "Summary: ", job_summary
    print "Location: ", job_location
    print "Zip Code: ", job_zip_code
    print "Post Date: ", job_post_date
    print "Full or Part-Time: ", full_or_part
    print "Salary: ", salary
    print "Information: ", info_link

def create_table_jobs():
    global c
    global db
    query = 'CREATE TABLE IF NOT EXISTS jobs (date DATE, org VARCHAR, job_title VARCHAR, job_summary VARCHAR, job_location VARCHAR, job_zip_code VARCHAR, job_post_date DATE, full_or_part VARCHAR, salary VARCHAR, info_link VARCHAR)'
    try:
        c.execute(query)
        db.commit()
    except sqlite3.IntegrityError:
       error_handler('SQL ERROR FOR QUERY: ' + query)

def drop_table_jobs():
    query = 'DROP TABLE IF EXISTS jobs '
    try:
        c.execute(query)
        db.commit()
    except sqlite3.IntegrityError:
       error_handler('SQL ERROR FOR QUERY: ' + query)
