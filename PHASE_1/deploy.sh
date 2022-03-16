set -xe    # print commands as they are run, and exit as soon as one command fails

echo "$(whoami) deploying"

pushd PHASE_1/API_SourceCode

# rescrape
touch /home/web/posts.json  # if the file doesn't exists, scrapy crashes. It just needs to be looked after
scrapy crawl posts -a num_pages=-1 -a file_to_output=/home/web/posts.json -o /home/web/posts.json -t jsonlines

popd

# TODO: re parse reports

# restart the server
systemctl restart seng3011

echo "All done! Wait a few seconds for the web server to finish restarting and changes should be live"
