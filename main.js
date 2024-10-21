import { getRandomInt } from "./helpers/random.js";

let loop = 0;
const container = document.querySelector(".newspaper-articles-container")
// // get all newspaper elements, position them across a large window

// get the newspaper collection items
const newspaperItems = document.querySelectorAll(".newspaper-article-item");
console.log("newspaperItems", newspaperItems);



const total = newspaperItems.length;
// run through the newspaper items and create new positions
function render() {
  newspaperItems.forEach( (item, idx) => {
    const sine = Math.sin(((idx / total) + loop) * (Math.PI * 2) );
    const cos = Math.cos(((idx / total) + loop) *  (Math.PI * 2 ) );
    const normSine = (sine / 2) + 0.5;
    const normCos = (cos / 2) + 0.5;
    
    // x translate absolute
    item.style.left = `${(normSine * 300) - 120}%`;
    item.style.top = `${normCos * 50}%`; 
    
    // translate Z axis 
    item.style.transform = `scale(${cos / 4 + 0.5})`;
  });

}
render();

window.addEventListener("click", (event) => {
  console.log("whaaat")
  loop += 0.1;
  render();
});