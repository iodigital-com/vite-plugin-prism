/// <reference types="vite/client" />

fetch(window.location.origin + "/api-one/full/path/to/rewrite")
  .then((res) => res.json())
  .then((json) => {
    const $list = document.getElementById("list");
    if ($list) {
      $list.textContent = JSON.stringify(json, null, 2);
    }
  });
