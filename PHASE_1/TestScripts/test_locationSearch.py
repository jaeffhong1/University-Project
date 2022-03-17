import sys
import os

sys.path.append(os.path.join(os.getcwd(), "API_SourceCode"))

from GeoBinarySearch import find_GeoID


def test_correct_location():
    geo_id = find_GeoID("New South Wales")
    assert geo_id == 2155400

    geo_id = find_GeoID("China")
    assert geo_id == 1814991

    geo_id = find_GeoID("Jilin")
    assert geo_id == 2036502

    geo_id = find_GeoID("South Korea")
    assert geo_id == 1835841

    # South Korea and Korea return the same result
    geo_id = find_GeoID("Korea")
    assert geo_id == 1835841

    geo_id = find_GeoID("Hong Kong")
    assert geo_id == 1819729


def test_not_valid_location():
    geo_id = find_GeoID("Hopefully not a valid location")
    assert geo_id == -1

    geo_id = find_GeoID("abcdefghijklmnopqrstuvwxyz")
    assert geo_id == -1
