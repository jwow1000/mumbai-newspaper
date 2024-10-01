import { fetchMojes } from "./helpers/fetch.js";
// https://ctrl-z.in/frontest/pandoradocs/2.js

// grab element
const canvas = document.getElementById( 'canvas-newspaper' );
console.log(canvas)

// get data
let articleArray = [];

fetchMojes().then( (data) => {
  articleArray = data;
  console.log(data)

  
  articleArray.forEach(( article ) => {
    const div = document.createElement("div");
    const imgSrc = `https://pad.ma/documents/${ article.id }/512p.jpg`;
    const imgDiv = `<div><img src="${ imgSrc }" alt="${ article.title }" loading="lazy"></div>`;
    const link = `https://pad.ma/m/documents/${ article.id }/`
    const header = article.title;

    div.innerHTML = `
      <a href=${ link } target="_blank" loading="lazy">
        <h2>${ header }</h2>
        ${ imgDiv }
      </a>
    `
    
    canvas.appendChild( div );
  });
  



});

