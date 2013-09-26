__author__ = 'andrewpboyle'
from handlers.handler import Handler
import json


class JSONHandler(Handler):
    """
    Base JSON handler.  Provides a method to set the content type of the response
    to JSON and write the provided values.
    """
    def render_json(self, values):
        """
        Render values as JSON, note that values will be converted to JSON by the
        method, so no need to do that before.

        values - values to be written as JSON by the response.
        """
        json_value = json.dumps(values)
        self.response.headers['Content-Type'] = "application/json"
        self.write(json_value)