import { getWikiResultById } from "./data.js"
import { clearSearchText } from "./searchBar.js"
import { buildSearchResults, deleteSearchResults, clearStats } from "./searchResults.js"

export function getFavoriteList() {
	const favorite = localStorage.getItem("favoriteList");
	return favorite ? JSON.parse(favorite) : [];
}

export function addFavorite(itemId) {
	const favoriteList = getFavoriteList();
	if (favoriteList.length === 20) {
		setFavoriteFullMessage();
		return false;
	} else {
		const favoriteItem = createFavoriteItem(itemId);
		favoriteList.push(favoriteItem);
		localStorage.setItem("favoriteList", JSON.stringify(favoriteList));
		return true;
	}
}

export function removeFavorite(itemId) {
	const favoriteList = getFavoriteList();
	const filteredList = favoriteList.filter(fav => fav.id != itemId);
	localStorage.setItem("favoriteList", JSON.stringify(filteredList));
}

export async function openFavoriteList() {
	deleteSearchResults();
	clearSearchText();
	clearStats(true);
	const favoriteList = getFavoriteList();
	const resultList = [];
	for (let f of favoriteList) {
		const item = await getWikiResultById(f.id);
		if (item) {
			resultList.push(item);
		}
	}
	buildSearchResults(resultList, true);
	setStatsLine(resultList.length);
}

function createFavoriteItem(itemId) {
	return {
		id: itemId
	};
}

function setFavoriteFullMessage() {
	const stats = document.getElementById("stats");
	stats.textContent = "Couldn't save article, because your favorite list is full.";
}

function setStatsLine(resultNum) {
	const stats = document.getElementById("stats");
	if (resultNum) {
		stats.textContent = "Displaying " + resultNum + " favorite results."
	} else {
		stats.textContent = "Your favorite list is empty."
	}
}