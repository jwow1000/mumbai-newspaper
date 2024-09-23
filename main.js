

// grab element
const canvas = document.getElementById( 'canvas-newspaper' );
console.log(canvas)

// try to get pad.ma data
async function api(action, data) {
  const url = "https://pad.ma/api/"
  var response = await fetch(url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          action: action,
          data: data
      })
  })
  return await response.json();
}

api( 'getGroup', {
  id: 'Mojes'
})
.then ( result => {
  console.log("resultz", result);
})