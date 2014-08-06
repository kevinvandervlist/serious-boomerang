# Serious Boomerang [![Build Status](https://api.travis-ci.org/kevinvandervlist/serious-boomerang.svg?branch=master)](https://travis-ci.org/kevinvandervlist/serious-boomerang)

A webapp that will be the new ziekezooi.nl

# Getting started:
Copy the environment template: 
```
cp server/config/local.env.js.template server/config/local.env.js
```

# Protractor:
npm run update-webdriver

# Data dir:
Zie de environment settings. Wordt gebruikt voor media.

# Generate encrypted private key: 
From: https://gist.github.com/douglasduteil/5525750

```bash
base64 --wrap=0 ~/.ssh/travis_rsa > ~/.ssh/travis_rsa_64
 
# I'll direcly user the option "--add env.global" so let's go to where your ".travis.yml" is
cd <somewhere>
 
# Also, the command "travis encrypt" has a length limit ~=100char.
# So, like I'm lazy. I just brutalize my bash...
bash <(cat ~/.ssh/travis_rsa_64 | perl -pe 's/(.{100})/$1\n/g' | nl | perl -pe 's/\s*(\d+)\s*(.*)/travis encrypt -r <org>\/<repo> id_rsa_$1="$2" --add env.global/')
 
#
# Now you have a lot of lines "- secure: ! 'xxxx...'" in my ".travis.yml"
# But you don't know how many... So just come back to the last command to get the tail of it.
#
cat ~/.ssh/travis_rsa_64 | perl -pe 's/(.{100})/$1\n/g' | nl | tail
```
