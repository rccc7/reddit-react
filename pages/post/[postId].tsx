import { useMutation, useQuery } from "@apollo/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import Post from "../../components/Post";
import { GET_POST_BY_POST_ID } from "../../graphql/queries";
import { SubmitHandler, useForm } from "react-hook-form";
import { ADD_COMMENT } from "../../graphql/mutations";
import { toast } from "react-hot-toast";
import Avatar from "../../components/Avatar";
import ReactTimeago from "react-timeago";

type FormData = {
  comment: string;
};

function PostPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [addComment] = useMutation(ADD_COMMENT, {
    // Here, were are not only passing the predefined query, but also the queryName
    refetchQueries: [GET_POST_BY_POST_ID, "getPostByBostId"],
  });

  const { data } = useQuery(GET_POST_BY_POST_ID, {
    variables: {
      post_id: router.query.postId,
    },
  });

  const post: Post = data?.getPost;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    //post comment here
    console.log("The data>>>", data);

    const notification = toast.loading("Posting your comment");
    await addComment({
      variables: {
        post_id: router.query.postId,
        username: session?.user?.name,
        text: data.comment,
      },
    });

    // Now set the value of the comment text area back to blank
    setValue("comment", "");

    toast.success("Comment Successfully Posted!", {
      id: notification, //this is the of the previously notification variable which will be dismissed
    });
  };

  // console.log("The dataaaaa>>", data);
  // const post: Post = data?.getPostListById

  return (
    <div className="mx-auto my-7 max-w-5xl">
      <Post post={post} />

      <div className="-mt-1 rounded-b-md border-t-0 border-gray-300 bg-white pl-16 p-5">
        <p className="text-sm">
          Comment as <span className="text-red-500">{session?.user?.name}</span>
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex space-y-2 flex-col"
          action=""
        >
          <textarea
            {...register("comment")}
            disabled={!session}
            className="h-24 rounded-md border border-gray-200 p-2 pl-4 outline-none disabled:bg-gray-50"
            placeholder={
              session ? "What are your thoughts" : "please sign in to connect"
            }
          />
          <button
            disabled={!session}
            type="submit"
            className="rounded-full bg-red-500 p-3 font-semibold text-white disabled:bg-gray-200"
          >
            Comment
          </button>
        </form>
      </div>
      <div className="-my-5 rounded-b-md border-t-0 border-gray-300 bg-white py-5 px-10">
        <hr className="py-2" />
        {post?.comment.map((c) => (
          <div
            className="relative flex items-center space-x-2 space-y-5"
            key={c.id}
          >
            <hr className="absolute top-10 left-7 h-16 border " />
            <div className="z-50">
              <Avatar seed={c.username} />
            </div>
            <div className="flex flex-col">
              <p className="py-2 text-xs text-gray-400">
                <span className="font-semibold text-gray-600">
                  {c.username}
                </span>{" "}
                <ReactTimeago date={c.created_at} />
              </p>
              <p>{c.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostPage;
