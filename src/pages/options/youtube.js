import youtubeHelper from "../../assets/javascripts/helpers/youtube.js";
import commonHelper from "../../assets/javascripts/helpers/common.js";
import shared from "./shared.js";

const invidiousInstances = youtubeHelper.redirects;

let invidiousInstanceElement = document.getElementById("invidious-instance");
let disableInvidiousElement = document.getElementById("disable-invidious");
let invidiousDarkModeElement = document.getElementById("invidious-dark-mode");
let persistInvidiousPrefsElement = document.getElementById("persist-invidious-prefs");
let invidiousVolumeElement = document.getElementById("invidious-volume");
let invidiousPlayerStyleElement = document.getElementById("invidious-player-style");
let invidiousSubtitlesElement = document.getElementById("invidious-subtitles");
let invidiousAutoplayElement = document.getElementById("invidious-autoplay");
let invidiousRandomPoolElement = document.getElementById("invidious-random-pool");
let invidiousRandomPoolListElement = document.getElementById('invidious-random-pool-list');
let useFreeTubeElement = document.getElementById("use-freetube");
let invidiousAlwaysProxyElement = document.getElementById("always-proxy");
let invidiousOnlyEmbeddedVideoElement = document.getElementById("only-embed");
let invidiousVideoQualityElement = document.getElementById("video-quality");

let invidiousRandomPool;

browser.storage.sync.get(
    [
        "invidiousInstance",
        "disableInvidious",
        "invidiousDarkMode",
        "persistInvidiousPrefs",
        "invidiousVolume",
        "invidiousPlayerStyle",
        "invidiousSubtitles",
        "invidiousAutoplay",
        "invidiousRandomPool",
        "useFreeTube",
        "invidiousAlwaysProxy",
        "invidiousOnlyEmbeddedVideo",
        "invidiousVideoQuality",
    ],
    (result) => {
        invidiousInstanceElement.value = result.invidiousInstance || "";
        disableInvidiousElement.checked = !result.disableInvidious;
        invidiousDarkModeElement.checked = result.invidiousDarkMode;
        persistInvidiousPrefsElement.checked = result.persistInvidiousPrefs;
        invidiousVolumeElement.value = result.invidiousVolume;
        document.querySelector("#volume-value").textContent = result.invidiousVolume ? `${result.invidiousVolume}%` : " - ";
        invidiousPlayerStyleElement.value = result.invidiousPlayerStyle || "";
        invidiousSubtitlesElement.value = result.invidiousSubtitles || "";
        useFreeTubeElement.checked = result.useFreeTube;
        invidiousOnlyEmbeddedVideoElement.checked = result.invidiousOnlyEmbeddedVideo;
        invidiousAlwaysProxyElement.checked = result.invidiousAlwaysProxy;
        invidiousVideoQualityElement.value = result.invidiousVideoQuality || "";
        invidiousAutoplayElement.checked = result.invidiousAutoplay;

        invidiousRandomPool = result.invidiousRandomPool || commonHelper.filterInstances(invidiousInstances)
        invidiousRandomPoolElement.value = invidiousRandomPool.join("\n");
        commonHelper.updateListElement(invidiousRandomPoolListElement, invidiousRandomPool);

        let id = "invidious-instance"
        let instances = invidiousRandomPool;
        shared.autocompletes.push({ id: id, instances: instances });
        shared.autocomplete(document.getElementById(id), instances);
    }
)

invidiousInstanceElement.addEventListener("input",
    commonHelper.debounce(() => {
        if (invidiousInstanceElement.checkValidity())
            browser.storage.sync.set({ invidiousInstance: shared.parseURL(invidiousInstanceElement.value) });
    }, 500)
);

disableInvidiousElement.addEventListener("change", (event) => {
    browser.storage.sync.set({ disableInvidious: !event.target.checked });
});

invidiousDarkModeElement.addEventListener("change", (event) => {
    console.info("InvidiousDarkMode", event.target.checked);
    browser.storage.sync.set({ invidiousDarkMode: event.target.checked });
});

persistInvidiousPrefsElement.addEventListener("change", (event) => {
    console.info("Persist preferences (as cookie)", event.target.checked);
    browser.storage.sync.set({ persistInvidiousPrefs: event.target.checked });
});

invidiousVolumeElement.addEventListener("input",
    commonHelper.debounce(() => {
        document.querySelector("#volume-value").textContent = `${invidiousVolumeElement.value}%`;
        browser.storage.sync.set({ invidiousVolume: invidiousVolumeElement.value });
    }, 1)
);

invidiousPlayerStyleElement.addEventListener("change", (event) => {
    browser.storage.sync.set({
        invidiousPlayerStyle: event.target.options[invidiousPlayerStyleElement.selectedIndex].value,
    });
});

invidiousSubtitlesElement.addEventListener("input",
    commonHelper.debounce(() => {
        browser.storage.sync.set({ invidiousSubtitles: invidiousSubtitlesElement.value });
    }, 500)
);

invidiousAutoplayElement.addEventListener("change", (event) => {
    browser.storage.sync.set({ invidiousAutoplay: event.target.checked });
});

invidiousRandomPoolElement.addEventListener("input", commonHelper.debounce(() => {
    invidiousRandomPool = commonHelper.filterList(invidiousRandomPoolElement.value.split("\n"))
    commonHelper.updateListElement(invidiousRandomPoolListElement, invidiousRandomPool);
    browser.storage.sync.set({ invidiousRandomPool: invidiousRandomPool });
}, 50)
);

useFreeTubeElement.addEventListener("change", (event) => {
    browser.storage.sync.set({ useFreeTube: event.target.checked });
});

invidiousAlwaysProxyElement.addEventListener("change", (event) => {
    browser.storage.sync.set({ invidiousAlwaysProxy: event.target.checked });
});

invidiousOnlyEmbeddedVideoElement.addEventListener("change", (event) => {
    browser.storage.sync.set({ invidiousOnlyEmbeddedVideo: event.target.checked });
});

invidiousVideoQualityElement.addEventListener("change", (event) => {
    browser.storage.sync.set({ invidiousVideoQuality: event.target.options[invidiousVideoQualityElement.selectedIndex].value });
});

browser.storage.onChanged.addListener((changes) => {
    if ("invidiousRandomPool" in changes) {
        invidiousRandomPool = changes.invidiousRandomPool.newValue;
        invidiousRandomPoolElement.value = invidiousRandomPool.join("\n");
        commonHelper.updateListElement(invidiousRandomPoolListElement, invidiousRandomPool);
    }
})