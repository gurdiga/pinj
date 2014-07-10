#!/bin/bash

set -e

cd `dirname $0`
/usr/local/bin/node `pwd`/index.js "cebanu valentina:CA Chisinau" | mail -s 'PINJ updates' gurdiga@gmail.com
