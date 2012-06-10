from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app

class MainPage(webapp.RequestHandler) :
  def get(self) :
    ua = str(self.request.headers['User-Agent'])

    if 'Android' in ua:      
      # self.redirect('/android')
      self.redirect('/1x')
      return
      
    self.redirect('/2x')
      

#    self.response.headers['Content-Type'] = 'text/plain'
#    self.response.out.write('Hello, webapp World!')

application = webapp.WSGIApplication(
  [('/', MainPage)], debug=True)

def main() :
  run_wsgi_app(application)

if __name__ == "__main__" :
  main()