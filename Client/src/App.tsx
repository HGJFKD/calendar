import {
  ApolloClient,
  InMemoryCache,
  from, split, HttpLink
} from "@apollo/client";
import { ApolloProvider } from "@apollo/react-hooks";
import { onError } from "@apollo/client/link/error";
import { getMainDefinition } from "apollo-utilities";
// import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
// import { createClient } from 'graphql-ws';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Calendar from "./pages/Calendar"

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/calendar'
});

// const wsLink = new GraphQLWsLink(createClient({
//   url: 'ws://localhost:4000/calendar',
//   connectionParams: {
//     // authToken: user.authToken,
//   },
// }));

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );

  if (networkError) console.log(`[Network error]: ${networkError}`);
});


const link = from([
  errorLink,
  httpLink
])

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
});


function App() {

  return (
    <>
      <ApolloProvider client={client}>
        <BrowserRouter>
          <Routes>
            <Route path="/calendar" element={<Calendar />} />
          </Routes>
        </BrowserRouter>
      </ApolloProvider>
    </>
  )
}

export default App
