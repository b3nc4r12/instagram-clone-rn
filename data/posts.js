import { users } from "./users"

export const posts = [
    {
        imageUrl: "https://i.ibb.co/182bP1y/4k.png",
        user: users[0].user,
        likes: 7870,
        caption: "Train Ride to Hogwarts",
        profile_picture: users[0].image,
        comments: [
            {
                user: "theqazman",
                comment: "Wow! Looks amazing!"
            },
            {
                user: "amaanath.dev",
                comment: "YAY"
            }
        ]
    }
]