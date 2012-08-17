from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app

import time

ManifestText = '''
CACHE MANIFEST
# Cache Time %(timestamp)s
# UA = %(ua)s

CACHE:
http://connect.facebook.net/en_US/all.js
%(cachedFiles)s

NETWORK:
*
'''

ManifestTimeStamp = time.time()


class MainPage(webapp.RequestHandler) :
  def get(self) :
    ua = str(self.request.headers['User-Agent'])

    if 'Android' in ua:
      self.redirect('/1x')
      return

    if 'iPad' in ua:
      self.redirect('/6x')
      return

    self.redirect('/2x')

class FavIcon(webapp.RequestHandler) :
  def get(self) :
    self.response.headers['Content-Type'] = 'image/x-icon'
    self.response.out.write('')

class Manifest(webapp.RequestHandler) :
  def get(self) :
    ua = str(self.request.headers['User-Agent'])
    if 'Android' in ua:
      cachedFiles = [
        # '/1x',
        # '/images/menu-2x.png',
        # '/images/messages.png',
        # '/images/notifications.png  ',
        # '/images/requests-2x.png',
        # '/images/spyglass-2x.png'
      ]
    else:
      cachedFiles = [
        # '/2x',
        # '/images/menu-2x.png',
        # '/images/messages-2x.png',
        # '/images/notifications-2x.png ',
        # '/images/requests-2x.png',
        # '/images/spyglass-2x.png'
      ]

    self.response.headers['Content-Type'] = 'text/cache-manifest'
    self.response.out.write((ManifestText % {
      'timestamp': ManifestTimeStamp,
      'ua': ua,
      'cachedFiles': '\n'.join(cachedFiles)
    }).strip())

application = webapp.WSGIApplication(
  [
    ('/', MainPage),
    ('/favicon.ico', FavIcon),
    ('/cache.manifest', Manifest),

  ], debug=True)

def main() :
  run_wsgi_app(application)

if __name__ == "__main__" :
  main()
