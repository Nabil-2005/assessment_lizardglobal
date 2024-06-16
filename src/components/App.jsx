import React, { useEffect, useRef, useState } from "react";
import PostItem from "./PostItem";
import '../styles/index.css';

const App = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetch('/api/posts')
      .then(response => response.json())
      .then(data => {
        setPosts(data.posts);
        const allCategories = new Set();
        data.posts.forEach(post => {
          post.categories.forEach(category => {
            allCategories.add(category.name);
          });
        });
        setCategories(Array.from(allCategories));
      });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const handleCategoryChange = (category) => {
    setCurrentPage(1);
    setFilteredCategories(prevCategories => 
      prevCategories.includes(category)
        ? prevCategories.filter(cat => cat !== category)
        : [...prevCategories, category]
    );
  };

  const filteredPosts = filteredCategories.length === 0
    ? posts
    : posts.filter(post =>
        post.categories.some(category => filteredCategories.includes(category.name))
      );

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="app">

      <div className="category-filter" ref={dropdownRef}>
        <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="filter-button">Filter Categories</button>
        {isDropdownOpen && (
          <div className="dropdown">
            {categories.map(category => (
              <div key={category}>
                <label>
                  <input
                    type="checkbox"
                    checked={filteredCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                  />
                  {category}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="posts-list">
        {currentPosts.map(post => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>

      <ul className="pagination">
        {Array.from({ length: Math.ceil(filteredPosts.length / postsPerPage) }, (_, i) => (
          <li key={i + 1}>
            <a onClick={() => paginate(i + 1)} href="#">
              {i + 1}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
