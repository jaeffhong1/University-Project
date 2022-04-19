import os

path_to_locations = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "db2", "CountryToGeoID2-sorted3.txt"
)


geoid_db_file = None
try:
    geoid_db_file = open(path_to_locations, encoding="ISO-8859-1")
except FileNotFoundError:
    print("no geo id file, we assume we are running on the pipeline?")


def find_geo_id(location):
    location = location.replace("'s", "").replace("The ", "").title()
    # Compute filesize
    hi = os.fstat(geoid_db_file.fileno()).st_size
    lo = 0
    geoid_db_file.seek(0)
    while hi - lo > 1:
        mid = int((hi + lo) / 2)
        geoid_db_file.seek(mid)
        while geoid_db_file.read(1) != "\n":
            pass
        line = geoid_db_file.readline()
        line = line.split("\t")
        location_to_compare = line[0]

        if location < location_to_compare:
            hi = mid
            continue
        elif location > location_to_compare:
            lo = mid
            continue
        # geoid_db_file.close()
        return int(line[1])
    # f.close()
    return -1


if __name__ == "__main__":
    import json

    with open("db2/full-articles.json") as fp:
        for line in fp:
            article = json.loads(line)
            for report in article["reports"]:
                for location in report["locations"]:
                    if find_geo_id(location) < 0:
                        print("y")
                    else:
                        print("x")
