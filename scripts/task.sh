# Fix stretched photos: images with width/height attributes must keep their aspect ratio when CSS sets width:100%
set -euo pipefail
cd "$(dirname "$0")/.."
grep -q 'aspect fix (Oct 7, 2026)' public/css/styles.css && { echo 'already applied'; exit 0; }
cat >> public/css/styles.css <<'EOF'
/* aspect fix (Oct 7, 2026): images carry width/height attributes for layout stability; keep them proportional */
#lp-code-1 .lb-stage img, #lp-code-1 .dr-photo>img:first-child{height:auto}
EOF
tail -2 public/css/styles.css
