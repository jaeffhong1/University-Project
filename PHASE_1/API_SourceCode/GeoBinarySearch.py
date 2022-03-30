import os
from functools import lru_cache

path_to_locations = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "Locations",
    "CountryToGeoID2-sorted.txt",
)


@lru_cache
def find_GeoID(location):
    f = open(path_to_locations, encoding="ISO-8859-1")
    # Compute filesize
    hi = os.fstat(f.fileno()).st_size
    lo = 0
    while hi - lo > 1:
        mid = int((hi + lo) / 2)
        f.seek(mid)
        while f.read(1) != "\n":
            pass
        line = f.readline()
        line = line.split("\t")
        location_to_compare = line[0]

        if location < location_to_compare:
            hi = mid
            continue
        elif location > location_to_compare:
            lo = mid
            continue
        f.close()
        return int(line[1])
    f.close()
    return -1
