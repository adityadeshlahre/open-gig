import axios from "axios";
import { useEffect, useState } from "react";
import { SERVER_URL } from "../utils/base";

const Form = () => {
  const [content, setContent] = useState<string>("");
  const [reply, setReply] = useState<string>("");
  const [parentId, setParentId] = useState<string>("");
  const [posts, setPosts] = useState<any>([]);
  const [page, setPage] = useState<number>(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // const result = UserSchema.safeParse({ name, email, password });

    // if (!result.success) {
    //   console.error(result.error.errors);
    //   return;
    // }

    // const user: User = result.data;

    axios
      .post(`${SERVER_URL}/post`, {
        content: content,
        parentId: parentId,
      })
      .then(() => {
        console.log(content);
        setContent(""); // Clear input after submission
        fetchPosts(); // Fetch posts again after submitting
      });
  };

  const handleReplySubmit = (postId: string) => {
    // Post the reply for the given postId
    axios
      .post(`${SERVER_URL}/reply`, {
        content: reply,
        parentId: postId,
      })
      .then(() => {
        setReply(""); // Clear reply input after submission
        fetchPosts(); // Fetch posts again after replying
      })
      .catch((error) => {
        console.error("Error posting reply:", error);
      });
  };

  const fetchPosts = () => {
    axios
      .get(`${SERVER_URL}/posts`, {
        params: {
          page: page,
          pageSize: 10,
        },
      })
      .then((response) => {
        setPosts(response.data.posts);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  };

  useEffect(() => {
    fetchPosts();
  }, [page, parentId]);

  return (
    <>
      <div className="text-center">POSTS</div>
      <form onSubmit={handleSubmit}>
        <input
          className="border-2 border-neutral-900"
          type="text"
          value={parentId}
          placeholder="parentId"
          onChange={(e) => setParentId(e.target.value)}
        />
        <input
          className="border-2 border-neutral-900"
          type="text"
          value={content}
          placeholder="content"
          onChange={(e) => setContent(e.target.value)}
        />
        <br />
        <br />
        <button type="submit" className="border-2 border-neutral-900">
          Submit
        </button>
      </form>

      <div className="posts-container">
        {posts.length > 0 ? (
          posts.map((post: any) => (
            <div
              key={post.id}
              className="post-item border p-2 my-2 rounded bg-gray-100"
            >
              <p>
                <strong>ID:</strong> {post.id}
              </p>
              <p>
                <strong>Content:</strong> {post.content}
              </p>
              <p>
                <strong>Parent ID:</strong> {post.parentId || "None"}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(post.createdAt).toLocaleString()}
              </p>

              <div className="reply-section">
                <input
                  type="text"
                  value={reply}
                  placeholder="Write a reply"
                  onChange={(e) => setReply(e.target.value)}
                  className="border-2 border-neutral-900 mb-2"
                />
                <button
                  onClick={() => handleReplySubmit(post.id)}
                  className="border-2 border-neutral-900"
                >
                  Reply
                </button>
              </div>

              {post.replies && post.replies.length > 0 && (
                <div className="replies-list mt-2">
                  <h4>Replies:</h4>
                  {post.replies.map((reply: any) => (
                    <div
                      key={reply.id}
                      className="reply-item border p-2 my-1 rounded bg-gray-200"
                    >
                      <p>
                        <strong>Reply ID:</strong> {reply.id}
                      </p>
                      <p>
                        <strong>Content:</strong> {reply.content}
                      </p>
                      <p>
                        <strong>Created At:</strong>{" "}
                        {new Date(reply.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No posts available</p>
        )}
      </div>

      <div className="pagination">
        <button
          className="border p-2 mx-2"
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </button>
        <button
          className="border p-2 mx-2"
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default Form;
