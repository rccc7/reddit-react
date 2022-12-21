import { useSession } from "next-auth/react";
import React, { useState } from "react";
import Avatar from "./Avatar";
import { LinkIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { ADD_POST, ADD_SUBREDDIT } from "../graphql/mutations";
import client from "../apollo-client";
import {
  GET_ALL_POSTS,
  GET_ALL_POSTS_BY_TOPIC,
  GET_SUBREDDIT_BY_TOPIC,
} from "../graphql/queries";
import toast from "react-hot-toast";

//Defne the type of data that is gonna be inside the Postbox form
type FormData = {
  postTitle: string;
  postBody: string;
  postImage: string;
  subreddit: string;
};

type Props = {
  // Here, subreddit?: string --> means that it is an optional value
  subreddit?: string;
};

function PostBox({ subreddit }: Props) {
  const { data: session } = useSession();
  //In order to automatially update the Feed whenever a new post is added,
  //we'll add the refetchQueries parameters to the useMutation so after adding
  //the new post, it'll automatically be displayed in the Feed
  const [addPost] = useMutation(ADD_POST, {
    refetchQueries: [
      // If the post is in the subreddit page then refetch posts by topic,
      // otherwise refetch all posts
      subreddit
        ? { query: GET_ALL_POSTS_BY_TOPIC, variables: { topic: subreddit } }
        : { query: GET_ALL_POSTS },
    ],
  });
  const [addSubreddit] = useMutation(ADD_SUBREDDIT);
  const [imageBoxOpen, setImageBoxOpen] = useState<boolean>(false);
  // For more info about useForm go to: https://react-hook-form.com/get-started
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  //Note that this handleSubmit function was defined in useForm hook
  const onSubmit = handleSubmit(async (formData) => {
    console.log("The form data>>>", formData);
    const notification = toast.loading("Creating new post...");

    try {
      //Query for the subreddit topic to check whether this topic already exists.
      const {
        data: { getSubredditListByTopic },
      } = await client.query({
        query: GET_SUBREDDIT_BY_TOPIC,
        variables: {
          topic: subreddit || formData.subreddit,
        },
      });

      console.log("the list...", getSubredditListByTopic);

      const subredditExists = getSubredditListByTopic.length > 0;

      if (!subredditExists) {
        //create subreddit
        console.log("Subreddit is new! -> Creating a new subreddit...");

        const {
          // The data contains the insertSubreddit query name as defined in the file
          //stepzen/postgresql/index.graphql, but here we rename it to newSubreddit
          data: { insertSubreddit: newSubreddit },
        } = await addSubreddit({
          variables: {
            topic: subreddit || formData.subreddit,
          },
        });

        console.log("Creating the post...", formData);

        // In case the image is undefined...
        const image = formData.postImage || "";

        const {
          // Here the data's name returned is insertPost (which is the same as the mutation name),
          // but we are renaming with newPost
          data: { insertPost: newPost },
        } = await addPost({
          variables: {
            body: formData.postBody,
            image: image,
            subreddit_id: newSubreddit.id,
            title: formData.postTitle,
            username: session?.user?.name,
          },
        });

        console.log("The new post added>>>", newPost);
      } else {
        //use existing subreddit and post directly
        console.log("Using existing subredit...");
        console.log(getSubredditListByTopic);

        const image = formData.postImage || "";

        const {
          data: { insertPost: newPost },
        } = await addPost({
          variables: {
            body: formData.postBody,
            image: image,
            subreddit_id: getSubredditListByTopic[0].id,
            title: formData.postTitle,
            username: session?.user?.name,
          },
        });

        console.log("The new post added>>>", newPost);
      }

      //After post has been added...
      //Reset the forms values...
      setValue("postBody", "");
      setValue("postImage", "");
      setValue("postTitle", "");
      setValue("subreddit", "");

      toast.success("New Post Created!", {
        id: notification,
      });
    } catch (error) {
      console.log(
        "An error ocurred, we could not post the new post..." + error
      );
      toast.error("Whoops something went wrong...", {
        id: notification,
      });
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      className="sticky top-16 z-50 border rounded-md
     border-gray-300 bg-white p-2"
    >
      <div className="flex items-center space-x-3">
        <Avatar large seed="" />

        <input
          //  register the input into the hook by invoking the "register" function
          {...register("postTitle", { required: true })}
          disabled={!session}
          className="flex-1 rounded-md bg-gray-50 p-2 pl-5 outline-none"
          type="text"
          placeholder={
            session
              ? subreddit //--> If the subreddit is defined then include it otherwise just Create a post by entering a title
                ? `Create a Post r/${subreddit}`
                : "Create a Post by entering a title!"
              : "Sign In to Post"
          }
        />

        <PhotoIcon
          onClick={() => setImageBoxOpen(!imageBoxOpen)}
          className={`h-6 text-gray-300 cursor-pointer ${
            imageBoxOpen && "text-blue-300"
          }`}
        />
        <LinkIcon className={`h-6 text-gray-300 cursor-pointer`} />
      </div>
      {/* Only when the user starts typing then  we'll show this div with extra info to post.
        !!watch('postTitle') --> This means convert this value to boolean*/}
      {!!watch("postTitle") && (
        <div className="flex flex-col py-2">
          {/* Body */}
          <div className="flex items-center px-2">
            <p className="min-w-[90px]">Body:</p>
            <input
              className="m-2 flex-1 bg-blue-50 p-2 outline-none"
              {...register("postBody")}
              type="text"
              placeholder="Text (Optional)"
            />
          </div>
          {/* Subreddit */}
          {/* Only if there is subreddit is not defined render this area otherwise do not render */}
          {!subreddit && (
            <div className="flex items-center px-2">
              <p className="min-w-[90px]">Subreddit:</p>
              <input
                className="m-2 flex-1 bg-blue-50 p-2 outline-none"
                {...register("subreddit", { required: true })}
                type="text"
                placeholder="i.e. javascript"
              />
            </div>
          )}

          {imageBoxOpen && (
            <div className="flex items-center px-2">
              <p className="min-w-[90px]">Image URL:</p>
              <input
                className="m-2 flex-1 bg-blue-50 p-2 outline-none"
                {...register("postImage")}
                type="text"
                placeholder="Optional..."
              />
            </div>
          )}
          {/* Errors 
          If the Object errors contains errors then we'll start rendering them*/}
          {Object.keys(errors).length > 0 && (
            <div className="space-y-2 p-2 text-red-500">
              {errors.postTitle?.type === "required" && (
                <p>-A Post Title is required</p>
              )}
              {errors.subreddit?.type === "required" && (
                <p>- A Subreddit is required</p>
              )}
            </div>
          )}
          {!!watch("postTitle") && (
            <button
              type="submit"
              className="w-full rounded-full bg-blue-400 p-2 text-white"
            >
              Create Post
            </button>
          )}
        </div>
      )}
    </form>
  );
}

export default PostBox;
