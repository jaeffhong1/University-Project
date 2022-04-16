set -xe

echo "$(whoami) deploying"

pushd PHASE_2/Application_SourceCode/client

# remove old build folder
rm -rf build
yarn install

popd

echo "Frontend package installed!"