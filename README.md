Livi Stress Tests

Currently will log in as X users, navigate to the main experience, run around in
circles and send messages every 3 seconds forever.

To Install:
```
npm install
```

To Run:
```
# Run the Browser stress tests
npm run browser # Runs for one user in non-headless mode
npm run browser -- --headless # Runs for one user in headless mode
npm run browser -- --limit=10 --offset=5 # Runs for 10 users, after the 5th user

# Run all stress tests (currently only browser tests)
npm run test # Runs for one user. Same options as "browser" task.
```

Lint
```
npm run lint
npm run lint-fix # to auto-fix your lint errors
```

To Add Bot Users (Advanced):
```
# Init the browser accounts
# Without flags, will init the first 10 users
npm run browser-init

npm run browser-init -- --limit=15 --offset=10 # Runs for 15 users, after the 10th user
```

To sign Chromium (to avoid the Mac popup when you run this):
```
# Swap out the mac-###### with what yours is in that directory.
sudo codesign --force --deep --sign - ./node_modules/puppeteer/.local-chromium/mac-818858/chrome-mac/Chromium.app/
```
