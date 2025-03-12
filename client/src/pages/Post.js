import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helper/AuthContext";

function Post() {
  let { id } = useParams();
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { authState } = useContext(AuthContext);

  let navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3001/posts/byId/${id}`).then((response) => {
      setPostObject(response.data);
    });

    axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
      setComments(response.data);
    });
  }, [id]);

  const addComment = () => {
    axios
      .post(
        "http://localhost:3001/comments",
        {
          commentBody: newComment,
          PostId: id,
        },
        {
          headers: { 
            accessToken: localStorage.getItem("accessToken")
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          console.log(response.data.error);
        } else {
          const commentToAdd = {
            commentBody: newComment,
            username: response.data.username,
          };
          setComments((prev) => [...prev, commentToAdd]);
          setNewComment("");
        }
      })
      .catch((error) => console.error("Error adding comment:", error));
  };

  const deleteComment = (commentId) => {
    axios
      .delete(`http://localhost:3001/comments/${commentId}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        setComments(comments.filter((comment) => comment.id !== commentId));
      })
      .catch((error) => console.error("Error deleting comment:", error));
  };

  const deletePost = (postId) => {
    axios
      .delete(`http://localhost:3001/posts/${postId}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        navigate("/");
      })
      .catch((error) => console.error("Error deleting post:", error));
  };

  const editPost = (option) => {
    if(option === "title"){
      let newTitle = prompt("Enter New Title.");
      axios.put("http://localhost:3001/posts/title", {
        newTitle: newTitle, 
        id: id
      },{
        headers: { accessToken: localStorage.getItem("accessToken") },
      });

      setPostObject({...postObject, title: newTitle});
    }else {
      let newPostText = prompt("Enter New Post Text.");
      axios.put("http://localhost:3001/posts/postText", {
        newText: newPostText, 
        id: id
      },{
        headers: { accessToken: localStorage.getItem("accessToken") },
      });

      setPostObject({...postObject, postText: newPostText});
    }
  };

  return (
    <div className="postPage">
      <div className="leftSide">
        <div className="post" id="individual">
          <div 
            className="title" 
            onClick={() => {
              if (authState.username === postObject.username){
                editPost("title");
              }
            }}
          >
            {postObject.title}
          </div>
          <div 
            className="body"
            onClick={() => {
              if (authState.username === postObject.username){
                editPost("body");
              }
            }}
          >
            {postObject.postText}
          </div>
          <div className="footer">
            {postObject.username}
            {authState.username === postObject.username && postObject.id && (
              <button onClick={() => deletePost(postObject.id)}>Delete Post</button>
            )}
          </div>
        </div>
      </div>
      <div className="rightSide">
        <div className="addCommentContainer">
          <input
            type="text"
            placeholder="Comment..."
            autoComplete="off"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button onClick={addComment}>Add Comment</button>
        </div>
        <div className="listOfComments">
          {comments.map((comment, key) => (
            <div key={key} className="comment">
              {comment.commentBody}
              <label> Username: {comment.username} </label>
              {authState.username === comment.username && (
                <button onClick={() => deleteComment(comment.id)}>X</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Post;