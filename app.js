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
const nextWeight = document.getElementById("nextWeight");
const tiltAngle = document.getElementById("seesawAngle");
const activityLogList = document.getElementById("activityLogList");
const objectCount = document.getElementById("objectCount");

let objects = [];
let currentAngle = 0;
let nextWeightValue = getRandomWeightedObject();

function getRandomWeightedObject() {
  return Math.floor(Math.random() * 10) + 1;
}

function getObjectColor(weight) {
  if (weight <= 3) return "#4caf50";
  if (weight <= 6) return "#ff9800";
  return "#e53935";
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
  // Update next weight display on load
  nextWeight.textContent = `${nextWeightValue} kg`;
}

function saveState() {
  const state = {
    objects: objects,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

plank.addEventListener("click", (event) => {
  const rect = plank.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  // Position relative to center: negative = left, positive = right
  const position = clickX - plankCenter;
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

  // Log the activity
  const side = position < 0 ? "left" : "right";
  const distance = Math.abs(Math.round(position));
  addActivityLog(
    `Dropped ${weight}kg object on ${side} side (${distance}px from center)`,
  );

  // Generate next weight for the following drop
  nextWeightValue = getRandomWeightedObject();
  nextWeight.textContent = `${nextWeightValue} kg`;
});

function createObject(object, withDropAnimation = false) {
  const objectElement = document.createElement("div");
  objectElement.className = "object" + (withDropAnimation ? " dropping" : "");
  // Position is relative to center, so we need to add plankCenter to get absolute position on plank
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
    if (object.position < 0) {
      // Left side: position is negative, torque = weight * |position|
      leftTotalTorque += object.weight * Math.abs(object.position);
      leftTotalWeight += object.weight;
    } else {
      // Right side: position is positive, torque = weight * position
      rightTotalTorque += object.weight * object.position;
      rightTotalWeight += object.weight;
    }
  });

  // Display values (torque shown as absolute positive values, formatted)
  leftWeight.textContent = `${leftTotalWeight} kg`;
  leftTorque.textContent = `${leftTotalTorque.toFixed(1)} Nm`;
  rightWeight.textContent = `${rightTotalWeight} kg`;
  rightTorque.textContent = `${rightTotalTorque.toFixed(1)} Nm`;
  tiltAngle.textContent = `${currentAngle.toFixed(1)}°`;

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

  // Calculate angle: positive angle = tilting right (right side heavier)
  // Net torque = right - left (both are positive values now)
  const netTorque = rightTotalTorque - leftTotalTorque;
  const targetAngle = Math.max(
    -tiltLimit,
    Math.min(tiltLimit, netTorque / 100),
  );

  currentAngle = targetAngle;
  plank.style.transform = `translateX(-50%) rotate(${currentAngle}deg)`;

  // Update displays
  leftWeight.textContent = `${leftTotalWeight} kg`;
  rightWeight.textContent = `${rightTotalWeight} kg`;
  tiltAngle.textContent = `${currentAngle.toFixed(1)}°`;
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

// Clear placeholder log entries on page load
clearActivityLog();
addActivityLog("Simulation started");

loadState();
