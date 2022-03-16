#!/usr/bin/bash
# this script is run by the pipeline
# exit with non-zero code to fail the pipeline

set -xe

pushd PHASE_1
pytest
popd