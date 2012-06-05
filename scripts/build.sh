clear;
python pylib/build_app.py
cp index.build.html google_app_engine_host/build/index.html
cp images/*.jpg google_app_engine_host/build/images
cp images/*.gif google_app_engine_host/build/images
cp images/*.png google_app_engine_host/build/images
ls -al  google_app_engine_host/build
ls -al  google_app_engine_host/build/images
ls -al pylib/.js_compress_build
ls -al pylib/.css_compress_build

echo 'http://gqlapp.appspot.com:8888/index.build.html'