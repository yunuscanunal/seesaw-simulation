[🇹🇷 Türkçe README (Turkish Version)](README.tr.md)

# Seesaw Simulation

**Seesaw Simulation** is an interactive, web-based physics simulation based on torque balance. It allows users to observe real-time equilibrium changes by adding objects with varying weights to a seesaw.

🔗 **Live Demo:** <a href="http://seesaw.yunuscanunal.me" target="_blank">seesaw.yunuscanunal.me</a>

## 🚀 Features

* **Real-Time Physics:** Calculates the total torque (Weight x Distance) for both left and right sides and updates the seesaw angle accordingly.
* **Interactive Controls:**
    * Click anywhere on the plank to drop objects with random weights (1-10kg).
    * "Ghost" preview feature showing where the object will land while hovering with the mouse.
* **Visual Feedback:** Objects change color dynamically based on their weight, transitioning from green (light) to red (heavy) using HSL.
* **Data Persistence:** The scene state is preserved using `localStorage`, so your setup remains even after refreshing the page.
* **Activity Log:** Every action (dropping an object, resetting) is recorded with a timestamp.
* **Detailed Statistics Panel:**
    * Left/Right Side Weight (kg) and Torque (Nm)
    * Total Object Count
    * Current Tilt Angle
      
## 🤖 AI Assistance

* **Feature Implementation (Claude AI):** Major interactive features were implemented with the assistance of Claude AI. This includes the **dynamic preview element** that follows the mouse cursor and the logic for the **"Clear Activity Log"** functionality.
* **Core Logic Refinement (Claude AI):** Claude AI played a key role in debugging and refining the physics interactions, specifically:
    * Improving the click coordinate calculation for accurate object placement on the tilted plank.
    * Fixing the visual display of the tilt angle.
    * Refactoring the UI by removing redundant elements (e.g., static "next weight" display) in favor of a cleaner UX.
* **Documentation:** The structure and content of this README file were generated and refined with the assistance of AI tools to ensure clarity and comprehensive coverage of the project details.

## 🛠️ Technologies

The project is built using pure (vanilla) web technologies without any external libraries or frameworks:

* **HTML5:** Semantic structure.
* **CSS3:** Flexbox, CSS Grid, `transform` rotations, and visual effects.
* **JavaScript (ES6+):** Physics engine, DOM manipulation, and state management.

## 🧮 How It Works (Physics Logic)

The simulation relies on the **Torque** principle:

$$\tau = F \times d$$

* **$\tau$ (Torque):** The rotational force.
* **$F$ (Force):** The weight of the object (kg).
* **$d$ (Distance):** The distance of the object from the pivot point (px).

The system calculates the total torque for the left and right sides whenever an object is added. The seesaw's angle (`rotate`) is updated based on the net torque difference. The angle is clamped to a maximum of ±30 degrees.

## 📂 Project Structure

seesaw-simulation/
├── index.html      # Main page structure and panels
├── styles.css      # UI design and animations
├── app.js          # Physics calculations and game logic
├── README.md       # Project documentation (English)
├── README.tr.md    # Project documentation (Turkish)
└── CNAME           # Custom domain configuration

## 📦 Setup and Run

Since this is a static website, no backend setup (like Node.js) is required.

1.  Clone the repository:
    ```bash
    git clone [https://github.com/yunuscanunal/seesaw-simulation.git](https://github.com/yunuscanunal/seesaw-simulation.git)
    ```
2.  Navigate to the project directory:
    ```bash
    cd seesaw-simulation
    ```
3.  Open the `index.html` file in your browser.

## 🤝 Contributing

1.  Fork the repository.
2.  Create a Feature Branch (`git checkout -b feature/NewFeature`).
3.  Commit your changes (`git commit -m 'Add some NewFeature'`).
4.  Push to the branch (`git push origin feature/NewFeature`).
5.  Open a Pull Request.

---
*Developer: [Yunuscan Ünal](https://github.com/yunuscanunal)*
