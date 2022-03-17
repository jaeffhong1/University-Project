import json
from report_parser import parse_article
import sys

posts_file = "./posts.json"

if __name__ == "__main__":
    skip = int(sys.argv[1])
    do = int(sys.argv[2])
    print(f'skip={skip} do={do}')

    with open(posts_file) as posts, open(f'db_reports/reports-{skip}-{skip+do}.json', 'w') as freports:
        for i in range(skip):
            next(posts)

        for i, line in enumerate(posts):
            article = json.loads(line)

            for report in parse_article(article):
                json.dump(report, freports)
                freports.write('\n')
            print('done', i, 'posts')
            i += 1
            if i > do:
                break


