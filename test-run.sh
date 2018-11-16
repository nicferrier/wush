#!/bin/bash

ls test*.js | while read file
do
    echo "testing $file"
    node $file
done

