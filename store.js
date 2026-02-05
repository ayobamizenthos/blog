import { Post } from "./models/Post.js";
import { Author } from "./models/Author.js";

const author = new Author("Zenthos");

export function loadPosts() {
  const data = JSON.parse(localStorage.getItem("posts")) || [];
  return data.map(p => new Post(p.id, p.title, p.content, author));
}

export function savePosts(posts) {
  localStorage.setItem("posts", JSON.stringify(posts));
}

export function initPosts() {
  if (!localStorage.getItem("posts")) {
    savePosts([
      new Post(1, "Welcome to My Blog", "This is my first blog post.", author),
      new Post(2, "Learning JavaScript", "JavaScript powers the web.", author)
    ]);
  }
}
