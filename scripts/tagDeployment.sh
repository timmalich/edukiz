#!/usr/bin/env bash
comment=$1
if [[ "$#" -le 0 ]]; then
    read -p "You must specify a release message: " comment
fi

git fetch --all --tags
git status -uno
echo -e "\e[92m^^^^^^^^^ Above is your current branch git information. If this is correct press enter. Otherwise press Ctrl+C and checkout the desired version.\e[39m"
read

getNextVersion() {
  [[ ${1} =~ ^(.*[^0-9])?([0-9]+)$ ]]  && \
    [[ ${#BASH_REMATCH[1]} -gt 0 ]] && \
      printf "%s%0${#BASH_REMATCH[2]}d" "${BASH_REMATCH[1]}" "$((10#${BASH_REMATCH[2]} + 1 ))" || \
      printf "%0${#BASH_REMATCH[2]}d" "$((10#${BASH_REMATCH[2]} + 1))" || \
    printf "${1}"
}
lastTag=$(git describe origin --abbrev=0 --tags)
nextVersion=$(getNextVersion "$lastTag")
echo $nextVersion

echo -e "\e[92mWe will run: \`git tag -a $nextVersion -m \"$comment\"\`. OK? \e[39m"
read
git tag -a $nextVersion -m "$comment"
echo "This new tag was set: $(git describe --abbrev=0 --tags)"

echo -e "\e[92mWe will run: \`git push origin \"$nextVersion\"\`. OK? \e[39m"
read
git push origin "$nextVersion"

echo "All done. If you want to revert it run:"
echo "git push --delete origin \"$nextVersion\"; git tag -d \"$nextVersion\""
