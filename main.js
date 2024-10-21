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
    console.log("dowwwn")
    loopX += -0.1;
  } else if( vert === "up") {
    console.log("upppp")
    loopX += 0.1;
  }

  if( hori === "left") {
    console.log("lefft")
    loopY += -0.1;
  } else if( hori === "right") {
    loopY += 0.1;
    console.log("righhht", loopY)
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
    const yMod = Math.floor( idx / 10 );
    const yPos = (yMod / 10) * 10;
    const zDepth = yMod / 10;
    const xWidth = (yMod / 10) * 300;
    // go from -20% to +20%
    const yWidth = (Math.cos( (yMod / 10) * (Math.PI)) * 40) - 20;

    const sine = Math.sin(((idx / total) + loopY) * (Math.PI * 2) );
    const cos = Math.cos(((idx / total) + loopY + loopX) *  (Math.PI * 2 ) );
    const normSine = (sine / 2) + 0.5;
    const normCos = (cos / 2) + 0.5;
    
    // x translate absolute
    item.style.left = `${(normSine * 300) - 120}%`;
    item.style.top = `${(normCos * yWidth) + yPos}%`; 
    
    // translate Z axis 
    item.style.transform = `scale(${normCos + 0.3})`;
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