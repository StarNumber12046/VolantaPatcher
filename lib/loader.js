function log(message) {
  console.log(`%c[Patch]%c ${message}`, "color: blue; font-weight: bold", "");
}

function waitForElm(selector) {
  log(`Waiting for ${selector}`);
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver((_) => {
      const sel = document.querySelector(selector);
      log(sel);
      if (sel) {
        log(`Found ${selector}`);
        resolve(document.querySelector(selector));
      }
    });

    // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

const deleteElementPatch = (sel, continuous = false) => {
  log(`Deleting ${sel}`);
  if (continuous && sel.includes("nth-child")) {
    log("Warning: continuous delete may cause issues with nth-child selectors");
  }
  waitForElm(sel)
    .then((elm) => {
      elm.remove();
      log(`Deleted ${sel}`);
      if (continuous) deleteElementPatch(sel, true);
    })
    .catch((e) => log(`Error deleting ${sel}: ${e}`));
};

const editContentPatch = (sel, callback, continuous = false) => {
  log(`Editing ${sel}`);
  if (continuous && sel.includes("nth-child")) {
    log("Warning: continuous edit may cause issues with nth-child selectors");
  }
  waitForElm(sel)
    .then((elm) => {
      elm.innerHTML = callback(elm.innerHTML);
      log(`Edited ${sel}`);
      if (continuous) editContentPatch(sel, content, true);
    })
    .catch((e) => log(`Error editing ${sel}: ${e}`));
};

const patches = [
  {
    name: "Minimal Sidebar",
    exec: () => {
      deleteElementPatch("a[href='#/schedules']");
      deleteElementPatch("a[href='#/events']");
      deleteElementPatch("a[href='#/activities']");
      deleteElementPatch("a[href='#/teams']");
      deleteElementPatch("app-orbs-balance");
    },
    on: "DOMContentLoaded",
  },
  {
    name: "Minimal Right panel",
    exec: () => {
      deleteElementPatch(".map-filter-container > div:nth-child(2)");
      deleteElementPatch(".map-filter-container > div > div:nth-child(3)");
    },
    on: "DOMContentLoaded",
  },
  {
    name: "Remove Browser",
    exec: () => deleteElementPatch(".browser-panel-button"),
    on: "DOMContentLoaded",
  },
  {
    name: "Remove Premium spam",
    exec: () => {
      deleteElementPatch("img[alt='Customize profile']", true);
      deleteElementPatch(".party-card-container", true);
    },
    on: "DOMContentLoaded",
  },
  {
    name: "Remove Mapbox logo",
    exec: () => {
      deleteElementPatch(".mapboxgl-ctrl-logo");
      deleteElementPatch(".mapboxgl-ctrl-bottom-right");
    },
    on: "DOMContentLoaded",
  },
  {
    name: "Add patch info",
    exec: () => {
      editContentPatch(
        ".settings-info",
        (content) =>
          `${content}<div class="settings-info-item">Using StarNumber's <a href="https://github.com/StarNumber12046/VolantaPatcher" target="_blank">VolantaPatcher</a></div>`,
        true
      );
    },
    on: "DOMContentLoaded",
  },
];

patches.forEach((patch) => {
  log(`Loading patch: ${patch.name}`);
  document.addEventListener(patch.on, () => {
    log(`Patching ${patch.name} (${patch.on})`);
    patch.exec();
  });
});
