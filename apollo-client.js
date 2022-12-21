// ./apollo-client.js

import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    //Here, as the url we can either use our localhost version or our deployment version:
    //Localhostversion: http://localhost:5001/api/wistful-horse
    //stepZen deployment version: https://wertheim.stepzen.net/api/wistful-horse/__graphql
    //In this case we'll use the stepZen which is the production one
    uri: "https://wertheim.stepzen.net/api/wistful-horse/__graphql",
    cache: new InMemoryCache(),
    
    headers:{
        Authorization: `Apikey ${process.env.NEXT_PUBLIC_STEPZEN_KEY}`
    },
    // RCCC: This is added in order to make the queries responses be always up to date
    //The default policy is 'cache-first'
    defaultOptions:{
        query:{
            fetchPolicy:'network-only'
        }
    }
});

export default client;