#!/bin/bash

WORKING_DIR=/opt/serious-boomerang/
INCOMING=/opt/serious-boomerang/new/
NPMPID=/opt/serious-boomerang/current.pid
STDOUT=/opt/serious-boomerang/serious-boomerang.stdout.log
STDERR=/opt/serious-boomerang/serious-boomerang.stderr.log

cd $WORKING_DIR

if [ ! -f "$INCOMING/.complete" ]; then
    exit 0
fi

# get the current running pid
if [ -f "$NPMPID" ]; then
    CURPID=$(cat $NPMPID)
else
    CURPID=-1
fi

# kill it in case its running:
kill $(cat $NPMPID)

# Remove the old app:
rm -rf app.really.old
mv app.old app.really.old
mv app app.old
mv new app

# Copy the existing configuration
cp app.old/server/config/local.env.js app/server/config/local.env.js

# Restart the app.
cd app; NODE_ENV=production node server/app.js > $(echo $STDOUT) 2> $(echo $STDERR) &

echo "$!" > $NPMPID

exit 0
