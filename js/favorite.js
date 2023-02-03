import { getWikiResultById } from "./data.js"
import { clearSearchText } from "./searchBar.js"
import { buildSearchResults, deleteSearchResults, clearStats, setStatsLine } from "./searchResults.js"

export function getFavoriteList() {
	const favorite = localStorage.getItem("favoriteList");
	return favorite ? JSON.parse(favorite) : [];
}

export function addFavorite(itemId) {
	const favoriteList = getFavoriteList();
	if (favoriteList.length === 20) {
		setStatsLine("Couldn't save article, because your favorite list is full.")
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
	let infoStr;
	if (resultList.length) {
		infoStr = "Displaying " + resultList.length + " favorite results."
	} else {
		infoStr = "Your favorite list is empty."
	}
	setStatsLine(infoStr);
}

function createFavoriteItem(itemId) {
	return {
		id: itemId
	};
}