const input = document.getElementById("input");
const preview = document.querySelector("pre code");
const previewContainer = document.querySelector("pre");
const saveBtn = document.getElementById("saveBtn");
const newBtn = document.getElementById("newBtn");
const copyBtn = document.getElementById("copyBtn");
const qrcodeBtn = document.getElementById("qrcodeBtn")

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
document.addEventListener("keydown", (event) => {
  if (event.ctrlKey || event.metaKey) {
    if (event.key === "s" || event.key === "S") {
      event.preventDefault();
      saveFile();
    } else if (event.key === "n" || event.key === "N") {
      event.preventDefault();
      clearCookie();
      window.location.href = window.location.origin + "";
    } else if (event.key === "d" || event.key === "D") {
      event.preventDefault();
      duplicatePage();
    }
  }
});

qrcodeBtn.addEventListener("click", () => generateQRCode())
copyBtn.addEventListener("click", () => duplicatePage());
saveBtn.addEventListener("click", saveFile);
newBtn.addEventListener("click", () => {
  clearCookie();
  window.location.href = window.location.origin + "";
});

// Check for cookie on page load and populate input if it exists
document.addEventListener("DOMContentLoaded", () => {
  const contentFromSession = window.sessionStorage.getItem("content");
  if (contentFromSession) {
    input.value = contentFromSession;
    renderPreview(contentFromSession);
    window.sessionStorage.removeItem("content");
  }
  renderPreview(input.value);
});

const duplicatePage = () => {
  window.sessionStorage.setItem("content", input.value);
  window.location.href = window.location.origin;
};

const generateQRCode = () => {
  const qrcode = document.getElementById("qrcode")

  if(qrcode.style.display == "none") {
    qrcode.innerHTML = ""
      new QRCode(qrcode, {
        text: window.location.href,
        width: 200,
        height: 200
    });
    qrcode.style.display = "block"
  } else {
    qrcode.style.display = "none"
  }
   
  
}

function clearCookie() {
  document.cookie = "content=; path=/; max-age=0";
  navigator.clipboard.writeText(""); // Clear the clipboard
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
