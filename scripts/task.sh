# Fix styles.css: remove the leftover Google Fonts @import fragment on line 1 that broke the :root color variables
set -euo pipefail
cd "$(dirname "$0")/.."
sed -i '1{/^700;800&family=/d}' public/css/styles.css
head -c 60 public/css/styles.css; echo
grep -c 'googleapis' public/css/styles.css && { echo 'import fragment still present'; exit 1; } || true
