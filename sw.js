
let i = 0;

self.addEventListener('sync', event => {
  console.log("sync_"+i);
  i++;
});

addEventListener("periodicsync", (event) => {
  console.log("sync_"+i);
  i++;
});
