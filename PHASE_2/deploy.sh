set -xe

echo "$(whoami) deploying"

pushd PHASE_2/Application_SourceCode/client

# bundle the app into static files for production
yarn install
rm -rf build
CI='' yarn run build

popd

echo "Frontend deployed!"