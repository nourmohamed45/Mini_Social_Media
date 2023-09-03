// ======= Test Section =======




// ======= End Test Section =======


// ============================= Start Global Variables =============================
const baseUrl = "https://tarmeezacademy.com/api/v1"

// ===== Infinit Scrolling Variables =====

// =====  =====


// ============================= End Global Variables =============================

// ============================= Start Default Functions =============================
setupUI();
// getPosts();

// ============================= End Default Functions =============================

// ========= Start Global functions =========

// ======== Profile Clicked ========

function profileClicked() {
  const user = showUsernameAndProfilePicture();
  if(user == null) {
    alert("please login first")
  } else {
    let id = user.id;
    location.href = `./profile.html?userId=${id}`
  }
}

// ======== Show And Hide Loading ========

function toggleLoader(show = true) {
  if (show) {
    document.getElementById("loader").style.visibility = "visible";
  } else {
    document.getElementById("loader").style.visibility = "hidden";
  }
}


// ======== User Clicked ========

function userClicked(id) {
  location.href = `./profile.html?userId=${id}`
}

// Hide Alert after seconds
function hideAlert() {
  setTimeout(() => {
    let alert = document.getElementById("success-alert");
    alert.innerHTML = ""
  }, 1500);
}

// ======= Go To Post Details Page & Send Post Id =======
function postClicked(postId) {
  window.location.href = `./postDetails.html?postId=${postId}`
}

function swap() {
  document.getElementById("post-id-input").value = "";
  document.getElementById("post-modal-title").innerHTML = "Create A New Post";
  document.getElementById("postTitleInput").value = "";
  document.getElementById("postDescriptionInput").value = "";
  document.getElementById("createBtn").innerHTML = "Create";
}

  // ======== Register ========

function registerBtnClicked() {
  let userName = document.getElementById('userNameRegisterInput').value;
  let password = document.getElementById('passwordRegisterInput').value;
  let name = document.getElementById('nameRegisterInput').value;
  let profilePictureInput = document.getElementById('ImageRegisterInput');
  let profilePictureFile = profilePictureInput.files[0];

  const formData = new FormData();
  formData.append('image', profilePictureFile);
  formData.append('username', userName);
  formData.append('password', password);
  formData.append('name', name);
  toggleLoader(true);

  axios.post(`${baseUrl}/register`, formData, {
    headers: {
      "content-type": "multipart/form-data"
    }
  })
  .then((response) => {
    toggleLoader(false);
    
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    // showUsernameAndProfilePicture()
    const modal = document.getElementById("register-modal");
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
    setupUI();
    showAlert("Your Register has been successful.", "success");
    setTimeout(() => {
      location.reload();
    }, 1000);
    hideAlert()
  })
  .catch((error) => {
    toggleLoader(false);
    const errorMessage = error.response.data.message;
    showAlert(errorMessage,"danger");
    hideAlert();
  });
}


  // ======== Login ========
  
  function loginBtnClicked() {
    let userName = document.getElementById('userNameInput').value;
    let password = document.getElementById('passwordInput').value;
    const params = {
    "username" : userName,
    "password" : password
  }

  toggleLoader(true);
  axios.post(`${baseUrl}/login`, params)
  .then((response) => {
    toggleLoader(false);
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    // showUsernameAndProfilePicture()
    const modal = document.getElementById("login-modal");
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
    setupUI();
    showAlert("Your login has been successful.", "success");
    setTimeout(() => {
      location.reload();
    }, 1000);
    hideAlert()
  })
  .catch((error) => {
    toggleLoader(false);
    const errorMessage = error.response.data.message;
    showAlert(errorMessage,"danger");
    hideAlert()
  });
}


// ======== Log out ========

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  const logOutDiv = document.getElementById("log-out-div");
  logOutDiv.style.setProperty("display", "none", "important");
  setupUI()
  showAlert("Logged out successfully", "success");
  setTimeout(() => {
    location.reload();
  }, 1000);
  hideAlert()
}


// ========== Show Alert ==========

function showAlert(customMessage,type) {
  const alertPlaceholder = document.getElementById('success-alert');
  const alert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      '</div>'
    ].join('')

    alertPlaceholder.append(wrapper)
  }
  alert(customMessage, type)
  // closeAlert();
}
// to_do: Close the alert automatically
function closeAlert() {
  setTimeout(() => {
    const alertToHide = bootstrap.Alert.getOrCreateInstance('#success-alert')
    alertToHide.close()
  }, 1500);
}

// ========== Setup UI Function ==========

function setupUI() {
  const token = localStorage.getItem("token");
  const loginDiv = document.getElementById("log-in-div");
  const logOutDiv = document.getElementById("log-out-div");
  const addPostBtn = document.getElementById("add-post-btn");

  if(token == null) { // user is guest (not logged in)
    if( addPostBtn != null) {
      addPostBtn.style.setProperty("display", "none");
    }
    logOutDiv.style.setProperty("display", "none", "important");
    loginDiv.style.setProperty("display", "flex", "important");
  } else {
    showUsernameAndProfilePicture()
    if(addPostBtn != null) {
      addPostBtn.style.setProperty("display", "block");
    }
    logOutDiv.style.setProperty("display", "flex", "important");
    loginDiv.style.setProperty("display", "none", "important");
  }
}

// ========== Show Username and Profile Picture ==========

function showUsernameAndProfilePicture() {
  let user = null;
  const userProfilePictureUI = document.getElementById("current-profile-picture");
  const currentUsernameUI = document.getElementById("current-username");
  let test = localStorage.getItem("user");
  if (test != null) {
    user = JSON.parse(test);
    userProfilePictureUI.setAttribute("src", user.profile_image);
    currentUsernameUI.innerHTML = `@${user.username}`;
  }
  return user;
}


// Add A New Post

function addNewPost() {
  let postId = document.getElementById("post-id-input").value;
  let isCreate = postId == null || postId == ""
  let postTitleInput = document.getElementById("postTitleInput").value;
  let postDescriptionInput = document.getElementById("postDescriptionInput").value;
  let postImageInput = document.getElementById("postImageInput");
  let postImageFile = postImageInput.files[0];
  let token = localStorage.getItem("token");
  
  const formPostData = new FormData();
  formPostData.append('image', postImageFile);
  formPostData.append('title', postTitleInput);
  formPostData.append('body', postDescriptionInput);

  let url = ``
  if(isCreate) {
    url = `${baseUrl}/posts`
    toggleLoader(true);
    axios.post(url, formPostData, {
      headers: {
        "content-type": "multipart/form-data",
        'Authorization': `Bearer ${token}`,
      }
    })
    .then((response) => {
      toggleLoader(false);
      showAlert("Your post has been successfully posted", "success");
      const modal = document.getElementById("new-post-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      setTimeout(() => {
        location.reload();
      }, 1500);
    })
    .catch((error) => {
      toggleLoader(false);
      const errorMessage = error.response.data.message;
      showAlert(errorMessage,"danger");
      hideAlert();
    });
  } else {
    url = `${baseUrl}/posts/${postId}`
    formPostData.append("_method", "put");
    toggleLoader(true);
    axios.post(url, formPostData, {
      headers: {
        "content-type": "multipart/form-data",
        'Authorization': `Bearer ${token}`,
      }
    })
    .then((response) => {
      toggleLoader(false);
      showAlert("Your post has been successfully updated", "success");
      const modal = document.getElementById("new-post-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      setTimeout(() => {
        location.reload();
      }, 1500);
    })
    .catch((error) => {
      toggleLoader(false);
      const errorMessage = error.response.data.message;
      showAlert(errorMessage,"danger");
      hideAlert();
    });
  }
}


function editPostBtnClicked(postObject) {
  let  post = JSON.parse(decodeURIComponent(postObject));
  document.getElementById("post-id-input").value = post.id;
  document.getElementById("post-modal-title").innerHTML = "Edit Post";
  document.getElementById("postTitleInput").value = post.title;
  document.getElementById("postDescriptionInput").value = post.body;
  document.getElementById("createBtn").innerHTML = "Update";
  let postModal = new bootstrap.Modal(document.getElementById("new-post-modal"),{})
  postModal.toggle()
}

function deletePostBtnClicked(postObject) {
  let  post = JSON.parse(decodeURIComponent(postObject));
  document.getElementById("delete-post-id-input").value = post.id;

  let deletePostModal = new bootstrap.Modal(document.getElementById("delete-post-modal"),{})
  deletePostModal.toggle()
}

function confirmPostDelete() {
  let postId = document.getElementById("delete-post-id-input").value;
  let token = localStorage.getItem("token");
  toggleLoader(true);
  axios.delete(`${baseUrl}/posts/${postId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  })
  .then((response) => {
    toggleLoader(false);
    const modal = document.getElementById("delete-post-modal");
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
    showAlert("Your post has been Deleted successfully", "success");
    document.getElementById("delete-post-modal");
    setTimeout(() => {
      hideAlert();
      location.reload();
    }, 1000);

  })
  .catch((error) => {
    const errorMessage = error.response.data.error_message;
    showAlert(errorMessage,"danger");
    hideAlert();
  });
}