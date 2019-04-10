# aws4curl

curl, but with AWS Signature Version 4

# Installation

```
npm i -g aws4curl
```

# Usage

```
aws4curl [aws4curl options] [curl options]

aws4curl options:
  --aws-region AWS Region to sign requests with (required)
  --aws-service AWS Service (required)

curl options:
  Every flag and argument will be passed to your installed curl
```

# To do

- [ ] Read other headers passed to curl and pass them to `aws4.sign`
- [ ] Read body and pass it to `aws4.sign`
- [ ] Add some tests
- [ ] Refactor code to increase readability

# Contributing

Thank you for checking this project out! The project is MIT licensed
and every contribution is welcomed.
