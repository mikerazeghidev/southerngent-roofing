# Hero copy: use the centered 1180px container instead of hugging the left edge
set -euo pipefail
cd "$(dirname "$0")/.."
sed -i 's|#lp-code-1 \.hero-in{position:relative;max-width:860px;margin-left:0}|#lp-code-1 .hero-in{position:relative}\n#lp-code-1 .hero-copy{max-width:640px}|' public/css/styles.css
grep -n 'hero-copy{max-width:640px}' public/css/styles.css
