clear;
python pylib/build_app.py > pylib/.js_compress_build/logs.txt
cp index.2x.html google_app_engine_host/build/index.html
cp index.1x.html google_app_engine_host/build/1x.html
cp images/*.jpg google_app_engine_host/build/images
cp images/*.gif google_app_engine_host/build/images
cp images/*.png google_app_engine_host/build/images
ls -al  google_app_engine_host/build
ls -al  google_app_engine_host/build/images
ls -al pylib/.js_compress_build
ls -al pylib/.css_compress_build

echo pylib/.js_compress_build/logs.txt
echo 'http://gqlapp.appspot.com:8888/index.build.html'