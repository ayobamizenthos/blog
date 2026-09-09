import { posts, savePosts } from "./data.js";

var container = document.getElementById("post-list");
var featuredSection = document.getElementById("featured");
var menuToggle = document.getElementById("menuToggle");
var mobileNav = document.getElementById("mobileNav");
var currentFilter = "all";
var searchQuery = "";

// Mobile menu toggle
if (menuToggle && mobileNav) {
  menuToggle.addEventListener("click", function () {
    mobileNav.classList.toggle("open");
  });
}

// Search functionality
var searchBtn = document.getElementById("searchBtn");
var searchModal = document.getElementById("searchModal");
var searchInput = document.getElementById("searchInput");
var searchClose = document.getElementById("searchClose");
var searchResults = document.getElementById("searchResults");
var mobileSearchInput = document.getElementById("mobileSearchInput");

if (searchBtn && searchModal) {
  searchBtn.addEventListener("click", function () {
    searchModal.classList.add("open");
    if (searchInput) searchInput.focus();
  });

  searchClose.addEventListener("click", function () {
    searchModal.classList.remove("open");
    searchInput.value = "";
    searchResults.innerHTML = "";
  });

  searchModal.addEventListener("click", function (e) {
    if (e.target === searchModal) {
      searchModal.classList.remove("open");
      searchInput.value = "";
      searchResults.innerHTML = "";
    }
  });

  searchInput.addEventListener("input", function () {
    performSearch(this.value);
  });
}

if (mobileSearchInput) {
  mobileSearchInput.addEventListener("input", function () {
    searchQuery = this.value.toLowerCase();
    render();
  });
}

function performSearch(query) {
  if (!query.trim()) {
    searchResults.innerHTML = "";
    return;
  }

  var results = posts.filter(function (post) {
    return post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.content.toLowerCase().includes(query.toLowerCase()) ||
      post.category.toLowerCase().includes(query.toLowerCase());
  });

  if (results.length === 0) {
    searchResults.innerHTML = '<p class="search-no-results">No articles found</p>';
    return;
  }

  var html = "";
  for (var i = 0; i < results.length; i++) {
    html += '<a href="post.html?id=' + results[i].id + '" class="search-result-item">' +
      '<span class="search-result-category">' + results[i].category + '</span>' +
      '<span class="search-result-title">' + results[i].title + '</span>' +
      '</a>';
  }
  searchResults.innerHTML = html;
}

// Category filtering
var categoryFilters = document.getElementById("categoryFilters");
if (categoryFilters) {
  categoryFilters.addEventListener("click", function (e) {
    if (e.target.classList.contains("category-tag")) {
      var allTags = categoryFilters.querySelectorAll(".category-tag");
      for (var i = 0; i < allTags.length; i++) {
        allTags[i].classList.remove("active");
      }
      e.target.classList.add("active");
      currentFilter = e.target.dataset.category;
      render();
    }
  });
}

function renderFeatured() {
  if (!featuredSection || posts.length === 0) {
    if (featuredSection) featuredSection.style.display = 'none';
    return;
  }

  var post = posts[0];
  var excerpt = post.content.replace(/\n/g, ' ');
  if (excerpt.length > 180) {
    excerpt = excerpt.substring(0, 180) + '...';
  }

  var imageUrl = post.image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80';

  featuredSection.innerHTML = '<div class="container">' +
    '<a href="post.html?id=' + post.id + '" class="featured-article">' +
    '<div class="featured-image" style="background-image: url(' + imageUrl + ')"></div>' +
    '<div class="featured-content">' +
    '<span class="featured-label">Featured Article</span>' +
    '<span class="featured-category">' + (post.category || 'Featured') + '</span>' +
    '<h2 class="featured-title">' + post.title + '</h2>' +
    '<p class="featured-excerpt">' + excerpt + '</p>' +
    '<div class="featured-meta">' +
    '<span class="featured-author">By ' + post.author + '</span>' +
    '<span class="featured-date">' + (post.date || 'Recently') + '</span>' +
    '</div>' +
    '<span class="featured-btn">Read Article →</span>' +
    '</div>' +
    '</a>' +
    '</div>';
}

function render() {
  if (!container) return;

  var postsToShow = featuredSection && posts.length > 1 ? posts.slice(1) : posts;

  // Apply category filter
  if (currentFilter !== "all") {
    postsToShow = postsToShow.filter(function (post) {
      return post.category === currentFilter;
    });
  }

  // Apply search filter from mobile search
  if (searchQuery) {
    postsToShow = postsToShow.filter(function (post) {
      return post.title.toLowerCase().includes(searchQuery) ||
        post.content.toLowerCase().includes(searchQuery);
    });
  }

  if (postsToShow.length === 0) {
    container.innerHTML = '<p style="text-align:center;grid-column:1/-1;padding:50px;color:#888;font-size:18px;">No articles found. <a href="create.html" style="color:#B4B4B8;">Write one</a></p>';
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
      '<div class="post-author-wrap">' +
      '<img src="Zenthos.png" alt="' + post.author + '" class="post-author-avatar">' +
      '<span class="post-author">' + post.author + '</span>' +
      '</div>' +
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
