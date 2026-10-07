# Hero tidy: 2-line headline, tighter vertical rhythm, copy column aligned to the site container
set -euo pipefail
cd "$(dirname "$0")/.."
grep -q 'Hero tidy (Oct 7, 2026)' public/css/styles.css && { echo 'already applied'; exit 0; }
cat >> public/css/styles.css <<'EOF'

/* Hero tidy (Oct 7, 2026): 2-line headline, tighter vertical rhythm, copy column aligned to the site container */
#lp-code-1 .hero{padding:64px 0 150px}
#lp-code-1 .hero-copy{max-width:720px}
#lp-code-1 .hero .eyebrow{font-size:15px;letter-spacing:3px;margin:0 0 10px}
#lp-code-1 .hero h1{font-size:60px;line-height:1.04;margin:0 0 12px}
#lp-code-1 .hero-sub{font-size:18px;line-height:1.5;max-width:540px;margin:0}
#lp-code-1 .hero .cta-row{margin:28px 0 0;gap:24px}
#lp-code-1 .hero .badges{margin-top:30px;gap:16px}
#lp-code-1 .hero .badges img{height:58px}
@media (max-width:980px){#lp-code-1 .hero h1{font-size:46px}#lp-code-1 .hero{padding:48px 0 120px}}
@media (max-width:560px){#lp-code-1 .hero h1{font-size:36px}#lp-code-1 .hero{padding:36px 0 96px}#lp-code-1 .hero .badges img{height:48px}}
EOF
tail -3 public/css/styles.css
