import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { User, UserSchema } from "@repo/types";
import { prisma } from "@repo/db";

const app = express();
const port = process.env.PORT;
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello World!" });
});

// app.get("/posts", async (req, res) => {
//   const { page = 1, pageSize = 10 } = req.query;

//   try {
//     const rootPosts = await prisma.post.findMany({
//       where: {1
//         parentId: null, // Only root posts
//       },
//       skip: (page - 1) * pageSize,
//       take: parseInt(pageSize),
//       orderBy: {
//         createdAt: "desc",
//       },
//     });

//     res.json({
//       page: parseInt(page),
//       pageSize: parseInt(pageSize),
//       posts: rootPosts,
//     });
//   } catch (error) {
//     console.error("Error retrieving root posts:", error);
//     res.status(500).json({ error: "Failed to retrieve root posts" });
//   }
// });

app.post("/post", async (req: Request, res: Response) => {
  const { content, parentId } = req.body;

  try {
    const newPost = await prisma.post.create({
      data: {
        content: content,
        parentId: parentId || null,
      },
    });

    res.status(201).json({
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the post." });
  }
});

app.get("/posts", async (req: Request, res: Response) => {
  try {
    const users: User[] = await prisma.post.findMany();

    res.status(201).json({ users: users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Fething user error" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
