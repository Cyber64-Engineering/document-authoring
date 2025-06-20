#!/bin/bash

echo "🔁 Starting JSX compilation..."

find blocks -type d -name "jsx-components" | while read jsx_dir; do
  base_dir=${jsx_dir%/jsx-components}

  out_dir="$base_dir/components"

  echo "🧹 Cleaning $out_dir"
  rm -rf "$out_dir"
  mkdir -p "$out_dir"

  echo "📦 Compiling all files in $jsx_dir to $out_dir"

  for jsx_file in "$jsx_dir"/*.jsx; do
    [ -e "$jsx_file" ] || continue

    file_name=$(basename "$jsx_file")
    out_file="$out_dir/${file_name%.jsx}.js"

    echo "📦 Compiling $jsx_file → $out_file"

    npx babel "$jsx_file" --out-file "$out_file" --extensions ".jsx"

    echo "🔧 Running eslint --fix on $out_file"
    npx eslint --fix "$out_file"
  done
done
