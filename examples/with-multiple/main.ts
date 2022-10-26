/// <reference types="vite/client" />

fetch(window.location.origin + "/api/pets")
  .then((res) => res.json())
  .then((json) => {
    const $list = document.getElementById("list");
    if ($list) {
      $list.textContent = JSON.stringify(json, null, 2);
    }
  });

fetch(window.location.origin + "/api/pets/123")
  .then((res) => res.json())
  .then((json) => {
    const $single = document.getElementById("single");
    if ($single) {
      $single.textContent = JSON.stringify(json, null, 2);
    }
  });
