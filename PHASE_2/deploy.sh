set -xe

echo "$(whoami) deploying"

pushd PHASE_2/Application_SourceCode/client

# bundle the app into static files for production
yarn install
yarn run build

popd

systemctl restart seng3011_frontend

echo "Frontend deployed!"