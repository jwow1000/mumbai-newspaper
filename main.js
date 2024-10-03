import { fetchMojes } from "./helpers/fetch.js";
// https://ctrl-z.in/frontest/pandoradocs/2.js

// grab element
const canvas = document.getElementById( 'canvas-newspaper' );
const newsItem = document.querySelector(".newspaper-container");

console.log(canvas)

// get data
let articleArray = [];

// add filter by tag
// add pagination for results

fetchMojes().then( (data) => {
  articleArray = data;
  console.log(data)
  articleArray.forEach(( article ) => {
    const div = document.createElement("div");
    const imgSrc = `https://pad.ma/documents/${ article.id }/512p.jpg`;
    const link = `https://pad.ma/m/documents/${ article.id }/`
    const header = article.title.replace("Mojes Worli: ", "");
    const tags = `
      <button class="tag-button">Central Park</button>
      <button class="tag-button">Swamps</button>
    
    `

    const newArticle = newsItem.cloneNode( true );

    console.log("childsds", newArticle)

    const setImg = newArticle.querySelector(".newspaper-image");
    setImg.srcset = imgSrc;

    const setTitle = newArticle.querySelector(".newspaper-headline");
    setTitle.innerText = header;

    const setDate = newArticle.querySelector(".newspaper-date"); 
    setDate.innerText = article.date;
    
    const setContent = newArticle.querySelector(".newspaper-content-eng"); 
    setContent.innerHTML = article.content;
    
    // !!!!!!!! old way
    // div.innerHTML = `
    //   <div class="newspaper-container" style="display: block;">
    //     <div class="newspaper-line"></div>
        
    //     <div class="newspaper-left">
    //       <div class="newspaper-image-cont">
    //         <img class="newspaper-image" src=${ imgSrc } alt=${ article.title} >
    //       </div>  
    //       <div class="newspaper-title-cont">
    //           <h5 class="newspaper-date">${article.date}</h5>
    //           <h2 class="newspaper-headline">${header}</h2>
    //       </div>
    //     </div>

    //     <div class="newspaper-content-cont">
    //       <div class="newspaper-tag-cont">${ tags }</div>
    //       <p class="newspaper-content-eng">${ article.content }</p>
    //     </div>

    //   </div>
    // `
    
    canvas.appendChild( newArticle );
  });
  



});

{/* <a href=${ link } target="_blank" loading="lazy">
<h2 class="wonky">${ header }</h2>
${ imgDiv }
</a> */}