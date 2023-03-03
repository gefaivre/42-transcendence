#!/bin/bash

curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d "{ \"username\": \"$1\", \"password\": \"$2\" }"
