set -xe    # print commands as they are run, and exit as soon as one command fails

echo "$(whoami) deploying"

# TODO: re-scrape
# TODO: re parse reports

# restart the server
systemctl restart seng3011

echo "All done! Wait a few seconds for the web server to finish restarting and changes should be live"
