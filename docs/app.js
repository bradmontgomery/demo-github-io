document.addEventListener("DOMContentLoaded", (event) => {
  // Old-style Cookies
  const now = new Date();
  document.cookie = `now=${now}; SameSite=None; Secure`;
  document.cookie = "course=WebProgramming2025; SameSite=None; Secure";
  document.getElementById("old-cookies").innerText = document.cookie;

  // Look-style cookies / CookieStore
  const cookieStore = window.cookieStore;
  cookieStore.set({ name: "username", value: "bradmontgomery" }).then(
    () => {
      console.log("Cookie set using cookieStore");
    },
    (reason) => {
      console.error("Unable to set cookie: " + reason);
    }
  );
  cookieStore.get("username").then(
    (obj) => {
      const elt = document.getElementById("new-cookies");
      elt.innerText = `${obj.name}=${obj.value}`;
    },
    (reason) => {
      console.error("Unable to read cookie: " + reason);
    }
  );

  // Do the Geolocation stuff
  let map = null;
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const markerLocation = [position.coords.latitude, position.coords.longitude];
      map = L.map("map").setView(markerLocation, 8);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
      L.marker(markerLocation).addTo(map);
    },
    (error) => {
      map = null;
      document.getElementById("map").innerText = "Unable to load map.";
      console.error("Unable to get user positon: " + error);
    }
  );

  // Popover
  const popoverElement = document.getElementById("js-popover");
  document.addEventListener("keydown", (event) => {
    if (event.key === "?") {
      popoverElement.showPopover();
      setTimeout(() => {
        popoverElement.hidePopover();
      }, 2000);
    }
  });

  // Battery API
  navigator.getBattery().then((battery) => {
    console.log("Battery Data: ", battery);

    const isCharging = document.getElementById("batteryCharging");
    isCharging.innerText = battery.charging ? "Yes" : "No";
    isCharging.classList.add(battery.charging ? "is-success" : "is-danger");

    const batteryLevel = document.getElementById("batteryLevel");
    batteryLevel.innerText = Math.round(battery.level * 100) + "%";

    if (battery.level > 0.5) {
      batteryLevel.classList.add("is-success");
    } else if (battery.level > 0.25) {
      batteryLevel.classList.add("is-warning");
    } else {
      batteryLevel.classList.add("is-danger");
    }

    try {
      const minutesLeft = Math.round(battery.dischargingTime / 60);
      document.getElementById("batteryRemaining").innerText = `${minutesLeft} minutes`;
    } catch (e) {
      console.error("Unable to calculate battery time left: ", e);
    }
  });

  // Simple Canvas Example.
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "blue";
  ctx.fillRect(40, 10, 100, 100);

  ctx.fillStyle = "rgb(200 0 0 / 50%)";
  ctx.fillRect(30, 30, 50, 50);

  ctx.strokeStyle = "yellow";
  ctx.beginPath();
  ctx.arc(75, 75, 50, 0, Math.PI * 2, true); // Outer circle
  ctx.moveTo(110, 75);
  ctx.arc(75, 75, 35, 0, Math.PI, false); // Mouth (clockwise)
  ctx.moveTo(65, 65);
  ctx.arc(60, 65, 5, 0, Math.PI * 2, true); // Left eye
  ctx.moveTo(95, 65);
  ctx.arc(90, 65, 5, 0, Math.PI * 2, true); // Right eye
  ctx.stroke();
});
