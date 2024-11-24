import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { prisma } from "@repo/db";

const app = express();
const port = process.env.PORT;
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello World!" });
});

app.get("/posts", async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 10;

  try {
    const rootPosts = await prisma.post.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        replies: true,
      },
    });

    res.json({
      page: page,
      pageSize: pageSize,
      posts: rootPosts,
    });
  } catch (error) {
    console.error("Error retrieving root posts:", error);
    res.status(500).json({ error: "Failed to retrieve root posts" });
  }
});

app.post("/post", async (req: Request, res: Response) => {
  const { content, parentId } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Content is required." });
  }

  try {
    const newPost = await prisma.post.create({
      data: {
        content: content.trim(),
        parentId: parentId || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    res.status(201).json({
      message: parentId
        ? "Reply added successfully"
        : "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the post." });
  }
});

app.post("/reply", async (req: Request, res: Response) => {
  const { content, parentId } = req.body;

  if (!content || !parentId) {
    return res
      .status(400)
      .json({ error: "Content and parentId are required." });
  }

  try {
    const parentPost = await prisma.post.findUnique({
      where: { id: parentId },
    });

    if (!parentPost) {
      return res.status(404).json({ error: "Parent post not found." });
    }

    const newReply = await prisma.reply.create({
      data: {
        content: content.trim(),
        parentId: parentId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    await prisma.post.update({
      where: { id: parentId },
      data: {
        replies: {
          connect: { id: newReply.id },
        },
      },
    });

    res.status(201).json({
      message: "Reply added successfully",
      reply: newReply,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while adding the reply." });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
