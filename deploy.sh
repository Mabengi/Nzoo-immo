#!/bin/bash

echo "🔍 Checking for changes..."
git add .

echo "📝 Creating commit..."
commit_message="deploy: $(date '+%Y-%m-%d %H:%M:%S')"
git commit -m "$commit_message"

echo "🚀 Pushing to GitHub..."
git push origin master

echo "✅ Deploy completed!"
