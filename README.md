# aws4curl [![Build Status](https://travis-ci.org/carlosbaraza/aws4curl.svg?branch=master)](https://travis-ci.org/carlosbaraza/aws4curl)

curl, but with AWS Signature Version 4

# Installation (refers to upstream, not this fork)

```
npm i -g aws4curl
```

# Usage

```
usage: aws4curl [aws4curl options] [curl options]

aws4curl options:
  --aws-region AWS Region to sign requests with (Default: us-east-1)
  --aws-service AWS Service (required)
  --aws-profile AWS profile

AWS Credentials:
If AWS_PROFILE or a profile is provided on via --aws-profile then the credentials
are extracted from the shared credentials file (default: '~/.aws/credentials' and
~/.aws/config or defined by AWS_SHARED_CREDENTIALS_FILE process env var). Otherwise
use the AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY env vars if set. Lastly, attempt
to use the instance credentials.

curl options:
  Every flag and argument will be passed to your installed curl
```

# Contributing

Thank you for checking this project out! The project is MIT licensed
and every contribution is welcomed.
