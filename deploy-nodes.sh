#!/bin/bash
# Deploy custom nodes to running n8n container
# Use this after making changes to your nodes

docker cp ./dist n8n-byteplus-dev:/home/node/.n8n/custom/n8n-nodes-byteplus/
docker cp ./package.json n8n-byteplus-dev:/home/node/.n8n/custom/n8n-nodes-byteplus/
docker restart n8n-byteplus-dev
echo "Custom nodes deployed and n8n restarted"
