const input = document.getElementById("input");
const preview = document.querySelector("pre code");
const previewContainer = document.querySelector("pre");
const saveBtn = document.getElementById("saveBtn");
const newBtn = document.getElementById("newBtn");
const copyBtn = document.getElementById("copyBtn");

function renderPreview(value) {
  const safeValue = value ?? "";
  if (!safeValue) {
    preview.textContent = "";
    return;
  }

  preview.innerHTML = hljs.highlightAuto(safeValue).value;
}

input.addEventListener("input", (e) => {
  renderPreview(e.target.value);
});

input.addEventListener("scroll", () => {
  previewContainer.scrollTop = input.scrollTop;
  previewContainer.scrollLeft = input.scrollLeft;
});

renderPreview(input.value);

function saveFile() {
  const content = input.value;

  const url = window.location.href.split("/").slice(0, -1).join("/") + "/save";

  const request = new XMLHttpRequest();
  request.open("POST", url);
  request.setRequestHeader("Content-Type", "application/json");
  request.send(JSON.stringify({ content }));

  request.onload = function () {
    if (request.status === 200) {
      const origin = window.location.origin;
      window.location.href =
        origin + "/" + JSON.parse(request.responseText).key;
    } else {
    }
  };
}

saveBtn.addEventListener("click", saveFile);
newBtn.addEventListener("click", () => {
  clearCookie();
  window.location.href = window.location.origin + "";
});

copyBtn.addEventListener("click", () => {
  document.cookie = `content=${encodeURIComponent(input.value)}; path=/; max-age=60`;
  window.location.href = window.location.origin;
});

document.addEventListener("DOMContentLoaded", () => {
  const contentFromCookie = getCookie("content");
  console.log("Content from cookie:", contentFromCookie);
  if (contentFromCookie) {
    input.value = decodeURIComponent(contentFromCookie);
    renderPreview(decodeURIComponent(contentFromCookie));
    clearCookie(); // Clear the cookie after use
  }
});

function clearCookie() {
  document.cookie = "content=; path=/; max-age=0";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
