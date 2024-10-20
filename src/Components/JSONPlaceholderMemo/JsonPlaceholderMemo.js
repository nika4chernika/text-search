import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import "./jsonplaceholdermemo.css";

const JsonPlaceholderMemo = () => {
  const [posts, setPosts] = useState([]);
  const [inputText, setInputText] = useState("");

  const createMarks = (str) => {
    const part = str.split("<mark>");
    return (
      <>
        {part[0]}
        <mark>{part[1]}</mark>
        {part[2]}
      </>
    );
  };

  const filterPosts = useCallback(() => {
    if (!inputText) return posts;

    // return posts.filter(
    //   (post) => post.title.includes(inputText) || post.body.includes(inputText)
    // );

    const newArr = [];
    for (let i = 0; i < posts.length; i++) {
      if (posts[i].title.includes(inputText)) {
        let startIndexFindWord = posts[i].title.indexOf(inputText);
        let newStr = posts[i].title.split("");
        newStr.splice(startIndexFindWord, 0, "<mark>");
        newStr.splice(
          startIndexFindWord + inputText.length + 1,
          0,
          "<mark>"
        );
        posts[i].title = newStr.join("");
        newArr.push(posts[i]);
        continue;
      }

      if (posts[i].body.includes(inputText)) {
        let startIndexFindWord = posts[i].body.indexOf(inputText);
        let newStr = posts[i].body.split("");
        newStr.splice(startIndexFindWord, 0, "<mark>");
        newStr.splice(
          startIndexFindWord + inputText.length + 1,
          0,
          "<mark>"
        );
        posts[i].body = newStr.join("");
        newArr.push(posts[i]);
      }
    }
    return newArr;
  }, [posts, inputText]);

const debounce = (fn, delay) => {
    console.log(delay)
    let timer 
    return (...args) => {
        if(timer) clearTimeout(timer)
        timer = setTimeout(() => fn(...args), delay) 
    }
  } 

  const handleChangeInputValue = useCallback(debounce((value) => setInputText(value), 1000), []) 

  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/posts"
        );
        setPosts(response.data);
      } catch (e) {
        console.error(e);
      }
    };
    getPosts();
  }, []);

  const filteredPosts = useMemo(() => filterPosts(), [filterPosts]);



  return (
    <div className="wrapper">
      <h1>Search posts</h1>
      <input
        onChange={(e) => handleChangeInputValue(e.target.value)}
        className="search-input"
        placeholder="Search posts..."
      />
      {filteredPosts.map((post) => (
        <div key={post.id} className="post">
          <h2>{createMarks(post.title)}</h2>
          <p>{createMarks(post.body)}</p>
        </div>
      ))}
    </div>
  );
};

export default JsonPlaceholderMemo;
