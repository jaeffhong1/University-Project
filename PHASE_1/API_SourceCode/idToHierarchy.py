import os
path_to_locations = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "Locations",
    "allCountries-sorted.txt",
)

path_to_hierarchy = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "Locations",
    "hierarchy-sorted2.txt",
)

path_to_locations2 = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "Locations",
    "allCountriesCode-sorted2.txt",
)

def find_hierarchy(geoid):
    hierarchy_list = []
    get_parents(geoid, hierarchy_list)

    for location in hierarchy_list:
        line = get_id_line(int(location))
        print(line[1], line[7])

def find_hierarchy2(geoid):
    hierarchy_list = []
    hierarchy_list.append(geoid)
    f_codes = ["ADM5", "ADM4", "ADM3", "ADM2", "ADM1", "PCLI", "CONT"]
    line = get_id_line(geoid)
    countryCode = line[8]
    current_fcode = line[7]
    i = 0
    if (current_fcode in f_codes):
        i = f_codes.index(current_fcode) + 1

    all_adminCodes = [line[10], line[11], line[12], line[13]]

    all_locations = find_all_CountryCodes(countryCode)
    while i < len(f_codes):
        for location in all_locations:
            parent = 1
            location_line = location.split("\t")
            location_fcode = location_line[2]
            if (location_fcode == f_codes[i]):
                if (f_codes[i].startswith("ADM")):
                    for j in range(4,8):
                        if (location_line[j] == ""):
                            continue
                        elif (location_line[j] != all_adminCodes[j-4]):
                            parent = 0
                            break
                    if parent:
                        hierarchy_list.append(location_line[0])
                else:
                    hierarchy_list.append(location_line[0])
        i += 1

    for location in hierarchy_list:
        line = get_id_line(int(location))
        print(line[1], line[7])

    last_location = hierarchy_list[-1]
    find_hierarchy(last_location)

def get_id_line(geoid):
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
        geoid_to_compare = int(line[0])

        if geoid < geoid_to_compare:
            hi = mid
            continue
        elif geoid > geoid_to_compare:
            lo = mid
            continue
        f.close()
        return line
    f.close()
    return -1

def get_parents(geoid, hierarchy_list):
    line = get_id_parent(int(geoid))
    if line == -1:
        return
    hierarchy_list.append(line[0])
    get_parents(line[0], hierarchy_list)


def get_id_parent(geoid):
    f = open(path_to_hierarchy, encoding="ISO-8859-1")
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
        geoid_to_compare = int(line[1])
        
        if geoid < geoid_to_compare:
            hi = mid
            continue
        elif geoid > geoid_to_compare:
            lo = mid
            continue
        f.close()
        return line
    f.close()
    return -1


def find_all_CountryCodes(countryCode):
    all_locations = []
    f2 = open(path_to_locations2, encoding="ISO-8859-1")
    found = 0
    for line in f2:
        break_line = line.split("\t")
        if break_line[3] == countryCode:
            found = 1
            all_locations.append(line)
        elif found == 1:
            break
    f2.close()
    return all_locations
        
#2171707 chatswood
#8176220 unsw

find_hierarchy2(2077456)