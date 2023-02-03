import { handleLinkClicked } from "./history.js";
import { getFavoriteList, addFavorite, removeFavorite } from "./favorite.js";

export function buildSearchResults(results, isFavList) {
	const favList = getFavoriteList();
	results.forEach(res => {
		const id = res.id ?? res.pageid;
		const isFav = isFavList || favList.find(fav => fav.id == id);
		const resultItem = createResultItem(id, res, isFav);
		const resultContents = document.createElement("div");
		resultContents.classList.add("resultContents");
		if (res.img || res.thumbnail) {
			const resultImage = createResultImage(res);
			resultContents.append(resultImage);
		}
		const resultText = createResultText(res);
		resultContents.append(resultText);
		resultItem.append(resultContents);
		const searchResults = document.getElementById("searchResults");
		searchResults.append(resultItem);
	});
}

export function deleteSearchResults() {
	const parent = document.getElementById("searchResults");
	let child = parent.lastElementChild;
	while (child) {
		parent.removeChild(child);
		child = parent.lastElementChild;
	}
}

function createResultItem(id, result, isFav) {
	const resultItem = document.createElement("div");
	resultItem.classList.add("resultItem");
	const resultTitle = document.createElement("div");
	resultTitle.classList.add("resultTitle");
	const link = document.createElement("a");
	link.href = `https://en.wikipedia.org/?curid=${id}`;
	link.textContent = result.title;
	link.target = "_blank";
	link.onclick = () => { return handleLinkClicked(id); };
	resultTitle.append(link);
	resultTitle.append(createFavoriteButton(id, isFav));
	resultItem.append(resultTitle);
	return resultItem;
}

function createFavoriteButton(id, isFav = false) {
	const favButton = document.createElement("div");
	favButton.classList.add("favSaveButton");
	if (isFav) {
		favButton.classList.add("favEntry");
	}
	const favIcon = document.createElement("i");
	favIcon.classList.add("fa-regular");
	favIcon.classList.add("fa-star");
	favButton.append(favIcon);
	favButton.onclick = () => {
		if (isFav) {
			removeFavorite(id);
			favButton.classList.remove("favEntry");
		} else {
			const success = addFavorite(id);
			if (success) {
				favButton.classList.add("favEntry");
			}
		}
	};
	return favButton;
}

function createResultImage(result) {
	const resultImage = document.createElement("div");
	resultImage.classList.add("resultImage");
	const img = document.createElement("img");
	img.src = result.img?.source ?? result.thumbnail?.source ?? null;
	img.alt = result.title ?? result.pageimage;
	resultImage.append(img);
	return resultImage;
}

function createResultText(result) {
	const resultText = document.createElement("div");
	resultText.classList.add("resultText");
	const resultDescription = document.createElement("p");
	resultDescription.classList.add("resultDescription");
	resultDescription.textContent = result.text ?? result.extract;
	resultText.append(resultDescription);
	return resultText;
}

export function clearStats(loading = false) {
	document.getElementById("stats").textContent = loading ? "Searching..." : "";
}

export function setStatsLine(text) {
	const stats = document.getElementById("stats");
	stats.textContent = text;
}
