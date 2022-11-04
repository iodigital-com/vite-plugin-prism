/// <reference types="vite/client" />

fetch(window.location.origin + "/api/pets")
  .then((res) => res.json())
  .then((json) => {
    const $app = document.getElementById("app");
    if ($app) {
      $app.textContent = JSON.stringify(json, null, 2);
    }
  });


fetch(window.location.origin + "/api/pets/123")
  .then((res) => res.json())
  .then((json) => {
    const $app = document.getElementById("app2");
    if ($app) {
      $app.textContent = JSON.stringify(json, null, 2);
    }
  });
