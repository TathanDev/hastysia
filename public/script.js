console.log("dgdgdgd");

const controller = {
    "Control": {
        pressed: false
    },
    "s": {
        pressed: false
    },
}

document.addEventListener("keydown", (e) => {


  if(controller[e.key]){
    controller[e.key].pressed = true
  }

    console.log(controller)


  if(controller.Control.pressed && controller.s.pressed){
    saveFile();
  }
})


document.addEventListener("keyup", (e) => {
  if(controller[e.key]){
    controller[e.key].pressed = false
  }
})


function saveFile() {
  const content = document.getElementById("input").value;
  
}