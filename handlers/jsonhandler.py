__author__ = 'andrewpboyle'
from handlers.handler import Handler
import json


class JSONHandler(Handler):
    def render_json(self, values):
        json_value = json.dumps(values)
        self.response.headers['Content-Type'] = "application/json"
        self.write(json_value)