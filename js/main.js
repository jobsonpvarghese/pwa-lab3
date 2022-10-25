var title = document.getElementById("title") // Get the title element
var artist = document.getElementById("artist") // Get the artist element
const alert = document.getElementsByClassName("alert") // Get the alert element

// button on click event
document.getElementById("add-song").addEventListener("click", () => {
  // Get the value of the input fields
  var song = {
    title: title.value,
    artist: artist.value
  }
  validation(song)
})

// Register the service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js", { scope: "/pwa-lab2/" })
      .then(registration => {
        console.log("Service Worker registered: ", registration)
      })
      .catch(registrationError => {
        console.log("Service Worker registration failed: ", registrationError)
      })
  })
}

// Validation function
const validation = data => {
  if (data.title && data.artist) {
    // Add song to the list
    const songContainer = document.getElementsByClassName("song-container") // Get the song container
    const songList = document.createElement("DIV") // Create a div element
    songList.classList.add("song-list") // Add the class song-list to the div element
    songContainer[0].appendChild(songList) // Append the div element to the song container
    songList.innerHTML = `
          <h3>${data.title}</h3>
          <h4>${data.artist}</h4>
      `
    // Clear the input fields
    title.value = ""
    artist.value = ""

    // Making the alert disappear
    title.style.border = "1px solid grey"
    artist.style.border = "1px solid grey"

    //Hiding the alert
    alert[0].style.display = "none"
  } else {
    // Making the alert appear
    alert[0].style.display = "block"
    document.getElementsByClassName("alert-content")[0].innerHTML = "Please fill all the fields"

    // Making the input fields red
    if (data.title == "" && data.artist == "") {
      title.style.border = "1px solid red"
      artist.style.border = "1px solid red"
    }

    // Making the input fields red if the title is empty
    if (!data.title) {
      title.style.border = "1px solid red"
    } else {
      title.style.border = "1px solid green"
    }

    // Making the input fields red if the artist is empty
    if (!data.artist) {
      artist.style.border = "1px solid red"
    } else {
      artist.style.border = "1px solid green"
    }

    // Making the alert disappear after 4 seconds
    if (data.title && data.artist) {
      setTimeout(() => {
        alert[0].style.display = "none"
        title.style.border = "1px solid grey"
        artist.style.border = "1px solid grey"
      }, 4000)
    }
  }
}
