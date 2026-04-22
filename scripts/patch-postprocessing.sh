#!/bin/bash
# Patch postprocessing library to handle null getContextAttributes()
# Bug: getContextAttributes() returns null in some WebGL2 contexts,
# causing "Cannot read properties of null (reading 'alpha')" crash.
# This patch adds null-safety checks.

FILE="node_modules/postprocessing/build/index.js"

if [ ! -f "$FILE" ]; then
  echo "postprocessing not found, skipping patch."
  exit 0
fi

# Patch setRenderer()
sed -i 's/const alpha = renderer.getContext().getContextAttributes().alpha;/const _ctxAttrs = renderer.getContext().getContextAttributes(); const alpha = _ctxAttrs ? _ctxAttrs.alpha : true;/g' "$FILE"

# Patch addPass()  
sed -i 's/const alpha = renderer.getContext().getContextAttributes().alpha;/const _ctxAttrs2 = renderer.getContext().getContextAttributes(); const alpha = _ctxAttrs2 ? _ctxAttrs2.alpha : true;/g' "$FILE"

echo "postprocessing patched successfully."
