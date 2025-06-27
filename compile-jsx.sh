#!/bin/bash

echo "🔁 Starting JSX compilation..."

find blocks -type d -name "jsx-components" | while read jsx_dir; do
  base_dir=${jsx_dir%/jsx-components}
  out_dir="$base_dir/components"

  echo "📂 Ensuring $out_dir exists"
  mkdir -p "$out_dir"

  for compiled_file in "$out_dir"/*.js; do
    [ -e "$compiled_file" ] || continue
    base_name=$(basename "$compiled_file" .js)
    src_file="$jsx_dir/$base_name.jsx"
    if [ ! -f "$src_file" ]; then
      echo "🗑️ Deleting $compiled_file (no matching source $src_file)"
      rm -f "$compiled_file"
    fi
  done

  echo "📦 Compiling updated files in $jsx_dir to $out_dir"
  for jsx_file in "$jsx_dir"/*.jsx; do
    [ -e "$jsx_file" ] || continue

    file_name=$(basename "$jsx_file")
    out_file="$out_dir/${file_name%.jsx}.js"

    if [ ! -f "$out_file" ] || [ "$jsx_file" -nt "$out_file" ]; then
      echo "📦 Compiling $jsx_file → $out_file"
      npx babel "$jsx_file" --out-file "$out_file" --extensions ".jsx"

      echo "🔧 Running eslint --fix on $out_file"
      npx eslint --fix "$out_file"
    else
      echo "✅ Skipping $jsx_file (no changes)"
    fi
  done
done
