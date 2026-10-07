# Storm section: rain-on-shingle video (lazy-loaded, poster, VideoObject schema) + flat card layout without the tilted frame
set -euo pipefail
cd "$(dirname "$0")/.."
[ -s public/media/rain-on-architectural-shingle-roof-alabama.mp4 ] && { echo 'already applied'; exit 0; }
curl -fsSL -o /tmp/storm.tgz 'https://unbounce-mcp-uploads-production-002682819933.s3.us-east-1.amazonaws.com/uploads/unbounce%253A181812/8b6fae32-e8b3-4588-9b58-b160d3ce6a6c/storm.tgz?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAQBH7ISVOZKOE2UGV%2F20261007%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20261007T204754Z&X-Amz-Expires=900&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEE0aCXVzLWVhc3QtMSJHMEUCIQD3HVl2f3Ta5KkkPrA6fMHSrqrNXkcxxyqNhkCTlGH1AgIgalM6VjTqH1wd1z40gIgtXCU2r7Uqf%2B%2F5Tv7dzsiowf4q%2FQMIFhAAGgwwMDI2ODI4MTk5MzMiDFDU1CVDWCc54emw4CraAyQxl%2FMJdCGgLxxH0Cjc1vjO7jDWYr9brKD9tZpEb%2BaqOds698SWHSRtMrm3LgPp%2F8WoBbxbE%2B0HmkRSnBnScNkgaqRYz2oGnuc9%2B5UMYx4rweKuzbHeO562cYYCoTxQSsBJFf9obF5C%2BEhKYL3GTCcTFlqYs9dpA%2FMse3nTPEs0PzVKBjJjvzeFnl395N6nbVqmG8ScYu5ylkMhxcgtjP4ix4DpSHgDU4yjZ44UoQIBbFrr29cYgPowUdhQr86qB7xm5rG1tJQyZ6LCJibEkda01g55u8Qi9mVFApEUnU5jM2CsPmRhuewQG017lhIlTXJ%2FpTA72z2%2Fgy1cQgIT32dpur9dc2UgRfN85DlUH94xqfkcTcOrwil16Y3dOn1DKzV2cMupTQ0jPJpIR8r9Z7QDxk70I37SNWE76Y1eF5x1wFkBdzh2smN3hkz4Q%2FbyHTeZI0yW7gjGWPaB8tCsJ3nplMj61tMl%2FWpsA3%2Fpdb%2FiGy35hRilMMJgIggYI38LOwzZT%2BotJYdgmoXvr8LZbmO%2BlU9mZAeFbYbL%2FpPX5esiMt2dCVY%2FH%2But68rIPlv81YsbdrdgZeGs56ZGAsTcQDDJO5Xqf56Kd5V9v6zdyPEPb4NGVawqTPS33TDo35rWBjqiAaoXr%2Bu18p1PtNkphRA%2FHKx5VpVTFS6f2k%2BfIQMIxbkLe8Rf8NIQn%2FXBaApQWK3KpVzxmzemV5kaKFkzzxV9OJ9R3eG2jeNnLvXNUqIMvFD%2FPp5rO4720JK295CW4ZJpEKwnvi%2F0%2FYKZvDtSIUNylfnuZVmerZPZnuv25AfQqfeiaAI71JpzlxPvNi07LMBMkWa7d%2BZeQT4H%2FDA7UQMAyKSINA%3D%3D&X-Amz-Signature=ec82eb898bb06f2534ffb8d1758ba12e0c5e239edac84f63ee8dc24dcefb6702&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject'
echo "bb9c24063c328fadc72579e4e25af4b6524371c23066a78d636533239392e0f6  /tmp/storm.tgz" | sha256sum -c -
# keep the aspect fix that was applied server-side earlier
cp public/css/styles.css /tmp/styles.before.css
tar xzf /tmp/storm.tgz
if ! grep -q 'aspect fix (Oct 7, 2026)' public/css/styles.css; then
  cat >> public/css/styles.css <<'EOF'
/* aspect fix (Oct 7, 2026): images carry width/height attributes for layout stability; keep them proportional */
#lp-code-1 .lb-stage img, #lp-code-1 .dr-photo>img:first-child{height:auto}
EOF
fi
# old storm photo no longer referenced
grep -q 'roof-replacement-alabama-home.webp' src/pages/index.astro || rm -f public/images/roof-replacement-alabama-home.webp
grep -c 'storm-video' src/pages/index.astro
ls -la public/media
