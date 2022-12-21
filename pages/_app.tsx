import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import Header from "../components/Header";
import { ApolloProvider } from "@apollo/client";
import client from "../apollo-client";
import { Toaster } from "react-hot-toast";

//The original approach to declare the function by destructuring the session item was:
//function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {....}.
//However, since we are working over next.js 12.3.0 we receive this error:
//"Property 'session' does not exist on type '{}'". After doing some research,
//I found the solution at: https://stackoverflow.com/questions/73668032/nextauth-type-error-property-session-does-not-exist-on-type
//The solution is to first import the Session type and then
// pass the session type to the AppProps generic.
function MyApp({ Component, pageProps }: AppProps<{ session: Session }>) {
  return (
    // Wrap the entire application inside the apolloProvider in order to use
    // apollo client to interact with graphql
    <ApolloProvider client={client}>
      <SessionProvider session={pageProps.session}>
        {/* Place the toaster in the highest level of our app, so we can start using it */}
        <Toaster />
        {/* Here, we are adding the className of h-screen (100vh) and overflow-y-200
        because we want to add the parallax scrolling effect. 
        That is when we scroll down, everything sticks to page */}
        <div className="h-screen overflow-y-scroll bg-slate-200">
          {/* If we put the Header component here, then this header will be in every 
          single page */}
          <Header />
          <Component {...pageProps} />
        </div>
      </SessionProvider>
    </ApolloProvider>
  );
}

export default MyApp;
