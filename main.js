import { getRandomInt } from "./helpers/random.js";
import { convertMojesToCSV } from "./helpers/convert-cms.js";
import { captureScroll } from "./helpers/getScroll.js";

let loopY = 0;
let loopX = 0;
let start = false;
const scrollPos = {}

// capture scroll
function onScroll( event ) {
  const vert = event.vertical;
  const hori = event.horizontal;
  
  if( vert === "down") {
    loopX += 5;
    if( loopX < 0 ) {
      loopX = 100;
    } 
  } else if( vert === "up") {
    loopX -= 5;
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
  // console.log("handleScroll", event)
}
const stopScroll = captureScroll( onScroll, 1800 );

const container = document.querySelector(".newspaper-articles-container")
// // get all newspaper elements, position them across a large window

// get the newspaper collection items
const newspaperItems = document.querySelectorAll(".newspaper-article-item");
console.log("newspaperItems", newspaperItems);



const total = newspaperItems.length;
// run through the newspaper items and create new positions
function render() {
  newspaperItems.forEach( (item, idx) => {
    // make visible
    if(!start) {
      item.style.opacity = 1;
    }

    // calculate yPositon based on groups of 10, normalize

    // width circle math, rotate around yAxis
    const yAxisControl = (idx % 10) / 10;
    console.log("yAxis control: ", yAxisControl)
    const sineY = Math.sin( (yAxisControl + loopY) * (Math.PI * 2) );
    const cosY = Math.cos( (yAxisControl + loopY) * (Math.PI * 2 ) );
    const normSineY = (sineY / 2) + 0.5;
    const normCosY = (cosY / 2) + 0.5;

    // get og yPos with divide and floor
    let getYPos = Math.floor( idx / 10 ) * 10;

    const yPos = ( loopX + getYPos ) % 100;
    console.log("wtfff", yPos)

    

    // x and y translate 
    // translate pseudo Z axis, using scale
    item.style.transform = `
      translate( 
        ${((normSineY * 400) - 200) + 100}%,
        ${((yPos/100) * 1000) - 200}%
      )
      scale(${( normCosY ) / 2})
    `;
    
    
  });

}
render();


// listen to user click
// window.addEventListener("click", (event) => {
//   console.log("whaaat")
  
//   // convertMojesToCSV();
// });

// listen to scroll as well

// maybe an up and down thing is possible