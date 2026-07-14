#!/bin/bash
git push origin main
git subtree push --prefix=sdk sdk-origin main
echo "✅ Pushed to both repos!"