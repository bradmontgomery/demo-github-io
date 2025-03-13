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
});
