// url bar search history i hope this works
console.log("JS LOADED");
const searchinput = document.getElementById('url-input');
console.log(searchinput);

searchinput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        console.log("search entered")
    }
});