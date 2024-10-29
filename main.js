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
 
  
  
  // get the tag filter buttons
  const tagButtons = document.querySelectorAll(".tag-filter-button");
  console.log("tag buttons: ", tagButtons)
  // add a click function that changes the slug and re-renders with a filter
  tagButtons.forEach( (item) => {
    item.addEventListener("click", () => {
      // get item's tag
      const theTag =  item.childNodes[1].childNodes[0].textContent;
      // change url parameter, and rerender
      const url = new URL(window.location.href);
      const params = new URLSearchParams(url.search);
      params.set('tag', theTag.toLowerCase() );
      url.search = params.toString();
      window.history.replaceState({}, '', url);

      // clearAll();
      filter();
      render();
    })
  });
  
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

  // get window size
  const vpSize = {
    width: window.innerWidth,
    height: window.innerHeight,
  }

  // get the newspaper collection items
  const newspaperItems = document.querySelectorAll(".newspaper-article-item");
  
  // clear all newspaper items function
  function clearAll() {
    container.innerHTML = "";
  }

  // filter the newspaper items based on url params
  let newspaperItemsFilter = newspaperItems;
  
  function filter() {
    // get the url param 'tag', if no tag use newspaperItems 
    
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('tag');

    console.log("paramssas", params)
    if( slug ) {
      // filter based on tag
      newspaperItemsFilter = Array.from(newspaperItems).filter( (item) => {
        const tags = item.querySelector('#get-data').getAttribute('data-tags');
        if( tags.toLocaleLowerCase().includes( slug.toLowerCase() ) ) {
          item.style.display = "block";
          return item;
        } else {
          item.style.display = "none";
        }

      });
    } else {
      newspaperItems.forEach( (item) => {
        item.style.display = "block";
      });
    }
  }
  
  // run through the newspaper items and create new positions
  function render() {
    
    newspaperItemsFilter.forEach( (item, idx) => {
      
      // make visible
      if(!start) {
        item.style.opacity = 1;
      }

      item.style.display = "block";
      
      if(langSwap === "english") {
        // get the english data
        const title = item.children[0].children[0].getAttribute('data-english-title');

        // apply the data kind of crazy but works
        item.children[2].children[0].innerText = title;

      } else {
        // get the marathi data
        const title = item.children[0].children[0].getAttribute('data-marathi-title');

        // apply the data kind of crazy but works
        item.children[2].children[0].innerText = title;

      }
      
  
      // calculate yPositon based on groups of 10, normalize
      // scale to amount 
      const total = newspaperItemsFilter.length;
      console.log("total: ", total)
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
          ${ (normSineY * 300) - 25 }%,
          ${ ((yPos/100) * ((total/100)*1500)) - 200 }%
        )
        scale(${ handleScale( ( normCosY ) / 2) })
      `;
      
      
    });
  
  }

  // first call for filter and render
  filter();
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
    // no need to refilter, just render
    render();
  });
  
  marathiButton.addEventListener("click", () => {
    englishButton.classList.remove('selected');
    marathiButton.classList.add('selected');
    if(langSwap !== 'marathi') langSwap = "marathi";
    // no need to refilter, just render
    render();
  });
  
  
})