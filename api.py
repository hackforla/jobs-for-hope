#TODO: Refactor this class to be modular enough to use in the main app. Pass in app object
from flask import Flask, request, render_template
from flask_restful import reqparse, Api, Resource
from utilities.database_utilities import DatabaseUtilities

app = Flask(__name__)
api = Api(app)


database = DatabaseUtilities()

parser = reqparse.RequestParser()
parser.add_argument('job',location="form")

class Jobs(Resource):

    '''

        Handles requests to /api/v1/jobs
        Class that handles retrieving jobs from the database

    '''

    def get(self):

        '''

        Method that handles get request and returns jobs that match certain query criteria
        :return: matching_jobs: list
            List of jobs that match a certain criteria based on the query params

        '''


        #List of all data related to matching jobs
        matching_jobs = []

        #Get query parameters from the job search
        query = request.args.get("q")
        search_context = request.args.get("type")
        #sort = request.args.get("sort") #TODO: work on sorting feature. Implement in same class or a separate utils class

        if search_context == "keyword":
            matching_jobs = database.get_all_jobs_by_keyword(query)

        elif search_context == "region":
            matching_jobs = database.get_all_jobs_by_region(query)

        elif search_context == "skills":
            matching_jobs = database.get_all_jobs_by_skills_required(query)

        elif search_context == "duration":
            matching_jobs = database.get_all_jobs_by_duration(query)

        elif search_context == "responsibilities":
            matching_jobs = database.get_all_jobs_by_responsibilities(query)

        else:
            matching_jobs = database.get_all_jobs()

        return matching_jobs


class Job(Resource):

    '''

        Handles requests to /api/v1/job/<id>
        Class that handles retrieving specific information about a job

    '''

    def get(self,id):

        '''

        Method that handles the get request and returns information about a specific job with a specific id
        :param id: int
            Id of the job
        :return: job: list
            List of jobs that match the id

        '''

        job = database.get_job_by_id(id)
        return job

api.add_resource(Jobs,'/api/v1/jobs')
api.add_resource(Job,'/api/v1/job/<id>')
