// Processes the input search term
export function getSearchTerm() {
	const rawSearchTerm = document.getElementById("search").value.trim();
	const regex = /[ ]{2,}/gi;
	// replace 2+ spaces with only 1 space
	const searchTerm = rawSearchTerm.replaceAll(regex, " ");
	return searchTerm;
}

// Performs a search through the Wiki API
export async function fetchSearchResults(searchTerm) {
	const wikiSearchRequest = getWikiSearchRequest(searchTerm);
	const wikiSearchResults = await requestData(wikiSearchRequest);
	let res = [];
	if (wikiSearchResults?.hasOwnProperty("query")) {
		res = processWikiResults(wikiSearchResults.query.pages);
	}
	return res;
}

// Creates a request string for the Wiki API
function getWikiSearchRequest(searchTerm) {
	const request = getBaseRequest().concat([
		`&generator=search`,					// type of search
		`&gsrsearch=${searchTerm}`,		// search input
		`&gsrlimit=20`,								// max number of results
	]);
	const rawSearchStr = request.join("");
	const searchStr = encodeURI(rawSearchStr);
	return searchStr;
}

function getBaseRequest() {
	let extractLength;
	const width = window.innerWidth || document.body.clientWidth;
	if (width < 480)
		extractLength = 120;
	else if (width < 1000)
		extractLength = 200;
	else
		extractLength = 260;
	return [
		`https://en.wikipedia.org/w/api.php?action=query`,
		`&prop=pageimages|extracts`,
		`&exchars=${extractLength}`,
		`&exintro`,
		`&explaintext`,
		`&exlimit=max`,
		`&format=json`,
		`&origin=*`
	];
}

// Fetches data with the given request
async function requestData(request) {
	try {
		const response = await fetch(request);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error);
	}
}

// Extracts the useful parts of the data
function processWikiResults(results) {
	const res = [];
	Object.keys(results).forEach(key => {
		const id = key;
		const title = results[key].title;
		const text = results[key].extract;
		const img = results[key].thumbnail ?? null;
		res.push({ id, title, img, text });
	})
	return res;
}

export async function getWikiResultById(id) {
	const request = getBaseRequest().concat([
		`&pageids=${id}`,
	]);

	//http://en.wikipedia.org/w/api.php?action=query&prop=info&pageids=<your_pageid_here>&inprop=url

	//https://en.wikipedia.org/w/api.php?action=query&prop=pageimages|extracts&pageids=95218&format=json&origin=*&explaintext&exintro&exlimit=max

	const rawSearchStr = request.join("");
	const searchStr = encodeURI(rawSearchStr);
	const result = await requestData(searchStr);
	return result?.query?.pages[id] ?? null;
}