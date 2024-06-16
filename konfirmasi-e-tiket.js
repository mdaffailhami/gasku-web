const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

let userId = params['user-id'];

fetch(
  'https://gasku-kmipn-default-rtdb.asia-southeast1.firebasedatabase.app/tes.json'
)
  .then((x) => x.text())
  .then((x) => {
    const data = JSON.parse(x);
    console.log(data);
    console.log(data['-O-UmdcgnBG5bDgdTpWz']);
    console.log(data['-O-UmdcgnBG5bDgdTpWz']['uwu']);
  })
  .catch((reason) => console.log(reason));
