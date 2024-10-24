import { getRandomInt } from "./helpers/random.js";
import { convertMojesToCSV } from "./helpers/convert-cms.js";
import { captureScroll } from "./helpers/getScroll.js";

let loopY = 0;
let loopX = 0;
let start = false;
const scrollPos = {};
let langSwap = 'english';
// convertMojesToCSV();

Webflow.push(function() {

  // capture scroll
  function onScroll( event ) {
    const vert = event.vertical;
    const hori = event.horizontal;
    
    if( vert === "down") {
      loopX += 10;
      if( loopX < 0 ) {
        loopX = 100;
      } 
    } else if( vert === "up") {
      loopX -= 10;
      if ( loopX > 100) {
        loopX = 0;
      }
    }
  
    if( hori === "left") {
      loopY += -0.1;
    } else if( hori === "right") {
      loopY += 0.1;
    }
    render();
  }
  const stopScroll = captureScroll( onScroll, 1000 );
  
  // the container
  const container = document.querySelector(".newspaper-articles-container");

  
  
  // get the newspaper collection items
  const newspaperItems = document.querySelectorAll(".newspaper-article-item");
  
  
  
  const total = newspaperItems.length;
  
  // run through the newspaper items and create new positions
  function render() {
    newspaperItems.forEach( (item, idx) => {
      // make visible
      if(!start) {
        item.style.opacity = 1;
      }
      
      if(langSwap === "english") {
         // get the english data

         const title = item.children[0].children[0].getAttribute('data-english-title');

         // kind of crazy but works
         item.children[2].children[0].innerText = title;
      } else {
         // get the marathi data
         const title = item.children[0].children[0].getAttribute('data-marathi-title');

         // kind of crazy but works
         item.children[2].children[0].innerText = title;
      }

  
      // calculate yPositon based on groups of 10, normalize
  
      // width circle math, rotate around yAxis
      const yAxisControl = (idx % 10) / 10;
      const sineY = Math.sin( (yAxisControl + loopY) * (Math.PI * 2) );
      const cosY = Math.cos( (yAxisControl + loopY) * (Math.PI * 2 ) );
      const normSineY = (sineY / 2) + 0.5;
      const normCosY = (cosY / 2) + 0.5;
  
      // get og yPos with divide and floor
      let getYPos = Math.floor( idx / 10 ) * 10;
      // // checkerboard Y mod
      const offsetY = idx % 2;
      
  
      const yPos = ( loopX + getYPos + (offsetY*4) ) % 100;
  
      
      
  
      // x and y translate 
      // translate pseudo Z axis, using scale
      item.style.transform = `
        translate( 
          ${((normSineY * 300) - 100) + 50}%,
          ${((yPos/100) * 2000) - 200}%
        )
        scale(${ handleScale( ( normCosY ) / 2) })
      `;
      
      
    });
  
  }
  render();
  
  // (hoist) if size is small make 0, make the little ones in the back 'dissapear'
  function handleScale( amt ) {
    if( amt < 0.2 ) {
      return 0
    } else {
      return amt
    }
  }
  
  // get the interactive buttons
  const englishButton = document.querySelector("#news-lang-english");
  const marathiButton = document.querySelector("#news-lang-marathi");

  // on click change style and turn off other
  englishButton.addEventListener("click", () => {
    marathiButton.classList.remove('selected');
    englishButton.classList.add('selected');
    if(langSwap !== 'english') langSwap = "english";
    render();
  });
  marathiButton.addEventListener("click", () => {
    englishButton.classList.remove('selected');
    marathiButton.classList.add('selected');
    if(langSwap !== 'marathi') langSwap = "marathi";
    render();
  });
  
  
})