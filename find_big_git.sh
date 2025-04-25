#!/usr/bin/env bash
git rev-list --objects --all \
  | sort -k2 \
  | while read sha path; do
      size=$(git cat-file -s "$sha")
      if [ "$size" -gt 100000000 ]; then
        echo "$size bytes → $path"
      fi
    done
