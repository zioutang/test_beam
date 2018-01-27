# Challenge for a cool company
[![Build Status](https://travis-ci.org/zioutang/test_beam.svg?branch=master)](https://travis-ci.org/zioutang/test_beam)

Backend Challenge that supports simple login / register and sending money function.

A demo can be viewed [here](https://beam-test-123.herokuapp.com/)

You can use the testing account (1@gmail.com / 123) to test the application. Or register your own account.

Implemented Travis-ci tool. Simply click on the badge will lead you to Travis.


## Installation

You need to setup your own env.sh file to setup mlab database connection.

```
export MONGODB_URI=YOUR_MLAB_CONNECTION
```

Then run the scripts in your terminal

```
source env.sh
```

After setting up environment variable, do the following
```
npm install
npm start
```


## Mocha Test

```
npm test
```
