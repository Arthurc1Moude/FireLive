#!/bin/bash

echo "🔥 FireLives - Bug Fix Verification Script"
echo "=========================================="
echo ""

# Check if servers are running
echo "1. Checking servers..."
if pgrep -f "http.server 3000" > /dev/null; then
    echo "   ✅ Frontend server (port 3000) is running"
else
    echo "   ❌ Frontend server (port 3000) is NOT running"
    echo "   Start with: python3 -m http.server 3000"
fi

if pgrep -f "music-server.js" > /dev/null; then
    echo "   ✅ Music API server (port 3001) is running"
else
    echo "   ❌ Music API server (port 3001) is NOT running"
    echo "   Start with: node music-server.js"
fi

echo ""

# Check file integrity
echo "2. Checking file integrity..."
LINE_COUNT=$(wc -l < /home/aimoude149/firelives/live.html)
echo "   File has $LINE_COUNT lines (should be ~2824)"

if [ "$LINE_COUNT" -lt 2900 ] && [ "$LINE_COUNT" -gt 2800 ]; then
    echo "   ✅ File size looks correct (duplicates removed)"
else
    echo "   ⚠️  File size unexpected"
fi

echo ""

# Check for duplicate code
echo "3. Checking for duplicate code..."
DUPLICATE_COUNT=$(grep -c "// 💾 HYBRID STORAGE SYSTEM - localStorage + backend sync" /home/aimoude149/firelives/live.html)
echo "   Found $DUPLICATE_COUNT instance(s) of storage system comment"

if [ "$DUPLICATE_COUNT" -eq 1 ]; then
    echo "   ✅ No duplicates found"
else
    echo "   ❌ Still has duplicate code!"
fi

echo ""

# Test HTTP access
echo "4. Testing HTTP access..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/live.html)
if [ "$HTTP_STATUS" -eq 200 ]; then
    echo "   ✅ Application is accessible (HTTP $HTTP_STATUS)"
else
    echo "   ❌ Application returned HTTP $HTTP_STATUS"
fi

echo ""

# Check for syntax errors
echo "5. Checking for common syntax errors..."
if grep -q "useEffect(() =>" /home/aimoude149/firelives/live.html; then
    USEEFFECT_COUNT=$(grep -c "useEffect(() =>" /home/aimoude149/firelives/live.html)
    echo "   Found $USEEFFECT_COUNT useEffect hooks"
    
    if [ "$USEEFFECT_COUNT" -eq 7 ]; then
        echo "   ✅ Correct number of useEffect hooks (7)"
    else
        echo "   ⚠️  Expected 7 useEffect hooks, found $USEEFFECT_COUNT"
    fi
fi

echo ""

# Summary
echo "=========================================="
echo "📊 VERIFICATION SUMMARY"
echo "=========================================="
echo ""
echo "✅ = Pass | ❌ = Fail | ⚠️  = Warning"
echo ""
echo "Next steps:"
echo "1. Open browser: http://localhost:3000/live.html"
echo "2. Open DevTools (F12) and check Console"
echo "3. Clear localStorage: localStorage.clear()"
echo "4. Refresh page (Ctrl+R or Cmd+R)"
echo "5. Verify application loads correctly"
echo ""
echo "If black screen persists:"
echo "- Check browser console for errors"
echo "- Try different browser"
echo "- Check BUG_FIX_REPORT.md for details"
echo ""
