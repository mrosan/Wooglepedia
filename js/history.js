import { getWikiResultById } from "./data.js"
import { clearSearchText } from "./searchBar.js"
import { buildSearchResults, deleteSearchResults, clearStats, setStatsLine } from "./searchResults.js"

export async function openHistoryList() {
	deleteSearchResults();
	clearSearchText();
	clearStats(true);
	const historyList = getHistoryList();
	const resultList = [];
	for (let h of historyList) {
		let item = await getWikiResultById(h.id);
		if (item) {
			resultList.push(item);
		}
	}
	buildSearchResults(resultList);
	let infoStr;
	if (resultList.length) {
		infoStr = "Displaying " + resultList.length + " history results."
	} else {
		infoStr = "You haven't visited any articles yet."
	}
	setStatsLine(infoStr);
}

export function handleLinkClicked(itemId) {
	let historyItem = createHistoryItem(itemId);
	const historyList = getHistoryList();
	const matchingIdx = historyList.findIndex(history => history.id == itemId);
	if (matchingIdx !== -1) {
		historyItem = historyList[matchingIdx];
		historyItem.date = new Date();
		historyList.splice(matchingIdx, 1);
	} else if (historyList.length === 20) {
		historyList.pop();
	}
	historyList.unshift(historyItem);
	localStorage.setItem("historyList", JSON.stringify(historyList));
	return true;
}

export function getHistoryList() {
	const history = localStorage.getItem("historyList");
	const historyList = history ? JSON.parse(history) : [];
	return historyList.sort((a, b) => { return a.date > b.date ? -1 : 1 });
}

function createHistoryItem(itemId) {
	return {
		id: itemId,
		date: new Date()
	};
}