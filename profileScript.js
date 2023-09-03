const urlString = window.location.href;
const url = new URL(urlString);
let userId = url.searchParams.get("userId");

// Start Call Functions
showUserInfo();
setupUI();
getPosts();
// End Call Functions





// Start Building Function
function showUserInfo() {
  let test = localStorage.getItem('user');
  let namePost = document.getElementById("name-post");
  let userProfileImg = document.getElementById("header-img");
  let email = document.getElementById("email-address");
  let name = document.getElementById("name");
  let userName = document.getElementById("user-name");
  let postsNumber = document.getElementById("posts-number");
  let commentsCount = document.getElementById("comments-count");
  let  myId = JSON.parse(test);
  toggleLoader(true);
  axios.get(`${baseUrl}/users/${userId}`)
  .then((response) => {
    toggleLoader(false);
    let userInfo = response.data.data;
    namePost.innerHTML = `${userInfo.name}'s`;
    userProfileImg.setAttribute('src',userInfo.profile_image)
    email.innerHTML = userInfo.email;
    name.innerHTML = userInfo.name;
    userName.innerHTML = userInfo.username;
    postsNumber.innerHTML = userInfo.posts_count;
    commentsCount.innerHTML = userInfo.comments_count;
  })
  .catch((error) => {
    const errorMessage = error.response.data.message;
    showAlert(errorMessage,"danger");
    hideAlert();
  });
}


// Get Posts of Specific User
function getPosts() {
  toggleLoader(true);
  
  axios.get(`${baseUrl}/users/${userId}/posts`)
  .then(function (response) {
    toggleLoader(false);

    if(response.data.data.length === 0) {

      let postContainer = document.getElementById("posts");
      postContainer.innerHTML = `
      <div class="d-flex justify-content-center align-content-center flex-column mt-5">
        <h1 class="d-flex justify-content-center align-content-center fw-bold">There is No Posts yet</h1>
        <p class="d-flex justify-content-center align-content-center">Share Your Post with People</p>
      </div>
      `
    }
    
    // handle success
    for(let i = response.data.data.length - 1; i >= 0; i--) {
      let postContainer = document.getElementById("posts");
      let post = response.data.data[i];
      let postTitle = "";

      // show or hide edit button
      let user = showUsernameAndProfilePicture();

      let isMyPost = user != null && post.author.id == user.id
      let editBtnContent = ``;

      if (isMyPost) {
        editBtnContent = `
        <button class= "btn btn-danger" style="float:right;" onclick="deletePostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">Delete</button>
        <button class= "btn btn-primary" style="float:right; margin-right: 10px;" onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">Edit</button>
        `
      }


      if(post.title != null) {
        postTitle = post.title;
      }
      postContainer.innerHTML += `
      <!-- Start Post -->
      <div class="card shadow">
        <div class="card-header">
          <img src="${post.author.profile_image}" alt="" style="width: 40px; height: 40px; border-color: gray !important;" class="rounded-circle border border-3">
          <span class="fw-bold mx-2">@${post.author.username}</span>
          ${editBtnContent}
        </div>
        <div class="card-body" style="cursor: pointer;" onclick="postClicked(${post.id})">
          <img class="w-100" src="${post.image}" alt="">
          <h6 style="color: rgb(165, 165, 165);" class="mt-1">
            ${post.created_at}
          </h6>
          <h3>
            ${postTitle}
          </h3>
          <p>
            ${post.body}
          </p>
          <hr>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
              <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
            </svg>
            <span>
              (${post.comments_count}) Comments
            </span>
            <div style="display: inline-block;" id="tag-${post.id}" class="tags">
              
            </div>
          </div>
        </div>
      </div>
      <!-- End Post -->
      `
  
      let currentPostTagsId = `tag-${post.id}`;
      let tagsContainer = document.getElementById(currentPostTagsId);
      tagsContainer.innerHTML = "";
      
      for(tag of post.tags) {
        tagsContainer.innerHTML += `
        <button class="badge badge-pill rounded-5 badge-secondary m-1" style="background-color: grey; outline: none; border: none;">
          ${tag.name}
        </button>
        `
      }
    }
    // location.reload();
  })
  .catch(function (error) {
    toggleLoader(false);
    // handle error
    const errorMessage = error.response.data.message;
      showAlert(errorMessage,"danger");
      hideAlert();
  })
}

// End Building Function
