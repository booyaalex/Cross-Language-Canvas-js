const board = document.getElementById("my-canvas");
const ctx = board.getContext("2d");
board.width = board.offsetWidth;
board.height = board.offsetHeight;

const firebase_config = {
  apiKey: "AIzaSyDBE5zSHB51WMZElxUI7i6glQOdeU2T-DU",
  authDomain: "cross-language-canvas.firebaseapp.com",
  databaseURL: "https://cross-language-canvas-default-rtdb.firebaseio.com",
  projectId: "cross-language-canvas",
  storageBucket: "cross-language-canvas.firebasestorage.app",
  messagingSenderId: "570143928667",
  appId: "1:570143928667:web:a05c9141f0757591e62a7e"
};
firebase.initializeApp(firebase_config);
const db = firebase.database();

let current_shape = {
  color: "Black",
  type: "line",
  x1: 0,
  y1: 0,
  x2: 50,
  y2: 50,
  x3: 0,
  y3: 0
};
let current_step = 0;

//Display Drawing
const drawing = {
  addLine: function addLine(line) {
    ctx.strokeStyle = line.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(line.x1, line.y1);
    ctx.lineTo(line.x2, line.y2);
    ctx.stroke();
    ctx.closePath();
  },
  addRect: (rect) => {
    const width = Math.max(rect.x1, rect.x2) - Math.min(rect.x1, rect.x2);
    const height = Math.max(rect.y1, rect.y2) - Math.min(rect.y1, rect.y2);

    ctx.fillStyle = rect.color;
    ctx.beginPath();
    ctx.fillRect(Math.min(rect.x1, rect.x2), Math.min(rect.y1, rect.y2), width, height);
    ctx.fill();
    ctx.closePath();
  },
  addTrigon: (trigon) => {
    ctx.fillStyle = trigon.color;
    ctx.beginPath();
    ctx.moveTo(trigon.x1, trigon.y1);
    ctx.lineTo(trigon.x2, trigon.y2);
    ctx.lineTo(trigon.x3, trigon.y3);
    ctx.fill();
    ctx.closePath();
  },
  addCirc: (circ) => {
    const width = (Math.max(circ.x1, circ.x2) - Math.min(circ.x1, circ.x2)) / 2;
    const height = (Math.max(circ.y1, circ.y2) - Math.min(circ.y1, circ.y2)) / 2;

    ctx.fillStyle = circ.color;
    ctx.beginPath();
    ctx.ellipse(Math.min(circ.x1, circ.x2) + width, Math.min(circ.y1, circ.y2) + height, width, height, Math.PI, 0, 2 * Math.PI);
    ctx.fill();
  }
};

//Canvas Drawing
function canvasClick() {
  current_step++;
  const dimensions = board.getBoundingClientRect();

  //Set Points
  if (current_step == 1) {
    current_shape.x1 = event.clientX - dimensions.left;
    current_shape.y1 = event.clientY - dimensions.top;
  }
  if (current_step == 2) {
    current_shape.x2 = event.clientX - dimensions.left;
    current_shape.y2 = event.clientY - dimensions.top;
  }
  if (current_step == 3) {
    current_shape.x3 = event.clientX - dimensions.left;
    current_shape.y3 = event.clientY - dimensions.top;
  }

  //Check if Shape is Complete
  if (current_shape.type == "trigon") {
    if (current_step > 2) {
      makeShape();
    }
  } else {
    if (current_step > 1) {
      makeShape();
    }
  }

  function makeShape() {
    current_step = 0;
    db.ref("Room 1/Last Command").update(current_shape);
    current_shape = {
      color: current_shape.color,
      type: current_shape.type,
      x1: 0,
      y1: 0,
      x2: 50,
      y2: 50,
      x3: 0,
      y3: 0
    };
  }
}

db.ref("Room 1/Last Command").on("value", (snapshot) => {
  if (snapshot.val().type == "line") {
    drawing.addLine(snapshot.val());
  }
  if (snapshot.val().type == "rect") {
    drawing.addRect(snapshot.val());
  }
  if (snapshot.val().type == "trigon") {
    drawing.addTrigon(snapshot.val());
  }
  if (snapshot.val().type == "circ") {
    drawing.addCirc(snapshot.val());
  }
});

function shapeSelect(type, display) {
  current_shape.type = type;
  document.getElementById("selected-shape").innerHTML = `Selected Shape: ${display}`;
}
function colorSelect(color, display) {
  current_shape.color = color;
  document.getElementById("selected-color").innerHTML = `Selected Color: ${display}`;
}