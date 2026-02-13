// url bar search history i hope this works
const input = document.getElementById('url-input');

input.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        console.log("search entered")
    }
});