# limited-urls
A URL redirect service with a maximum number of users per link.

## Overview

limited-urls is deployed to AWS using [the Serverless Stack](sst.dev).

# Stack
- A single page React app - uses SST construct [ReactStaticSite](https://docs.sst.dev/constructs/ReactStaticSite)
- A single Lambda function with public URL 


## Todo
* [x] Allow URLs without protocol schema
* [ ] Store URL (or token) in local storage and use that in request
* [ ] Create a test link for admin
* [ ] Only allow overview for the admin
* [x] Style the redirect page
  * [x] During load
  * [x] When link has expired
