# SENG3011\_f0b5

Install black:

```
pip install virtualenv
cd PHASE_1/API_SourceCode/
virtualenv .venv
. .venv/bin/activate
pip install black
```

Get black to work with VSCode: <https://dev.to/adamlombard/how-to-use-the-black-python-code-formatter-in-vscode-3lo0>

It'll format your code on save, so you don't have to worry about it.

Regardless, if you want to run black manually, you can do:

    black PHASE_1/API_SourceCode
    
Install scrapy:

```
pip install scrapy
```

To run the scrapy, go into the API_SourceCode directory and run the command 
```
scrapy crawl posts -a num_pages=1 -a file_to_output=posts.json -o posts.json
```
Replace num_pages with the amount of pages you want to scrape, if you want to scrape every page then set it as -1
Set the file_to_output to a json file you want to output the scraped data to

The scraped data will go into the projscrape/post.json file.
=======
    black PHASE_1/API_SourceCode

## References
- https://www.digitalocean.com/community/tutorials/how-to-serve-flask-applications-with-uswgi-and-nginx-on-ubuntu-18-04
