import React, { useEffect, useState } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BookmarkIcon,
  ChartBarIcon,
  EllipsisHorizontalIcon,
  GiftIcon,
  ShareIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/outline";
// import { ArrowDownIcon } from "@heroicons/react/24/solid";
import Avatar from "./Avatar";
import TimeAgo from "react-timeago";
import Link from "next/link";
import { Jelly } from "@uiball/loaders";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ALL_VOTES_BY_POST_ID } from "../graphql/queries";
import { ADD_VOTE } from "../graphql/mutations";

type Props = {
  post: Post;
};

function Post({ post }: Props) {
  const { data: session } = useSession();
  const [vote, setVote] = useState<boolean>(); //-->At the begining its value will be undefined.

  const { data, loading } = useQuery(GET_ALL_VOTES_BY_POST_ID, {
    variables: {
      post_id: post?.id,
    },
  });

  const [addVote] = useMutation(ADD_VOTE, {
    refetchQueries: [GET_ALL_VOTES_BY_POST_ID],
  });

  //useEffect is gonna run every time the votes chane
  useEffect(() => {
    const votes: Vote[] = data?.getVoteUsingVote_post_id_fkey;

    //Latest vote (as we sorted by newely created first in the SQL query)
    //Note: We could improve this by moving it to the original query
    //here the ? before accessing the uvpote property means that if we found votes made by the current user,
    //then get its value
    const vote = votes?.find(
      (vote) => vote.username === session?.user?.name
    )?.upvote;

    console.log("Vote found:>>", vote);
    console.log("The votes>>>", votes);
    console.log(session?.user?.name);

    setVote(vote);
  }, [data]);

  // If the post is undefined render the loader, otherwise render the post. This way
  //we prevent the error that raises when the post is undefined:
  // "TypeError: Cannot read properties of undefined (reading 'id')"
  // This happens because the fetch in pages/[postId].tsx (useQuery(GET_POST_BY_POST_ID))
  // is happening in the page and while the post is being retrieved its value is initally undefined
  // so we have two options:
  // 1. either use server side rendering
  // or
  // 2. use the loader and render it until the post.id is not undefined.
  //In this case we'll use the loader.
  if (!post)
    return (
      <div className="flex w-full items-center justify-center p-10 text-xl">
        <p>Loading...</p>
        <Jelly size={50} color="#FF4501" />
      </div>
    );

  const upVote = async (isUpVote: boolean) => {
    if (!session) {
      toast("You'll need to sign in to Vote!");
      return;
    }

    //Note: the value of vote is updated in the useEffect hook
    if (vote && isUpVote) return;
    if (vote === false && !isUpVote) return;

    console.log("voting...", isUpVote);

    const {
      data: { insertVote: newVote },
    } = await addVote({
      variables: {
        post_id: post.id,
        username: session.user?.name,
        upvote: isUpVote,
      },
    });

    console.log("PLACED VOTE", data);
  };

  const displayVotes = (data: any) => {
    const votes: Vote[] = data?.getVoteUsingVote_post_id_fkey;
    const displayNumber = votes?.reduce(
      (total, vote) => (vote.upvote ? (total += 1) : (total -= 1)),
      0
    );

    if (votes?.length === 0) return 0;
    if (displayNumber === 0) {
      //In order to not show a 0 value, then we get the value of the last vote.
      //If the last vote is true then return 1 otherwhise return -1
      return votes[0]?.upvote ? 1 : -1;
    }

    return displayNumber;
  };

  return (
    // Here, the whole component is surrounded by a Link because it is gonna behave as a link
    <Link href={`/post/${post.id}`}>
      <div
        className="flex cursor-pointer rounded-md border border-gray-300
     bg-white shadow-sm hover:border-gray-600"
      >
        {/* Left hand side for the votes */}
        <div
          className="flex flex-col items-center justify-start space-y-1 
      rounded-l-md bg-gray-50 p-4 text-gray-400"
        >
          <ArrowUpIcon
            className={`voteButtons hover:text-red-400 ${
              vote && "text-red-400"
            }`}
            onClick={() => upVote(true)}
          />
          <p className="text-xs text-black font-bold">{displayVotes(data)}</p>
          <ArrowDownIcon
            className={`voteButtons hover:text-blue-400 ${
              !vote === false && "text-blue-400"
            }`}
            onClick={() => upVote(false)}
          />
        </div>
        {/* the righ hand side for the content */}
        <div className="p-3 pb-1">
          {/* Header */}
          <div className="flex items-center space-x-2">
            <Avatar seed={post.subreddit?.topic} />
            <p className="text-xs text-gray-400">
              <Link href={`/subreddit/${post.subreddit?.topic}`}>
                <span className="font-bold text-black hover:text-blue-400 hover:underline">
                  r/{post.subreddit?.topic}
                </span>
              </Link>{" "}
              • Posted by u/{post.username} <TimeAgo date={post.created_at} />
            </p>
          </div>
          {/* Body */}
          <div className="py-4">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="mt-2 text-sm font-light">{post.body}</p>
          </div>

          {/* Image */}
          <img className="w-full" src={post.image} alt="" />

          {/* Footer */}
          <div className="flex space-x-4 text-gray-400">
            <div className="postButtons">
              <ChatBubbleLeftIcon className="h-6 w-6" />
              <p className="">{post.comment?.length} Comments</p>
            </div>
            <div className="postButtons">
              <GiftIcon className="h-6 w-6" />
              <p className="hidden sm:inline">{post.comment?.length} Award</p>
            </div>
            <div className="postButtons">
              <ShareIcon className="h-6 w-6" />
              <p className="hidden sm:inline">{post.comment?.length} Share</p>
            </div>
            <div className="postButtons">
              <BookmarkIcon className="h-6 w-6" />
              <p className="hidden sm:inline">{post.comment?.length} Save</p>
            </div>
            <div className="postButtons">
              <EllipsisHorizontalIcon className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Post;
