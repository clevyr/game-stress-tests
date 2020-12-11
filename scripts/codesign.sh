#!/bin/sh

set -eux

case "$(uname)" in
    Darwin)
        codesign --force --deep --sign - \
            node_modules/puppeteer/.local-chromium/*/chrome-mac/Chromium.app
        ;;
esac
