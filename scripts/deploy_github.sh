#!/bin/bash
cd "${0%/*}../"

npm run-script build
cp -r ./dist/* ../edukiz_live/
COMMIT_ID=$(git rev-parse --short HEAD)
LATEST_TAG=$(git describe origin --abbrev=0 --tags)
COMMIT_MSG="Based on edukiz commit: ${COMMIT_ID} and tag: ${LATEST_TAG}"

cd ../edukiz_live/ || exit 1
git add -A
git commit -m "${COMMIT_MSG}"
git push --force
git tag -a "${LATEST_TAG}" -m "${COMMIT_MSG}"
git push --force origin "${LATEST_TAG}"
echo -e '\033[0;32m \t Success!!!! Yeah!!! '
