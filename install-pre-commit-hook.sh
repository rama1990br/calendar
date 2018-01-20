#! /bin/sh


if ! [ -x "$(command -v eslint)" ];
then
    echo 'installing Eslint'
    `$(export PKG=eslint-config-airbnb-base;   npm info "$PKG@latest" peerDependencies --json | command sed 's/[\{\},]//g ; s/: /@/g' | xargs npm install -g  "$PKG@latest"; )`
fi

pre_commit_hook='./hooks/pre-commit'
cp $pre_commit_hook '.git/hooks/'
chmod +x '.git/hooks/pre-commit'
