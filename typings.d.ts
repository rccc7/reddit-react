// Here, we are naming "Comments" instead of "Comment" because there is already a Comment interface in Typescript
// and in order to avoid conflict when accessing this type (The typescript engine will try to access the Comment interface and not this type)
// we give this a different name.
type Comments = {
    created_at: string
    id: number
    post_id: number
    text: string
    username: string
}

type Vote = {
    created_at: string
    id: number
    post_id: number
    upvote: boolean
    username: string
}

type Subreddit = {
    created_at: string
    id: number
    topic: string
}

type Post = {
    body: string
    created_at: string
    id: number
    image:string
    subreddit_id: number
    title: string
    username: string
    vote: Vote[]
    comment: Comments[]
    subreddit: Subreddit
}