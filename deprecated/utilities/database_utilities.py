import pymysql.cursors

class DatabaseUtilities():

    def __init__(self):
        #TODO: place the Python dictionary in charge of credentials here
        #TODO: place credentials in the environmental variables
        self.connection = "PUT CREDENTIALS HERE"

    def get_all_jobs(self):
        '''

        Method that gets all information about all jobs in the DB
        :return: results: list
            Job data from the DB in list format

        '''

        try:
            #Creates the database cursor responsibile for executing query and extracting data
            with self.connection.cursor() as cursor:
                sql = "SELECT * FROM JOBS"
                cursor.execute(sql)

                #Obtains all of the data from the query
                results = cursor.fetchall()


        except:
            #Catches the exceptions thrown by database errors
            results ={"Error":"Could not retrieve JOBS from the database"}

        finally:
            #Returns the result of the query or error message
            return results

    def get_all_jobs_by_keyword(self,keyword):

        '''

        Method that returns all jobs that match a certain keyword
        :param keyword: String
        :return: results: list
            Job data from the DB in list format

        '''

        try:

            # Creates the database cursor responsibile for executing query and extracting data
            with self.connection.cursor() as cursor:
                sql = "SELECT * FROM JOBS WHERE KEYWORDS LIKE %s"

                #Wildcard tags to search for the keyword as a substring
                cursor.execute(sql,'%'+keyword+'%')

                # Obtains all of the data from the query
                results = cursor.fetchall()


        except:
            # Catches the exceptions thrown by database errors
            results = {"Error": "Could not retrieve JOBS from the database"}

        finally:
            # Returns the result of the query or error message
            return results

    def get_all_jobs_by_region(self,region):

        '''

        Method that returns all jobs that reside in a certain region
        :param region: String
        :return: results: list
            Job data from the DB in list format
        '''

        try:

            # Creates the database cursor responsibile for executing query and extracting data
            with self.connection.cursor() as cursor:
                sql = "SELECT * FROM JOBS WHERE REGION LIKE %s"
                cursor.execute(sql,'%'+region+'%')

                # Obtains all of the data from the query
                results = cursor.fetchall()


        except:
            # Catches the exceptions thrown by database errors
            results = {"Error": "Could not retrieve JOBS from the database"}

        finally:
            # Returns the result of the query or error message
            return results

    def get_all_jobs_by_skills_required(self,skills):

        '''

        Method that returns jobs that match a certain skillset
        :param skills: String
        :return: results: list
            Job data from the DB in list format

        '''

        try:

            # Creates the database cursor responsibile for executing query and extracting data
            with self.connection.cursor() as cursor:
                sql = "SELECT * FROM JOBS WHERE SKILLS_REQUIRED LIKE %s"
                cursor.execute(sql,'%'+skills+'%')

                # Obtains all of the data from the query
                results = cursor.fetchall()


        except:
            # Catches the exceptions thrown by database errors
            results = {"Error": "Could not retrieve JOBS from the database"}

        finally:
            # Returns the result of the query or error message
            return results

    def get_all_jobs_by_responsibilities(self,responsibilities):

        '''

        Method that returns all jobs by responsibilities
        :param responsibilities: String
        :return: results
            Job data from the DB in list format

        '''

        try:

            # Creates the database cursor responsibile for executing query and extracting data
            with self.connection.cursor() as cursor:
                sql = "SELECT * FROM JOBS WHERE RESPONSIBILITIES LIKE %s"
                cursor.execute(sql,'%'+responsibilities+'%')

                # Obtains all of the data from the query
                results = cursor.fetchall()


        except:
            # Catches the exceptions thrown by database errors
            results = {"Error": "Could not retrieve JOBS from the database"}

        finally:
            # Returns the result of the query or error message
            return results

    def get_all_jobs_by_duration(self,duration):

        '''

        Method that returns all jobs by duration (full time or part time)
        :param duration: String
        :return: results: list
            Job data from the DB in list format

        '''

        try:

            # Creates the database cursor responsibile for executing query and extracting data
            with self.connection.cursor() as cursor:
                sql = "SELECT * FROM JOBS WHERE DURATION LIKE %s"
                cursor.execute(sql,'%'+duration+'%')

                # Obtains all of the data from the query
                results = cursor.fetchone()


        except:
            # Catches the exceptions thrown by database errors
            results = {"Error": "Could not retrieve JOBS from the database"}

        finally:
            # Returns the result of the query or error message
            return results

    def get_job_by_id(self,id):

        '''

        :param id: int
        :return: results
            Specific information about jobs that match a certain id

        '''

        try:

            with self.connection.cursor() as cursor:
                sql = "SELECT `*` FROM JOBS WHERE `JOB_ID` = %s"
                cursor.execute(sql,id)
                result = cursor.fetchall()

        except:
            result ={"Error":"Could not retrieve JOBS from the database"}

        finally:
            return result
