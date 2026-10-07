# Copy the SouthernGent favicon set into this repo (one-time copy; served from this domain afterwards)
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p public/images
get() { [ -s "$2" ] && { echo "skip $2"; return; }; curl -fsSL -o "$2" "https://www.southerngentconstruction.com/$1"; echo "ok $2 $(wc -c < "$2")"; }
get favicon.ico public/favicon.ico
get images/icon-192.png public/images/icon-192.png
get images/icon-512.png public/images/icon-512.png
get images/apple-touch-icon.png public/images/apple-touch-icon.png
