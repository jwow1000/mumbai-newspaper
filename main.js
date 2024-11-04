import { getRandomInt } from "./helpers/random.js";
import { convertMojesToCSV } from "./helpers/convert-cms.js";
import { captureScroll } from "./helpers/getScroll.js";

let loopY = 0;
let loopX = 0;
let start = false;
let offset = 0;
const scrollPos = {};
let langSwap = 'english';
let tagFilter = -1;
let searchText = "";
// convertMojesToCSV();

Webflow.push(function() {
 
  // get the search form and prevent page reload
  document.querySelector(".search-form-newspaper").addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
    const text = event.target.querySelector('.newspaper-search-input');
    console.log("thes ", text.value)
    searchText = text.value.toLowerCase();
    
    filter();
    render();
  });
  
  
  // get the tag filter buttons
  const tagButtons = document.querySelectorAll(".tag-filter-button");
  
  // add a click function that changes the slug and re-renders with a filter
  tagButtons.forEach( (item, idx) => {
    item.addEventListener("click", () => {
      if( tagFilter !== idx) {
        // get item's tag
        let theTag =  item.childNodes[1].childNodes[0].textContent;
        // fix the and symbol
        theTag = (theTag === 'Policies & Regulations') ? 'policies and regulation' : theTag ;
        
        // change url parameter, and rerender
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);
        params.set('tag', theTag.toLowerCase() );
        url.search = params.toString();
        window.history.replaceState({}, '', url);
        
        tagButtons.forEach((item) => {
          item.style.opacity = "40%";
        })
        item.style.opacity = "100%";
        
        
  
        // clearAll();
        filter();
        render();
        tagFilter = idx;

      }
    })
  });
  
  // change the opacity of the tags
  function tagOpacity() {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const tagSlug = params.get('tag'); 

    tagButtons.forEach((item) => {
      // get item's tag
      let theTag =  item.childNodes[1].childNodes[0].textContent;
      // fix the and symbol
      theTag = (theTag === 'Policies & Regulations') ? 'policies and regulation' : theTag ; 
      
      if( tagSlug === theTag ) {
        item.style.opacity = "100%";
      } else {
        item.style.opacity = "40%";
      }

    }) 
  }
  
  // capture scroll
  function onScroll( event ) {
    const vert = event.vertical;
    const hori = event.horizontal;
   
    if( vert === "down") {
      loopX += 1;
      if( loopX > 10 ) {
        loopX = 0;
      } 
    } else if( vert === "up") {
      loopX -= 1;
      if ( loopX < 0) {
        loopY = 10;
      }
    }

  
    if( hori === "left") {
      loopY += 1;
      if( loopY > 10) {
        loopX = 0;
      }
    } else if( hori === "right") {
      loopY -= 1;
      if( loopY < 10) {
        loopY = 10;
      }
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
    const getSlug = params.get('tag');
    let slug = getSlug ? getSlug.toLowerCase() : "";
    
    // filter array by tag
    function filterTag( item ) {
      const data = item.querySelector('#get-data');
      const tags = data.getAttribute('data-tags').toLocaleLowerCase();
      
      if( tags.includes( slug ) ) {
        item.style.display = "block";
        return item;
        
      } else {
        item.style.display = "none";
      }
    }

    // filter array by search text
    function filterSearch( item ) {
      const data = item.querySelector('#get-data');
      const mTitle = data.getAttribute('data-marathi-title').toLocaleLowerCase();
      const eTitle = data.getAttribute('data-english-title').toLocaleLowerCase();

      if(mTitle.includes( searchText ) || eTitle.includes( searchText )) {
        item.style.display = "block";
        return item;
      } else {
        item.style.display = "none";
      }
    }

    if( slug && slug !== 'all') {
      // filter based on tag
      const newspaperItemsTags = Array.from(newspaperItems).filter( (item) => filterTag( item ));
      
      // filter for search
      if( searchText ) {
        newspaperItemsFilter = newspaperItemsTags.filter( (item) => filterSearch( item ));
      } else {
        newspaperItemsFilter = newspaperItemsTags;
      }

    } else if ( slug === "all" || !slug) {
      newspaperItems.forEach( (item,idx) => {
        item.style.display = "block";
      });
      
      // filter for search
      if( searchText ) {
        newspaperItemsFilter = Array.from(newspaperItems).filter( (item) => filterSearch( item ));
      } else {
        newspaperItemsFilter = Array.from(newspaperItems);
      }

    }



  }
  
  // run through the newspaper items and create new positions
  function render() {
    const total = newspaperItemsFilter.length;
    
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
      
      // if( offset === 1 ) {
      //   item.style.transform = `
      //     translate(100%, 0)
      //   `
      // } else if ( offset === -1 ) {
      //   item.style.transform = `
      //     translate(-100%, 0)
      //   ` 
      // }
      // calculate yPositon based on groups of 10, normalize
      // scale to amount 

    // move one row, one column
      
      // // width circle math, rotate around yAxis
      // const yAxisControl = ( (idx+loopY) % 10 ) / 10;
      // const sineY = Math.sin( (yAxisControl) * (Math.PI * 2) );
      // const cosY = Math.cos( (yAxisControl) * (Math.PI * 2 ) );
      // const normSineY = (sineY / 2) + 0.5;
      // const normCosY = (cosY / 2) + 0.5;
      
      // // get og yPos with divide and floor
      // let getYPos = Math.floor( idx / 10 ) * 10;
      
      // // // checkerboard Y mod
      // const offsetY = idx % 2;
      // const yPos = ( getYPos + offsetY ) % 10;
      
      // // calculate total height
      // const totalHeight = (total/100) * 500;
  
      // // x and y translate 
      // // translate pseudo Z axis, using scale
      // item.style.transform = `
      //   translate( 
      //     ${ (normSineY * 100) }%,
      //     ${ yPos * totalHeight }%
      //   )
      //   scale(${ handleScale( ( normCosY ) / 2) })
      // `;
      
      
    });
  
  }

  // first call for filter and render and to make the tag buttons match slug
  filter();
  render();
  tagOpacity();
  
  // (hoist) if size is small make 0, make the little ones in the back 'dissapear'
  function handleScale( amt ) {
    if( amt < 0.2 ) {
      return 0
    } else {
      return Math.pow(amt, 0.25);
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