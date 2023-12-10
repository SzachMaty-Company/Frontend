#!/bin/bash

current_version=$(git tag --sort=-v:refname | head -n 1)
major=$(echo $current_version | cut -d. -f1)
minor=$(echo $current_version | cut -d. -f2)
patch=$(echo $current_version | cut -d. -f3)

commit_msg=$(git log --format=%B -n 1 $GITHUB_SHA | tr -d '\n')

if [[ $commit_msg == "feat:"* ]]; then
        minor=$((minor + 1))
        patch=0
elif [[ $commit_msg == "fix:"* ]]; then
        patch=$((patch + 1))
elif [[ $commit_msg == "BREAKING CHANGE:"* ]]; then
        major=$((major + 1))
        minor=0
        patch=0
else
        exit 1
fi

next_version="$major.$minor.$patch"
echo $next_version