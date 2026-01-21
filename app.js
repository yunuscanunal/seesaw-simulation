const STORAGE_KEY = "seesaw_state_v1";
const plankWidth = 600;
const plankCenter = plankWidth / 2;
const tiltLimit = 30;

const plank = document.getElementById("plank");
const pivot = document.querySelector(".pivot");
const leftWeight = document.getElementById("leftWeight");
const leftTorque = document.getElementById("leftTorque");
const rightWeight = document.getElementById("rightWeight");
const rightTorque = document.getElementById("rightTorque");

const tiltAngle = document.getElementById("seesawAngle");
const activityLogList = document.getElementById("activityLogList");
const objectCount = document.getElementById("objectCount");

let objects = [];
let currentAngle = 0;
let nextWeightValue = getRandomWeightedObject();
let previewElement = null;

function getRandomWeightedObject() {
  return Math.floor(Math.random() * 10) + 1;
}

function getObjectColor(weight) {
  // Smooth color transition from green (1) to red (10) using HSL
  // Hue: 120 (green) -> 60 (yellow) -> 30 (orange) -> 0 (red)
  const minWeight = 1;
  const maxWeight = 10;
  const t = (weight - minWeight) / (maxWeight - minWeight); // 0 to 1

  // Interpolate hue from 120 (green) to 0 (red)
  const hue = 120 * (1 - t);
  const saturation = 70 + t * 15; // 70% to 85%
  const lightness = 50 - t * 5; // 50% to 45% (slightly darker for red)

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function addActivityLog(message) {
  const li = document.createElement("li");
  const timestamp = new Date().toLocaleTimeString();
  li.textContent = `[${timestamp}] ${message}`;
  activityLogList.insertBefore(li, activityLogList.firstChild);
}

function clearActivityLog() {
  activityLogList.innerHTML = "";
}

function updateObjectCount() {
  objectCount.textContent = objects.length;
}

function loadState() {
  const savedState = localStorage.getItem(STORAGE_KEY);
  if (savedState) {
    try {
      const state = JSON.parse(savedState);
      objects = state.objects || [];
      renderObjects();
      updateSeesaw();
      updateObjectCount();
      if (objects.length > 0) {
        addActivityLog(`Loaded ${objects.length} object(s) from saved state`);
      }
    } catch (e) {
      console.error("Failed to load state:", e);
    }
  }
}

function saveState() {
  const state = {
    objects: objects,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

plank.addEventListener("click", (event) => {
  const rect = plank.getBoundingClientRect();

  // Get click position relative to the center of the bounding box
  const rectCenterX = rect.left + rect.width / 2;
  const rectCenterY = rect.top + rect.height / 2;
  const clickXFromCenter = event.clientX - rectCenterX;
  const clickYFromCenter = event.clientY - rectCenterY;

  // Apply inverse rotation to get position along the plank axis
  const angleRad = -currentAngle * (Math.PI / 180);
  const plankX =
    clickXFromCenter * Math.cos(angleRad) -
    clickYFromCenter * Math.sin(angleRad);

  // Clamp to plank bounds
  const position = Math.max(-plankCenter, Math.min(plankCenter, plankX));
  const weight = nextWeightValue;
  const object = {
    weight: weight,
    position: position,
    color: getObjectColor(weight),
  };
  objects.push(object);
  createObject(object, true);
  updateSeesaw();
  updateObjectCount();
  saveState();

  const side = position < 0 ? "left" : "right";
  const distance = Math.abs(Math.round(position));
  addActivityLog(
    `Dropped ${weight}kg object on ${side} side (${distance}px from center)`,
  );

  nextWeightValue = getRandomWeightedObject();
  updatePreviewColor();
});

function createObject(object, withDropAnimation = false) {
  const objectElement = document.createElement("div");
  objectElement.className = "object" + (withDropAnimation ? " dropping" : "");
  objectElement.style.left = plankCenter + object.position + "px";
  objectElement.style.backgroundColor = getObjectColor(object.weight);
  objectElement.textContent = object.weight;
  plank.appendChild(objectElement);
}

function renderObjects() {
  const existing = plank.querySelectorAll(".object");
  existing.forEach((element) => element.remove());

  objects.forEach((object) => {
    createObject(object, false);
  });
}

function calculationTorque() {
  let leftTotalTorque = 0;
  let rightTotalTorque = 0;
  let leftTotalWeight = 0;
  let rightTotalWeight = 0;
  objects.forEach((object) => {
    // Use absolute value for torque magnitude (torque = weight × distance from pivot)
    const torque = object.weight * Math.abs(object.position);
    if (object.position < 0) {
      leftTotalTorque += torque;
      leftTotalWeight += object.weight;
    } else {
      rightTotalTorque += torque;
      rightTotalWeight += object.weight;
    }
  });
  leftWeight.textContent = `${leftTotalWeight} kg`;
  leftTorque.textContent = `${leftTotalTorque.toFixed(1)} Nm`;
  rightWeight.textContent = `${rightTotalWeight} kg`;
  rightTorque.textContent = `${rightTotalTorque.toFixed(1)} Nm`;

  return {
    leftTotalTorque,
    rightTotalTorque,
    leftTotalWeight,
    rightTotalWeight,
  };
}

function updateSeesaw() {
  const {
    leftTotalTorque,
    rightTotalTorque,
    leftTotalWeight,
    rightTotalWeight,
  } = calculationTorque();

  const netTorque = rightTotalTorque - leftTotalTorque;
  const targetAngle = Math.max(
    -tiltLimit,
    Math.min(tiltLimit, netTorque / 100),
  );

  currentAngle = targetAngle;
  plank.style.transform = `translateX(-50%) rotate(${currentAngle}deg)`;

  leftWeight.textContent = `${leftTotalWeight} kg`;
  rightWeight.textContent = `${rightTotalWeight} kg`;
  tiltAngle.textContent = `${(-currentAngle).toFixed(1)}°`;
}

function resetSeesaw() {
  const objectCountBefore = objects.length;
  objects = [];
  currentAngle = 0;
  renderObjects();
  updateSeesaw();
  updateObjectCount();
  saveState();

  if (objectCountBefore > 0) {
    addActivityLog(`Reset seesaw - removed ${objectCountBefore} object(s)`);
  }
}

function clearActivityLog() {
  activityLogList.innerHTML = "";
}

// Preview element functions
function createPreviewElement() {
  previewElement = document.createElement("div");
  previewElement.className = "object preview";
  previewElement.style.backgroundColor = getObjectColor(nextWeightValue);
  previewElement.textContent = nextWeightValue;
  previewElement.style.display = "none";
  plank.appendChild(previewElement);
}

function updatePreviewColor() {
  if (previewElement) {
    previewElement.style.backgroundColor = getObjectColor(nextWeightValue);
    previewElement.textContent = nextWeightValue;
  }
}

function getPlankPosition(event) {
  const rect = plank.getBoundingClientRect();
  const rectCenterX = rect.left + rect.width / 2;
  const rectCenterY = rect.top + rect.height / 2;
  const mouseXFromCenter = event.clientX - rectCenterX;
  const mouseYFromCenter = event.clientY - rectCenterY;

  // Apply inverse rotation to get position along the plank axis
  const angleRad = -currentAngle * (Math.PI / 180);
  const plankX =
    mouseXFromCenter * Math.cos(angleRad) -
    mouseYFromCenter * Math.sin(angleRad);

  // Clamp to plank bounds
  return Math.max(-plankCenter, Math.min(plankCenter, plankX));
}

// Mouse event handlers for preview
plank.addEventListener("mousemove", (event) => {
  if (!previewElement) return;

  const position = getPlankPosition(event);
  previewElement.style.left = plankCenter + position + "px";
  previewElement.style.display = "flex";
});

plank.addEventListener("mouseleave", () => {
  if (previewElement) {
    previewElement.style.display = "none";
  }
});

clearActivityLog();
addActivityLog("Simulation started");

loadState();
createPreviewElement();
