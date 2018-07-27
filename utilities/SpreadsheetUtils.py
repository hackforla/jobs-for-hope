import openpyxl
import MySQLdb

def pre_process_skills(skills):

    # Splits the data on new line tags ("\n")
    skills_list = [s.strip() for s in skills.splitlines()]
    return skills_list


def pre_process_responsibilities(responsibilities):

    #Splits the data on new line tags ("\n")
    responsibilities_list =[s.strip() for s in responsibilities.splitlines()]
    return responsibilities_list


def pre_process_keywords(keywords):

    #Splits the data on encountered commas
    keywords_list = [word for word in keywords.split(",")]
    return keywords_list

def create_data_dictionary():
    workbook = openpyxl.load_workbook('jfh.xlsx')

    main_sheet = workbook.get_sheet_by_name("Sheet1")

    data_dictionary_list = []

    for row in range(2, 30):
        data_dictionary={}
        job_title = main_sheet["A" + str(row)].value
        employer_name = main_sheet["B" + str(row)].value
        employer_address = main_sheet["C" + str(row)].value
        region = main_sheet["D" + str(row)].value
        location = main_sheet["E" + str(row)].value
        skills_required = main_sheet["F" + str(row)].value
        responsibilities = main_sheet["G" + str(row)].value
        duration = main_sheet["H" + str(row)].value
        benefits = main_sheet["I" + str(row)].value
        salary = main_sheet["J" + str(row)].value
        keywords = main_sheet["K" + str(row)].value
        contact = main_sheet["L" + str(row)].value
        original_posting = main_sheet["M" + str(row)].value

        #responsibilities = pre_process_responsibilities(responsibilities)
        #keywords = pre_process_keywords(keywords)
        #skills_required = pre_process_skills(skills_required)

        data_dictionary["job_title"]=job_title
        data_dictionary["employer_name"]=employer_name
        data_dictionary["employer_address"]=employer_address
        data_dictionary["regions"]=region
        data_dictionary["location"]=location
        data_dictionary["skills_required"]=skills_required
        data_dictionary["responsibilities"]=responsibilities
        data_dictionary["duration"]=duration
        data_dictionary["benefits"]=benefits
        data_dictionary["salary"]=salary
        data_dictionary["keywords"]=keywords
        data_dictionary["contact"]=contact
        data_dictionary["original_posting"]=original_posting

        data_dictionary_list.append(data_dictionary)
        print(data_dictionary_list)

        db = MySQLdb.connect(host="localhost",  # your host, usually localhost
                             user="root",  # your username
                             passwd="r4zb6yp2",  # your password
                             db="jobs_for_hope")  # name of the data base

        db.set_character_set("utf8")

        cur = db.cursor()

        try:
            cur.execute("INSERT INTO JOBS (JOB_TITLE,EMPLOYER_NAME,EMPLOYER_ADDRESS,"
                        "REGION,LOCATION,SKILLS_REQUIRED,RESPONSIBILITIES,DURATION,"
                        "BENEFITS,SALARY,KEYWORDS,CONTACT,ORIGINAL_POSTING) values "
                        "('%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s')"
                        % (job_title,employer_name,employer_address,region
                           ,location,skills_required,responsibilities,duration,benefits,salary,keywords,contact,original_posting))
            db.commit()

        except Exception as e:
            print("Rolling back")
            print(e)
            db.rollback()

        db.close()


    return data_dictionary_list

def write_jobs_to_db():

    pass


jobs_date = create_data_dictionary()
#write_jobs_to_db()
