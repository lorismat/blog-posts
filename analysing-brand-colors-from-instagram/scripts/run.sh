# test comment
echo "starting... init is required before running the script"
echo "running 'node reconnect.js ${1}'"
node reconnect.js ${1}
echo "finished running 'node reconnect.js'"
echo "running 'python dl.py ${1}'"
python dl.py ${1}
echo "finished running 'python dl.py'"
echo "running 'python kmeans.py ${1}'"
python kmeans.py ${1}
echo "finished running 'python kmeans.py'"
cp "./colors/${1}.json" "/Users/---/---/---/---/static/data/cities/${1}.json"
echo "...finished"
