__author__ = 'andrewpboyle'
import webapp2
import utils


class Handler(webapp2.RequestHandler):
    user = None

    def write(self, *a, **kw):
        self.response.write(*a, **kw)

    def render_str(self, template, **params):
        t = utils.jinja_environment.get_template(template)
        return t.render(params)

    def render(self, template, **kw):
        self.write(self.render_str(template, **kw))