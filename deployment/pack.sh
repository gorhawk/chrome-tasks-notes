#!/bin/bash

OUTPUT_ZIP="packed_extension.zip"

cd dist || { echo "dist directory not found"; exit 1; }

echo "packing build files into archive.."
# Create the zip archive (quietly, recurse into directories)
zip -r "../$OUTPUT_ZIP" _locales assets popup.html index.html manifest.json popup.js
echo "finished: $OUTPUT_ZIP"