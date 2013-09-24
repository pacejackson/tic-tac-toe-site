__author__ = 'andrewpboyle'

import jinja2
import os


template_dir = os.path.join(os.path.dirname(__file__), 'templates')

jinja_environment = jinja2.Environment(autoescape=True,
                                       loader=jinja2.FileSystemLoader(template_dir))