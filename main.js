// import { convertMojesToCSV } from "./helpers/convert-cms.js";

let start = false;
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
    // console.log("thes ", text.value)
    searchText = text.value.toLowerCase();
    
    filter();
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });

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
  
  // get the newspaper collection items
  const newspaperItems = document.querySelectorAll(".newspaper-article-item");

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

    newspaperItemsFilter.forEach( (item, idx) => {
      console.log("newspaper item: ", item);
      // make visible
      if(!start) {
        item.style.opacity = 1;
      }
      // make visible
      item.style.display = "block";
      
      // get np-item-container
      const np = document.querySelector('.np-item-container');
      
      // apply parallax effect
      np.classList.add('parallax__layer');
      if( (idx % 2) === 0 ) {
        item.classList.add('parallax__layer--base');
      } else {
        item.classList.add('parallax__layer--back');
      }
      
      // get where the text is rendered
      const englishHeadline = item.querySelector('.newspaper-headline');
      const marathiHeadline = item.querySelector('.newspaper-headline.marathi');

      
      if(langSwap === "english") {
        englishHeadline.style.display = 'block';
        marathiHeadline.style.display = 'none';
      } else {
        englishHeadline.style.display = 'none';
        marathiHeadline.style.display = 'block';
      }
      
    });
  
  }

  // first call for filter and render and to make the tag buttons match slug
  filter();
  render();
  tagOpacity();
  
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