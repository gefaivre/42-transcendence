#!/bin/bash

curl -X DELETE http://localhost:3000/users/$1 -H "Content-Type: application/json"
