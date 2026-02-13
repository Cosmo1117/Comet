// url bar search history i hope this works
console.log("JS LOADED");
const searchinput = document.getElementById('url-input');

searchinput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        const searchValue = searchinput.value;

        localStorage.setItem("lastSearch", searchValue)

        console.log("saved:", searchValue)
    }
});