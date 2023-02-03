export const setSearchFocus = () => {
	document.getElementById("search").focus();
}

export const showClearTextButton = () => {
	const search = document.getElementById("search");
	const clear = document.getElementById("clear");
	if (search.value.length) {
		clear.classList.add("flex");
		clear.classList.remove("none");
	} else {
		clear.classList.add("none");
		clear.classList.remove("flex");
	}
	clear.classList.remove(search.value.length ? "none" : "flex");
	clear.classList.add(search.value.length ? "flex" : "none");
}

export const clearSearchText = (event) => {
	event?.preventDefault();
	document.getElementById("search").value = "";
	const clear = document.getElementById("clear");
	clear.classList.add("none");
	clear.classList.remove("flex");
	setSearchFocus();
}

export const clearKeyListener = (event) => {
	if (event.key === "Enter" /* || event.key === " " */) {
		event.preventDefault();
		document.getElementById("clear").click(); //clearSearchText();
	}
}