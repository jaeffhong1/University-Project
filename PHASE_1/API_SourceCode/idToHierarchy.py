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
    "allCountriesCode-sorted4.txt",
)
global_hierarchy_list = []


def find_hierarchy(geoid):
    hierarchy_list = []
    get_parents(geoid, hierarchy_list)

    for location in hierarchy_list:
        global_hierarchy_list.append(location)


def find_hierarchy2(geoid):
    if global_hierarchy_list:
        global_hierarchy_list.clear()
    hierarchy_list = []
    hierarchy_list.append(geoid)
    f_codes = ["ADM5", "ADM4", "ADM3", "ADM2", "ADM1", "PCLI"]
    line = get_id_line(geoid)
    countryCode = line[8]
    current_fcode = line[7]
    i = 0
    if current_fcode in f_codes:
        i = f_codes.index(current_fcode) + 1

    all_adminCodes = [line[10], line[11], line[12], line[13]]

    all_locations = get_allCountryCodes(countryCode)
    while i < len(f_codes):
        for location in all_locations:
            parent = 1
            location_fcode = location[2]
            if location_fcode == f_codes[i]:
                if f_codes[i].startswith("ADM"):
                    for j in range(4, 8):
                        if location[j] == "":
                            continue
                        elif location[j] != all_adminCodes[j - 4]:
                            parent = 0
                            break
                    if parent:
                        hierarchy_list.append(location[0])
                else:
                    hierarchy_list.append(location[0])
        i += 1

    for location in hierarchy_list:
        global_hierarchy_list.append(location)

    last_location = hierarchy_list[-1]
    find_hierarchy(last_location)

    all_location_tuple = []
    sliced_global_hierarchy_list = global_hierarchy_list[-4:]
    sliced_global_hierarchy_list.insert(0, geoid)
    for location in sliced_global_hierarchy_list[:-1]:
        line = get_id_line(int(location))
        location_tuple = (line[0], line[2], line[4], line[5])
        all_location_tuple.append(location_tuple)

    return all_location_tuple


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


a = {
    "": 0,
    "AD": 7,
    "AE": 15,
    "AF": 43,
    "AG": 477,
    "AI": 486,
    "AL": 500,
    "AM": 959,
    "AO": 982,
    "AR": 1165,
    "AS": 1771,
    "AT": 1798,
    "AU": 4030,
    "AX": 4578,
    "AZ": 4597,
    "BA": 4694,
    "BB": 4868,
    "BD": 4880,
    "BE": 10143,
    "BF": 10783,
    "BG": 10892,
    "BH": 13775,
    "BI": 13780,
    "BJ": 16535,
    "BM": 17164,
    "BN": 17175,
    "BO": 17204,
    "BQ": 17783,
    "BR": 17786,
    "BS": 23449,
    "BT": 23482,
    "BW": 23530,
    "BY": 23573,
    "BZ": 23815,
    "CA": 23824,
    "CD": 25978,
    "CF": 26399,
    "CG": 26489,
    "CH": 26591,
    "CI": 28938,
    "CK": 29220,
    "CL": 29238,
    "CM": 29657,
    "CN": 29746,
    "CO": 42658,
    "CR": 44151,
    "CU": 44716,
    "CV": 44902,
    "CY": 44957,
    "CZ": 45580,
    "DE": 52007,
    "DJ": 63402,
    "DK": 63412,
    "DM": 63517,
    "DO": 63528,
    "DZ": 78232,
    "EC": 79073,
    "EE": 80356,
    "EG": 85157,
    "ER": 85320,
    "ES": 85385,
    "ET": 93642,
    "FI": 94009,
    "FJ": 94391,
    "FM": 94498,
    "FO": 94580,
    "FR": 94618,
    "GA": 129967,
    "GB": 130026,
    "GD": 141816,
    "GE": 141824,
    "GF": 141945,
    "GG": 141971,
    "GH": 141982,
    "GL": 142216,
    "GM": 142239,
    "GN": 142283,
    "GP": 142629,
    "GQ": 142665,
    "GR": 142743,
    "GT": 143138,
    "GU": 143501,
    "GW": 143520,
    "GY": 143569,
    "HK": 143580,
    "HN": 143598,
    "HR": 143915,
    "HT": 144520,
    "HU": 145290,
    "ID": 145508,
    "IE": 187433,
    "IL": 187470,
    "IM": 187502,
    "IN": 187526,
    "IQ": 188510,
    "IR": 188719,
    "IS": 189192,
    "IT": 189274,
    "JE": 197478,
    "JM": 197490,
    "JO": 198330,
    "JP": 198434,
    "KE": 200911,
    "KG": 201008,
    "KH": 201073,
    "KI": 202919,
    "KM": 202956,
    "KN": 202960,
    "KP": 202975,
    "KR": 203498,
    "KW": 209855,
    "KY": 209971,
    "KZ": 209977,
    "LA": 210300,
    "LB": 210467,
    "LC": 210507,
    "LI": 211064,
    "LK": 211076,
    "LR": 225458,
    "LS": 226315,
    "LT": 226474,
    "LU": 227089,
    "LV": 227207,
    "LY": 227838,
    "MA": 227863,
    "MC": 230453,
    "MD": 230455,
    "ME": 230493,
    "MG": 230518,
    "MH": 249701,
    "MK": 249734,
    "ML": 249816,
    "MM": 249931,
    "MN": 250350,
    "MO": 250768,
    "MP": 250776,
    "MQ": 250792,
    "MR": 250832,
    "MS": 250904,
    "MT": 250907,
    "MU": 250976,
    "MV": 250989,
    "MW": 251011,
    "MX": 251047,
    "MY": 253540,
    "MZ": 253937,
    "NA": 254122,
    "NC": 254185,
    "NE": 254221,
    "NG": 254353,
    "NI": 258330,
    "NL": 258508,
    "NO": 258889,
    "NP": 259272,
    "NR": 260111,
    "NZ": 260126,
    "OM": 260211,
    "PA": 260284,
    "PE": 261005,
    "PF": 263101,
    "PG": 263157,
    "PH": 263274,
    "PK": 282147,
    "PL": 282326,
    "PM": 285269,
    "PR": 285271,
    "PS": 286395,
    "PT": 286413,
    "PW": 291002,
    "PY": 291019,
    "QA": 299518,
    "RE": 299527,
    "RO": 299557,
    "RS": 302787,
    "RU": 302983,
    "RW": 305343,
    "SA": 307943,
    "SB": 308076,
    "SC": 308270,
    "SD": 308299,
    "SE": 308361,
    "SG": 312887,
    "SH": 312888,
    "SI": 312891,
    "SJ": 313120,
    "SK": 313126,
    "SL": 316141,
    "SM": 316343,
    "SN": 316353,
    "SO": 316428,
    "SR": 316535,
    "SS": 316603,
    "ST": 316642,
    "SV": 316652,
    "SY": 317183,
    "SZ": 317526,
    "TD": 317577,
    "TF": 317725,
    "TG": 317735,
    "TH": 317771,
    "TJ": 318804,
    "TK": 318899,
    "TL": 318902,
    "TM": 319423,
    "TN": 319453,
    "TO": 321826,
    "TR": 321855,
    "TT": 324387,
    "TV": 324439,
    "TW": 324449,
    "TZ": 332695,
    "UA": 336540,
    "UG": 337534,
    "UM": 341409,
    "US": 341418,
    "UY": 373986,
    "UZ": 374119,
    "VA": 374414,
    "VC": 374415,
    "VE": 374422,
    "VI": 374874,
    "VN": 374897,
    "VU": 385136,
    "WF": 385143,
    "WS": 385185,
    "XK": 385211,
    "YE": 385257,
    "YT": 387655,
    "ZA": 387672,
    "ZM": 387969,
    "ZW": 388087,
}


def get_allCountryCodes(countryCode):
    f = open(path_to_locations2, encoding="ISO-8859-1")
    offset = a.get(countryCode) * 131
    f.seek(offset)
    line = f.readline()
    line = line.split("\t")
    code_to_compare = line[3]
    all_country = []
    while code_to_compare == countryCode:
        all_country.append(line)
        line = f.readline()
        line = line.split("\t")
        if len(line) != 9:
            break
        code_to_compare = line[3]

    return all_country
