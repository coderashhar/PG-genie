#!/bin/bash

# Create format string for curl
cat << 'EOF' > curl-format.txt
    time_namelookup:  %{time_namelookup}s\n
       time_connect:  %{time_connect}s\n
    time_appconnect:  %{time_appconnect}s\n
   time_pretransfer:  %{time_pretransfer}s\n
      time_redirect:  %{time_redirect}s\n
 time_starttransfer:  %{time_starttransfer}s\n
                    ----------\n
         time_total:  %{time_total}s\n
EOF

echo "=================================="
echo "API RESPONSE TIME PROFILING"
echo "=================================="

echo ""
echo "--- 1. /api/properties (Listing) ---"
for i in 1 2 3 4 5; do
  curl -w "%{time_total}\n" -o /dev/null -s "http://localhost:3000/api/properties?page=1&limit=6"
done | awk '{ sum += $1 } END { print "Average Time: " sum/5 "s" }'

echo ""
echo "--- 2. /api/properties with Search ---"
for i in 1 2 3 4 5; do
  curl -w "%{time_total}\n" -o /dev/null -s "http://localhost:3000/api/properties?search=Kothri&page=1&limit=6"
done | awk '{ sum += $1 } END { print "Average Time: " sum/5 "s" }'

echo ""
echo "--- 3. /api/properties/[id] ---"
# We need a valid ID. Let's just grab one from the list endpoint
ID=$(curl -s "http://localhost:3000/api/properties?limit=1" | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)
if [ -n "$ID" ]; then
  for i in 1 2 3 4 5; do
    curl -w "%{time_total}\n" -o /dev/null -s "http://localhost:3000/api/properties/$ID"
  done | awk '{ sum += $1 } END { print "Average Time: " sum/5 "s" }'
else
  echo "No property ID found."
fi

# Clean up
rm curl-format.txt
