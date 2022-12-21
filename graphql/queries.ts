import {gql} from '@apollo/client'

export const GET_SUBREDDIT_BY_TOPIC = gql`
query MyQuery($topic: String!){
    getSubredditListByTopic(topic: $topic){
        id
        topic
        created_at
    }
}
`;

export const GET_ALL_POSTS = gql`
query MyQuery{
  getPostList {
    id
    image
    subreddit_id
    title
    username
    created_at
    body
    subreddit {
      topic
      id
      created_at
    }
    comment {
      created_at
      id
      post_id
      text
      username
    }
    vote {
      created_at
      id
      post_id
      upvote
      username
    } 
  }
}
`;

export const GET_ALL_POSTS_BY_TOPIC = gql`
query MyQuery($topic: String!){
  getPostListByTopic(topic:$topic) {
    id
    image
    subreddit_id
    title
    username
    created_at
    body
    subreddit {
      topic
      id
      created_at
    }
    comment {
      created_at
      id
      post_id
      text
      username
    }
    vote {
      created_at
      id
      post_id
      upvote
      username
    } 
  }
}
`;

export const GET_POST_BY_POST_ID = gql`
query MyQuery($post_id: ID!){
  getPost(id: $post_id) {
    body
    comment {
      created_at
      id
      post_id
      text
      username
    }
    created_at
    id
    image
    subreddit {
      created_at
      id
      topic
    }
    subreddit_id
    title
    username
    vote {
      created_at
      id
      post_id
      upvote
      username
    }
  }
}
`

export const GET_ALL_VOTES_BY_POST_ID = gql`
query MyQuery($post_id: ID!){
  getVoteUsingVote_post_id_fkey(id: $post_id){
    created_at
    id
    post_id
    upvote
    username
  }
}
`

export const GET_SUBREDDITS_WITH_LIMIT = gql`
query MyQuery($limit: Int!){
  getSubredditListLimit(limit: $limit){
    created_at
    id
    topic
  }
}
`