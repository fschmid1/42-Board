#!/bin/bash

ssh linode 'cd /opt/board/ && git reset --hard && git pull && cd backend && docker compose up -d --build --force-recreate'