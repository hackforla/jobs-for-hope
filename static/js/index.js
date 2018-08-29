'use strict';


/***Homepage: Searchfield  TEMPLATE***/
const url = '';

function searchField() {
	const body = document.querySelector('body');
	const inputSearch = document.querySelector('.search-input');
	const inputLocation = document.querySelector('.location-input');
	const searchResults = document.querySelector('.search-results');

	console.log(inputSearch.value)
	console.log(inputLocation.value)

// 	fetch(url)
// 	.then(resp => resp.json())
// 	.then(data =>{
// 		console.log(data.results);
// 		//render html here based on fetched data
// 		searchResults.innerHTML =
// 			`<h2>${data.title}</h2>
// 			<h3>${data.organization}</h3>
// 			<p> Salary ${data.salary}</p>
// 			<a href="#">See more</a>
// 			`
// 	})
// 	.catch(error => {
// 		console.log(error)
// 	})
// 	body.appendChild(searchResults)
}
