clear;
python pylib/build_app.py
cp index.build.html google_app_engine_host/build/index.html
cp images/* google_app_engine_host/build/images
ls -al  google_app_engine_host/build
ls -al  google_app_engine_host/build/images
