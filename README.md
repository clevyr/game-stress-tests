Livi Stress Tests

To Install:
```
npm install
```

To Run:
```
# Init the browser accounts (run this once)
npm run browser-init

# Run the Browser stress tests
npm run browser # Runs for all users
npm run browser 2 # Runs for 2 users

# Run all stress tests (currently only browser tests)
npm run test # Runs for all users
npm run test 2 # Runs for 2 users
```

Lint
```
npm run lint
npm run lint-fix # to auto-fix your lint errors
```

To sign Chromium (to avoid the Mac popup when you run this):
```
sudo codesign --force --deep --sign - ./node_modules/puppeteer/.local-chromium/mac-818858/chrome-mac/Chromium.app/
```
