let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  fetch('http://localhost:3000/toys').then((response)=>response.json()).then((data)=>{
    const toyBodyContainer = document.getElementById("toy-collection")
    data.map((toy)=>{
      const toyDetails = document.createElement("div");
      toyDetails.classList.add("card");
      toyDetails.innerHTML=`
          <h2>${toy.name}</h2>
          <img src="${toy.image}" class="toy-avatar" />
          <p id="likes-${toy.id}">${toy.likes || 0} Likes</p>  
          <button class="like-btn" id="${toy.id}">Like ❤️</button>
      `
      
      toyBodyContainer.appendChild(toyDetails);
      // add event listener to add like count
      const likeButton = toyDetails.querySelector(".like-btn");
      likeButton.addEventListener("click", () => {
      const likeCountElement = document.getElementById(`likes-${toy.id}`);
      let newLikes = parseInt(likeCountElement.textContent) + 1;

      // Send PATCH request to update likes
      fetch(`http://localhost:3000/toys/${toy.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ likes: newLikes }),
        })
          .then((response) => response.json())
          .then((updatedToy) => {
            // Update UI with new likes count
            likeCountElement.textContent = `${updatedToy.likes} Likes`;
          })
          .catch((error) => console.error("Error updating likes:", error));
      });
    });
  }).catch((err)=>{
    console.error(err)
  });

  // add a new toy
  document.querySelector(".add-toy-form").addEventListener("submit",(event)=>{
    event.preventDefault()
    const name = document.querySelector("[name=name]").value.trim();
    const image = document.querySelector("[name=image]").value.trim();
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({name,image,likes:0})
    }
    fetch("http://localhost:3000/toys",requestOptions).then((response)=>response.json()).catch((err)=>console.error(err))
  });

  
});
