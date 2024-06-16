import React from "react";

//Display posts + details individually
const PostItem = ({ post }) => {
    return (
        <div className="post-item">
            <div className="post-header">
                <div className="author">
                    <img src={post.author.avatar} alt={post.author.name} />
                    <p>{post.author.name}</p>
                </div>
                <div className="date">
                    <p>{new Date(post.publishDate).toLocaleDateString()}</p>
                </div>
            </div>
            <h2>{post.title}</h2>
            <p>{post.summary}</p>
            <hr/>
            <div className="categories">
                {post.categories.map(category => (
                    <span key={category.id}>{category.name}</span>
                ))}
            </div>
        </div>
    );
};

export default PostItem;