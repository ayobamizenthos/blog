import { posts, savePosts } from "./data.js";

var container = document.getElementById("post-list");
var featuredSection = document.getElementById("featured");
var menuToggle = document.getElementById("menuToggle");
var mobileNav = document.getElementById("mobileNav");

if (menuToggle && mobileNav) {
  menuToggle.addEventListener("click", function () {
    mobileNav.classList.toggle("open");
  });
}

function renderFeatured() {
  if (!featuredSection || posts.length === 0) {
    if (featuredSection) featuredSection.style.display = 'none';
    return;
  }

  var post = posts[0];
  var excerpt = post.content.replace(/\n/g, ' ');
  if (excerpt.length > 200) {
    excerpt = excerpt.substring(0, 200) + '...';
  }

  var imageUrl = post.image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80';

  featuredSection.innerHTML = '<div class="container">' +
    '<a href="post.html?id=' + post.id + '" class="featured-article">' +
    '<div class="featured-image" style="background-image: url(' + imageUrl + ')"></div>' +
    '<div class="featured-content">' +
    '<span class="featured-category">' + (post.category || 'Featured') + '</span>' +
    '<h2 class="featured-title">' + post.title + '</h2>' +
    '<p class="featured-excerpt">' + excerpt + '</p>' +
    '<div class="featured-meta">' +
    '<span class="featured-author">' + post.author + '</span>' +
    '<span class="featured-date">' + (post.date || 'Recently') + '</span>' +
    '</div>' +
    '</div>' +
    '</a>' +
    '</div>';
}

function render() {
  if (!container) return;

  var postsToShow = featuredSection && posts.length > 1 ? posts.slice(1) : posts;

  if (postsToShow.length === 0) {
    container.innerHTML = '<p style="text-align:center;grid-column:1/-1;padding:50px;color:#888;font-size:18px;">No articles yet. <a href="create.html" style="color:#ff6b35;">Write the first one</a></p>';
    return;
  }

  var html = '';
  for (var i = 0; i < postsToShow.length; i++) {
    var post = postsToShow[i];
    var excerpt = post.content.replace(/\n/g, ' ');
    if (excerpt.length > 140) {
      excerpt = excerpt.substring(0, 140) + '...';
    }

    var imageHtml = '';
    if (post.image) {
      imageHtml = '<img src="' + post.image + '" alt="' + post.title + '" class="post-image">';
    }

    html += '<article class="post-card">' +
      imageHtml +
      '<div class="post-body">' +
      '<span class="post-category">' + (post.category || 'General') + '</span>' +
      '<h3 class="post-title"><a href="post.html?id=' + post.id + '">' + post.title + '</a></h3>' +
      '<p class="post-excerpt">' + excerpt + '</p>' +
      '<div class="post-meta">' +
      '<span class="post-author">' + post.author + '</span>' +
      '<span class="post-date">' + (post.date || 'Recently') + '</span>' +
      '</div>' +
      '</div>' +
      '<div class="post-actions">' +
      '<a href="post.html?id=' + post.id + '" class="btn btn-primary">Read Article</a>' +
      '<button class="btn btn-outline" data-delete="' + post.id + '">Delete</button>' +
      '</div>' +
      '</article>';
  }

  container.innerHTML = html;
}

document.addEventListener("click", function (e) {
  if (e.target.dataset.delete) {
    if (confirm('Delete this post?')) {
      var id = e.target.dataset.delete;
      for (var i = 0; i < posts.length; i++) {
        if (posts[i].id == id) {
          posts.splice(i, 1);
          savePosts();
          renderFeatured();
          render();
          break;
        }
      }
    }
  }
});

renderFeatured();
render();
