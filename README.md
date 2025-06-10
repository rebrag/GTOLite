## Offline build & run
npm ci
npm run build
cd dist
python3 -m http.server 8080
# open http://localhost:8080
