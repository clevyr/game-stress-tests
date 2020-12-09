Game Stress Tests

To Install:
```
npm install
```

To Run:
```
# Init the browser accounts (run this once)
npm run browser-init

# Run the Browser stress tests
npm run browser # Runs for one user
npm run browser --limit=10 --offset=5 # Runs for 10 users, after the 5th user

# Run all stress tests (currently only browser tests)
npm run test # Runs for one user
npm run browser --limit=10 --offset=5 # Runs for 10 users, after the 5th user
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
