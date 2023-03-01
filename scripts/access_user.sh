#!/bin/bash

# $1 and $2 must be valid username and pasword in database

jwt=$(curl --silent -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d "{ \"username\": \"$1\", \"password\": \"$2\" }" | jq -r .access_token)

curl --silent http://localhost:3000/profile -H "Authorization: Bearer $jwt"
