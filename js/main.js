import { setSearchFocus, showClearTextButton, clearSearchText, clearKeyListener } from "./searchBar.js";
import { buildSearchResults, deleteSearchResults, clearStats, setStatsLine } from "./searchResults.js"
import { getSearchTerm, fetchSearchResults } from "./data.js";
import { openHistoryList } from "./history.js"
import { openFavoriteList } from "./favorite.js"

document.addEventListener("readystatechange", (event) => {
	if (event.target.readyState === "complete") {
		initApp();
	}
})

function initApp() {
	setSearchFocus();
	const search = document.getElementById("search");
	search.addEventListener("input", showClearTextButton);
	const clear = document.getElementById("clear");
	clear.addEventListener("click", clearSearchText);
	clear.addEventListener("keydown", clearKeyListener);
	const form = document.getElementById("searchBar");
	form.addEventListener("submit", submitSearch);
	const history = document.getElementById("history");
	history.onclick = openHistoryList;
	const favorite = document.getElementById("favorite");
	favorite.onclick = openFavoriteList;
}

function submitSearch(event) {
	event.preventDefault();
	deleteSearchResults();
	processSearch();
	setSearchFocus();
}

async function processSearch() {
	clearStats();
	const searchTerm = getSearchTerm();
	if (searchTerm === "")
		return;
	setStatsLine("Searching...");
	const res = await fetchSearchResults(searchTerm);
	let infoStr;
	if (res?.length) {
		buildSearchResults(res);
		infoStr = "Displaying " + res.length + " results.";
	} else {
		infoStr = "No results found."
	}
	setStatsLine(infoStr);
}