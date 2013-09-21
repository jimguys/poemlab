#!/bin/bash

SCRIPT_DIR=`dirname $0`
mkdir -p $SCRIPT_DIR/../logs
sudo nohup supervisor $SCRIPT_DIR/../app.js > /dev/null 2> $SCRIPT_DIR/../logs/error.log &
sudo nohup webhook-deployer -c $SCRIPT_DIR/webhook-deployer.config > $SCRIPT_DIR/../logs/deploy.log 2>&1 &