#!/bin/bash

prod="let base = 'https:\/\/board.festech.de\/api';"
oldFile=$(cat src/variables.ts)

echo "$(sed "1s/.*/$prod/1" src/variables.ts)" > src/variables.ts

npm run build
cd dist
tar -czf files.tar.gz ./*
ssh linode 'cd /var/www/board.festech.de && rm -rf ./*'
scp files.tar.gz linode:/var/www/board.festech.de
ssh linode 'cd /var/www/board.festech.de && tar -xzf files.tar.gz'

cd ..
echo "$oldFile" > src/variables.ts