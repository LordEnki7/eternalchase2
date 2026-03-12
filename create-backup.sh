#!/bin/bash

# Eternal Chase - Backup Creation Script
# Creates portable zip backup for deployment on other platforms

echo "🌌 Creating Eternal Chase backup..."

# Remove old backup if exists
rm -f eternal-chase-backup.zip

# Create comprehensive zip backup
zip -r eternal-chase-backup.zip . \
  -x "node_modules/*" \
     "dist/*" \
     "package-lock.json" \
     "migrations/*" \
     ".git/*" \
     "*.log" \
     "create-backup.sh" \
     "eternal-chase-complete-backup.tar.gz"

# Get backup size
BACKUP_SIZE=$(du -h eternal-chase-backup.zip | cut -f1)

echo "✅ Backup created successfully!"
echo "📁 File: eternal-chase-backup.zip"
echo "📏 Size: $BACKUP_SIZE"
echo ""
echo "Your backup includes:"
echo "✓ Complete source code (React + Express)"
echo "✓ Authentication & subscription systems"
echo "✓ Database schema & Stripe integration"
echo "✓ All documentation & deployment guides"
echo "✓ Ready for any Node.js hosting platform"
echo ""
echo "To deploy: unzip eternal-chase-backup.zip && npm install && npm run db:push"