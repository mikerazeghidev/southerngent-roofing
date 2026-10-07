# Import homepage source (index.astro, styles.css, main.js, seo dashboard, lockfile), then fetch images + fonts
set -euo pipefail
cd "$(dirname "$0")/.."
# 1) Source bundle staged for this one run (temporary signed URL; skip if already imported)
if [ ! -s src/pages/index.astro ]; then
  curl -fsSL -o /tmp/bundle.tgz 'https://unbounce-mcp-uploads-production-002682819933.s3.us-east-1.amazonaws.com/uploads/unbounce%253A181812/c7ae73f8-c41d-44d3-9923-6fb793427d34/bundle.tgz?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAQBH7ISVOTS6VVX2G%2F20261007%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20261007T192849Z&X-Amz-Expires=900&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEwaCXVzLWVhc3QtMSJHMEUCIHrP%2FZ%2FyLAItISVfkbqRZQiYnVyrTtTZWzpNCm%2BfbOZ5AiEAuZvkGjpfSWhaRW%2BvJmv%2B2Fy8NV8JISOOr4bzbbBRJUoq%2FQMIFRAAGgwwMDI2ODI4MTk5MzMiDPuShpoc1NPKclGl3SraA9ku%2FdPdsx1Hx0Sp0K4lvLTWddjeCNYLjzJfmXDIFr1npcN87Ety2sR6P%2F7OsxEyxr5y2T6SpE5jeY8sf4p5auIUmp05A2mSr965%2B%2F%2B4XNABa8UW1ljtJsgD6KdiUx1nutLC0w3F4Jq0T7zFZ385L5vnqWRclToS%2FZZJHv2KfI4Yiu%2B3Z08pbnCVlWqIXer%2F1oxr2Xk7vAG%2FPL7nuD%2FvCsAqJpKgPsqbMS5ttIFkM%2FVRFN%2FUqFFJGv4pC3%2F22KFg34Kk5XPsSIOAUdLfN0tB0HWpxiNrUFo0DTn3bEagxkcDbj1KJWynDJ2kOUtLEYZXQDFUTc796qSATej8wkCBPUW%2Bzzg%2FpIM0I2pVIaZJ15aMYJpRiKVELGceEUn7l5nyEchHSb7NZtSBSbDXkS4dFAYl1hgJLh%2FUggOebSUveGBTwz4qUDx41w1UceX4xLiQvGlxKtq%2Bx9hbtFySeee9nZnRTWCjVM131pAnWsZx12zldgxRuCv05fD9VWzWNZA%2F6l5nvIA5jgnpxdUmuCn3HEEe8OiTh%2Fsb8SpQ%2BrhMdBFvFv5qIZoNNmD3xo5GgsHXwi6LjdbGHAfqZak%2F%2F7vUd1tHQ9BY8H91WRROHRnwbiiZ%2BHP1WtYPuqbJYTC5uprWBjqiAQzO9uCJpivWwwxO7Q5G%2F549%2BsJwYwTlRfCMqGcauk54rbT0tHW%2FL6WNGVZ%2BgCKrjpKtOT2WtXfguB6S0m3e%2BRJCizAKTJnh5v5fjHcoplq5%2Bw1l2E4SUEZ8ZpTji7%2FEdgeIUwxOcVZ9qqEbUtENDunt3EK0sUV9cou%2B9PNG4wx16L1Lu%2FGNPgucK17Ok2mi47NtlBzjUiPehvx9AzTba%2BYNxg%3D%3D&X-Amz-Signature=a0d2c94130df6297ca13f6bb9c2691e00491c81ebb83072fe5f5c862cca78213&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject'
  echo "f45437ef297d538afe55b485037d561127fa8179e75def2b63bff6a4b9f1665d  /tmp/bundle.tgz" | sha256sum -c -
  tar xzf /tmp/bundle.tgz
fi
# 2) Images + fonts
mkdir -p public/images public/fonts /tmp/src
npm i --no-save sharp >/dev/null 2>&1

dl() { # dl <url> <target webp name>
  local out="public/images/$2"
  [ -s "$out" ] && { echo "skip $2"; return; }
  local tmp="/tmp/src/$(basename "$1")"
  curl -fsSL -o "$tmp" "$1"
  node -e "
    const sharp=require('sharp');
    sharp(process.argv[1]).rotate().webp({quality:82,effort:5}).toFile(process.argv[2]).then(i=>console.log('ok',process.argv[2],i.width+'x'+i.height));
  " "$tmp" "$out"
}
dl 'https://app.unbounce.com/publish/assets/b3e5d2a5-3f64-4306-8949-5e5184791a66/southerngent-roofing-amp-gutters-48d8d7d8.png' 'southerngent-roofing-gutters-logo.webp'
dl 'https://app.unbounce.com/publish/assets/c634bbfd-25e9-444c-8d72-930cc8955e63/5-star-rating-fdb4a615.png' 'five-star-google-rating-badge.webp'
dl 'https://app.unbounce.com/publish/assets/785e28d7-a62f-422d-9635-55d0a12b1831/bbb-a-rating-495f3fd9.png' 'bbb-a-plus-rating-badge.webp'
dl 'https://app.unbounce.com/publish/assets/0dac42a4-4b50-4487-a26b-8084a9db33e4/licensed-and-insured-b1338e44.png' 'licensed-insured-alabama-roofer-badge.webp'
dl 'https://app.unbounce.com/publish/assets/4c335c66-17a5-4ef1-9c0c-31e273778767/inline-1260e8d4.png' 'torn-paper-section-divider.webp'
dl 'https://app.unbounce.com/publish/assets/1415df28-53d4-42d9-81db-d23867f01f89/roofing-fc21cb86.jpg' 'roof-replacement-alabama-home.webp'
dl 'https://app.unbounce.com/publish/assets/15612008-9ca8-4046-89bc-13221269c0ed/gutters-0e4e4cd9.jpg' 'seamless-gutter-installation-alabama.webp'
dl 'https://app.unbounce.com/publish/assets/7bcc5406-3e2c-4473-b696-902364f04ef4/drainage-3ce92a5f.jpg' 'yard-drainage-solution-alabama.webp'
dl 'https://app.unbounce.com/publish/assets/8efabbd0-cb73-4e29-bc93-7d7904499db8/before-and-after-gutter-cleaning-ee522e69.jpg' 'before-after-gutter-cleaning-huntsville-al.webp'
dl 'https://app.unbounce.com/publish/assets/593fe9f5-b6b1-4596-98cf-12cad6b6cf8d/inline-718c962d.jpg' 'roof-replacement-project-birmingham-al.webp'
dl 'https://app.unbounce.com/publish/assets/6f34e7b2-b42f-47be-843e-6ad9c152d6bb/southerngent-on-instagram-bd97745b.jpg' 'yard-drainage-project-madison-al.webp'
dl 'https://app.unbounce.com/publish/assets/94c92e8b-2a3b-462e-938a-7562cc318ec8/southerngent-estimate-at-an-alabama-home-eed67be8.jpg' 'southerngent-roofing-estimate-alabama-home.webp'
dl 'https://app.unbounce.com/publish/assets/0249c0b4-2a38-4738-8e59-457fbf59c2e9/the-southerngent-mascot-90bfb45f.png' 'southerngent-mascot-alabama-roofer.webp'
dl 'https://app.unbounce.com/publish/assets/c5efcc72-5024-4a27-ae6a-3b658c4e28eb/inline-2b3a9eed.png' 'southerngent-workmanship-warranty-badge.webp'
dl 'https://app.unbounce.com/publish/assets/4045027e-1c19-4729-9f5d-51a841e0e49a/alabama-service-area-map-bba724aa.jpg' 'alabama-roofing-service-area-map-huntsville-birmingham.webp'
dl 'https://app.unbounce.com/publish/assets/d2908bfd-7a95-4296-b25e-6f2eb283973e/inline-c7dfafca.jpg' 'southerngent-roofing-crew-at-work-alabama-1.webp'
dl 'https://app.unbounce.com/publish/assets/7b42cf1e-7d1e-4187-9578-e6cd630b2c7a/inline-b824df67.jpg' 'southerngent-roofing-crew-at-work-alabama-2.webp'
dl 'https://app.unbounce.com/publish/assets/9079426d-42bb-467f-8483-4a26e14a2c19/inline-969a710d.jpg' 'southerngent-roofing-crew-at-work-alabama-3.webp'
dl 'https://app.unbounce.com/publish/assets/0765d7d1-f120-49f8-9598-af4847ac61a8/southerngent-on-instagram-6c95c6c6.jpg' 'southerngent-roofing-crew-at-work-alabama-4.webp'
dl 'https://app.unbounce.com/publish/assets/da532f94-038a-49c1-8516-afaef3592f37/inline-79d3f22c.png' 'southerngent-roofer-free-estimate.webp'
dl 'https://app.unbounce.com/publish/assets/9c40c0b9-d768-4103-9232-1990f25753a9/southerngent-growth-partners-marketing-a-e290fb49.png' 'southerngent-growth-partners-logo.webp'
dl 'https://app.unbounce.com/publish/assets/7800083d-bff3-4d3a-bc5c-df532e52c7cb/membership-bg-3d1c253f.jpg' 'leather-texture-background.webp'
dl 'https://app.unbounce.com/publish/assets/f58ab4bf-ff01-4a0f-8bf7-21399f9a7cdd/inline-1b1decf3.jpg' 'alabama-roofing-crew-hero.webp'
dl 'https://app.unbounce.com/publish/assets/657a6d81-1bc0-42f8-bfa4-46ece001f503/inline-f3038377.jpg' 'roofing-cost-calculator-background.webp'
dl 'https://app.unbounce.com/publish/assets/81ab3140-578b-4a7d-8f65-b77d8f436de3/lp-code-1-areas-copy-after-bg-4ef7098d.png' 'alabama-state-outline-watermark.webp'
# Fonts: latin variable woff2 straight from Google Fonts (self-hosted in THIS repo, served from THIS domain)
UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'
font() { # font <family query> <target file>
  [ -s "public/fonts/$2" ] && { echo "skip $2"; return; }
  local url
  url=$(curl -fsSL -A "$UA" "https://fonts.googleapis.com/css2?family=$1&display=swap" | awk '/\/\* latin \*\//{f=1} f&&/url\(/{match($0,/url\(([^)]+)\)/,m); print m[1]; exit}')
  [ -n "$url" ] || { echo "no latin url for $1"; exit 1; }
  curl -fsSL -o "public/fonts/$2" "$url"
}
font 'Rokkitt:wght@600..800' Rokkitt-600-800.woff2
font 'Oswald:wght@500..700' Oswald-500-700.woff2
font 'Archivo:wght@400..700' Archivo-400-700.woff2
ls -la public/images public/fonts
