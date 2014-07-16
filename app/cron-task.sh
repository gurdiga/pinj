#!/bin/bash

set -e

APP_DIR=`dirname $0`
/usr/local/bin/node "$APP_DIR/app/index.js" "Romanescu Constantin" "Cebanu Valentina"
