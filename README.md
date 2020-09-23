Project Name: Article Analytic

## Technologies used:

NodeJS, ES6, EJS template engine, Bootstrap 4, MongoDB, Docker

## Install graphql and express-graphql

npm install --save graphql express-graphql

## Deployment to AWS EC2 instance:

The live version of my solution is now up and running, and it can be found at http://support.toannotes.com/. To deploy this website, my EC2 instance needs to have Apache2 (proxy and proxy_http modes are enabled), Node (v10.18.1) and Forever installed.

- To setup Node.js with Apache Proxy:
If Node app is running on port 8080. To serve Node.js application, my Apache is configured as below:
<code>
    
    <VirtualHost *:80>

        ServerName support.toannotes.com

        ProxyPreserveHost On
        ProxyPass / http://<SERVER IP>:8080/
        ProxyPassReverse / http://<SERVER IP>:8080

    </VirtualHost>
    
</code>
- To start application using forever:
forever start server.js

## Build and run Dockerfile on local machine:

After cloning cloning this repo, we can build a docker image and run that image as a container:

- Build: docker build -t article_analytic_app_img .
- Run: docker run -d --restart=always --name article_analytic_app_con -p 3000:3000 article_analytic_app_img:latest
- Check logs: docker logs --tail=10 -f article_analytic_app_con

With the container running, we can now visit the application by navigating our browser to http://localhost:3000

Note: Fetching the URLs and counting the words features have been tested with external source CNN.

## Installing and Running without Dockerfile on local machine:

- Install prerequisites:
You will need Node v10.18.1 (recommended version)

- Installing:
npm install

- Start the application:
node server.js

OR (If you have nodemon installed on your local machine)

nodemon server.js

The application is up and running, let's visit the application by navigating our browser to http://localhost:3000

Note: Fetching the URLs and counting the words features have been tested with external source CNN.

## REST APIs:
The input parameters are given in the request body as a JSON-encoded object.

If the API responds with HTTP-status code 200 OK, the request has been handled successfully. In case of errors or exceptions in request handling, the HTTP-status code is different from 200 OK, and more details of the error / exception may be given in the response body.

The methods available on the API are described:

Fetch all channels:
+ Endpoint: /api/channels
+ Request method: GET
+ This API has no input parameters.

Fetch all articles:
+ Endpoint: /api/articles
+ Request method: GET
+ This API has no input parameters.

Add a new channel:
+ Endpoint: /api/add-new-channel
+ Request method: POST
+ Input parameters: {name: channelName}

Delete an existing channel
+ Endpoint: /api/delete-channel
+ Request method: POST
+ Input parameters: {uuid: channelUuid}

Update an existing channel:
+ Endpoint: /api/update-channel
+ Request method: POST
+ Input parameters: {uuid: channelUuid, name: channelName}

Fetch a channel by name
+ Endpoint: /api/get-channel-by-name
+ Request method: POST
+ Input parameters: {name: channelName}

Add a new article:
+ Endpoint: /api/add-new-article
+ Request method: POST
+ Input parameters: { channel_id: channelId, source_name: articleSourceName, source_url: articleSourceURL, word_count: wordCount }

Delete an existing article:
+ Endpoint: /api/delete-article
+ Request method: POST
+ In put parameters: {word_count_range_id: wordCountRangeId}

Update an existing article:
+ Endpoint: /api/update-article
+ Request method: POST
+ Input parameters: { uuid: uuid, channel_id: channelId, source_name: articleSourceName, source_url: articleSourceURL, word_count: wordCount }

Fetch a channel by URL:
+ Endpoint: /api/get-article-by-source-url
+ Request method: POST
+ Input parameters: { source_url: articleSourceURL }

Fetch channels by word count range id:
+ Endpoint: /api/filter-articles
+ Request method: POST
+ Input parameters: { word_count_range_id: wordCountRangeId }