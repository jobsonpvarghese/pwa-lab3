import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js"
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-firestore.js"

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBso3VPw9OAA-zBqjbih_Pvgj_rCGi5Bis",
  authDomain: "pwa-lab3-b6948.firebaseapp.com",
  projectId: "pwa-lab3-b6948",
  storageBucket: "pwa-lab3-b6948.appspot.com",
  messagingSenderId: "112986412099",
  appId: "1:112986412099:web:f1397eeaaabd4a539670f6",
  measurementId: "G-196EDMDGLQ"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const dbCollection = collection(db, "playlist")

var title = document.getElementById("title") // Get the title element
var artist = document.getElementById("artist") // Get the artist element
const alert = document.getElementsByClassName("alert") // Get the alert element

let likeCount = 0 // Like count variable
// button on click event
document.getElementById("add-song").addEventListener("click", () => {
  // Get the value of the input fields
  var song = {
    title: title.value,
    artist: artist.value,
    like: 0
  }
  validation(song)
})

// Validation function
const validation = data => {
  if (data.title && data.artist) {
    // Clear the input fields
    title.value = ""
    artist.value = ""

    // Making the alert disappear
    title.style.border = "1px solid grey"
    artist.style.border = "1px solid grey"

    //Hiding the alert
    alert[0].style.display = "none"

    addDoc(dbCollection, data)
      .then(docRef => {
        console.log("Success: ", docRef?.id)
        createSongList(data, docRef?.id)
      })
      .catch(error => {
        console.error("Error: ", error)
      })
    // Add song to the list
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

// delete data from the database
const deleteData = id => {
  deleteDoc(doc(db, "playlist", id))
    .then(() => {
      console.log("Document successfully deleted!")
      document.getElementById(id).remove()
    })
    .catch(error => {
      console.error("Error removing document: ", error)
    })
}

// Fetch data from the database
const fetch = async () => {
  console.log("Data fetched")
  const dbCollection = collection(db, "playlist")
  const querySnapshot = await getDocs(dbCollection)
  querySnapshot.forEach(doc => {
    createSongList(doc.data(), doc.id)
  })
}
window.onload = fetch

// create song list
const createSongList = (data, id) => {
  const songContainer = document.getElementsByClassName("song-container") // Get the song container
  const songList = document.createElement("DIV") // Create a div element

  songList.classList.add("song-list") // Add the class song-list to the div element
  songList.id = id // Add the id to the div element
  songContainer[0].appendChild(songList) // Append the div element to the song container
  songList.innerHTML = `
        <div class="song-list-content">
          <div>
            <h3>${data?.title}</h3>
            <h4>${data?.artist}</h4>
          </div>
          <div>
            <h3>Likes: <span id="like">${data?.like}</span></h3>
          </div>
        </div>
        <div class="song-list-action">
        </div>
    `
  renderRemoveButton(id, songList.querySelector(".song-list-action"))
  renderLikeButton(id, songList.querySelector(".song-list-action"), data?.like)
}

function renderRemoveButton(id, elemAction) {
  const buttonRemove = document.createElement("button")
  buttonRemove.innerText = "Delete"
  buttonRemove.className = "delete-btn"
  elemAction.append(buttonRemove)

  buttonRemove.addEventListener("click", () => {
    deleteData(id)
  })
}

function renderLikeButton(id, elemAction, like) {
  const buttonRemove = document.createElement("button")
  buttonRemove.innerText = "+1 Like"
  buttonRemove.className = "like-btn"
  elemAction.append(buttonRemove)
  likeCount = like
  buttonRemove.addEventListener("click", () => {
    likeCount++

    updateDoc(doc(db, "playlist", id), {
      like: likeCount
    }).then(() => {
      console.log("Document successfully updated!")
      const like = document.getElementById(id).querySelector("#like")
      like.innerHTML = likeCount
    })
  })
}

// Register the service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js", { scope: "/pwa-lab3/" })
      .then(registration => {
        console.log("Service Worker registered: ", registration)
      })
      .catch(registrationError => {
        console.log("Service Worker registration failed: ", registrationError)
      })
  })
}
