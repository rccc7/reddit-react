import { useQuery } from "@apollo/client";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Feed from "../components/Feed";
import Header from "../components/Header";
import PostBox from "../components/PostBox";
import SubredditRow from "../components/SubredditRow";
import { GET_SUBREDDITS_WITH_LIMIT } from "../graphql/queries";

const Home: NextPage = () => {
  //return the last subreddits to show in the subreddist list
  const { data } = useQuery(GET_SUBREDDITS_WITH_LIMIT, {
    variables: {
      limit: 10,
    },
  });

  const subreddits: Subreddit[] = data?.getSubredditListLimit;

  return (
    <div className="my-7 mx-auto max-w-5xl">
      <Head>
        <title>Reddit 2.0 - React</title>
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      {/* There is no need to put the header component here,since we are calling 
      directly from _app.tsx */}
      {/* <Header /> */}
      {/* PostBox */}
      <PostBox />
      {/* feed   */}
      <div className="flex">
        <Feed />
        <div
          className="sticky top-36 mx-5 mt-5
         hidden h-fit min-w-[300px] rounded-md border
          border-gray-300 bg-white lg:inline"
        >
          <p className="text-md mb-1 p-4 pb-3 font-bold">Top Communities</p>

          <div>
            {/* List subredits */}
            {subreddits?.map((subreddit, i) => (
              <SubredditRow
                key={subreddit.id}
                topic={subreddit.topic}
                index={i}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
