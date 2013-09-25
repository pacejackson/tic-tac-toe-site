__author__ = 'andrewpboyle'
from handlers.jsonhandler import JSONHandler
import json


class TicTacToeAPIHandler(JSONHandler):
    def get(self):
        self.response.headers.add_header('Access-Control-Allow-Origin', '*')
    # do something

    def post(self):
        self.response.headers.add_header('Access-Control-Allow-Origin', '*')
    # do something

    def options(self):
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        self.response.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept'

