<h1 align="center">AutoNet: The Epitome of Automotive Excellence</h1>

<p align="center">
  A sophisticated web platform for discovering and exploring an exclusive collection of the world's most coveted luxury, super, and exotic automobiles.
  <br/>
  <strong>(Academic Project for Web Technologies)</strong>
</p>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#technology-showcase">Technology Showcase</a> •
  <a href="#installation-and-setup">Installation</a> •
  <a href="#future-enhancements">Future Enhancements</a>
</p>

---

<div align="center">

![Status](https://img.shields.io/badge/Maintained%3F-no-red.svg?style=flat-square)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
![Repo Size](https://img.shields.io/github/repo-size/dbogdanm/AutoNet-Website?style=flat-square)
![Last Commit](https://img.shields.io/github/last-commit/dbogdanm/AutoNet-Website?style=flat-square)
![Stars](https://img.shields.io/github/stars/dbogdanm/AutoNet-Website?style=flat-square)

<br/>

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![Bootstrap](https://img.shields.io/badge/bootstrap-%23563D7C.svg?style=for-the-badge&logo=bootstrap&logoColor=white)

</div>

## Project Demo

**Watch the full demonstration on YouTube:**
[AutoNet Project Demo](https://youtu.be/3D8M9dRh6NA)

---

## About The Project

**AutoNet** transcends the typical car listing site. It is an immersive experience designed for the true automotive aficionado. We delve into the artistry, engineering, and sheer thrill of the world's most exceptional vehicles, presenting them on a platform built with modern web technologies including **Node.js, Express.js, and EJS templating**.

This project serves as a cornerstone of a "Web Technologies" academic program, designed to demonstrate a comprehensive understanding of full-stack web development principles, responsive design, and server-side logic.

---

## Key Features

Our platform brings the world of luxury automobiles to your fingertips with a suite of carefully crafted features:

* **Dynamic Homepage:** An engaging entry point showcasing:
    * An immersive Hero Section setting a premium tone.
    * Curated Car Recommendations to inspire discovery.
    * An Events & Launches Table detailing upcoming automotive highlights.
    * "The Journal" snippets offering glimpses into automotive stories.

* **Sophisticated Static Image Gallery:**
    * Displays a handpicked collection of vehicles from a JSON data source.
    * Features **server-time based filtering** to showcase vehicles available within specific intervals.
    * Intelligently limits displayed entries to a maximum of 10, ensuring a focused experience.
    * Employs a responsive grid layout (3-column, 2-column, 1-column) for optimal viewing on all devices.

* **Dark Theme:** A visually stunning dark aesthetic applied site-wide, enhancing the luxury feel and user focus.

* **Dynamic EJS Templating:** Server-side rendering for seamless page loads and dynamic content integration, utilizing reusable page fragments (header, footer, head).

* **Responsive Design:** Expert use of CSS Grid and Flexbox ensures a flawless and adaptive user experience across desktop, tablet, and mobile screens.

* **Robust Static Asset Serving:** Efficient delivery of CSS, JavaScript, high-resolution images, and video content via Express.

* **Comprehensive Error Handling:** Custom-designed, informative error pages (400, 403, 404, 500) driven by a centralized JSON error configuration.

* **Secure Routing:** Advanced routing mechanisms, including regular expressions, to manage resource access and enhance security (e.g., preventing direct EJS template access).

* **Video Integration:** Dedicated sections for promotional video carousels and individual vehicle video presentation pages.

---

## Technology Showcase

AutoNet is built upon a foundation of robust and widely-adopted web technologies:

### Backend Framework
* **Node.js:** Asynchronous JavaScript runtime environment.
* **Express.js:** Minimalist and flexible Node.js web application framework.

### Frontend Development
* **HTML5:** Semantic markup for modern web structure.
* **CSS3 / SCSS:** Advanced styling capabilities featuring CSS Grid, Flexbox, and Custom Animations.
* **JavaScript (ES6+):** Client-side interactivity and dynamic behaviors.

### Templating & Data
* **EJS (Embedded JavaScript):** Efficient server-side HTML generation with JavaScript logic.
* **JSON:** Lightweight data-interchange format for static configurations (errors, gallery data).

---

## Installation and Setup

To run this project locally, follow these steps:

1.  **Prerequisites**
    Ensure you have Node.js and npm installed on your machine.

2.  **Clone the Repository**
    ```bash
    git clone https://github.com/dbogdanm/AutoNet-Website
    ```

3.  **Install Dependencies**
    Navigate to the project directory and install the required packages.
    ```bash
    cd autonet
    npm install
    ```

4.  **Compile SCSS (If applicable)**
    If you are modifying styles, ensure your SCSS is compiled to CSS.
    ```bash
    npm run build-css
    # Or, if using a simple watcher:
    sass --watch resurse/scss:resurse/css
    ```

5.  **Start the Server**
    ```bash
    npm start
    ```
    *Note: Check `package.json` for the specific start script. It is usually `node index.js` or `nodemon index.js`.*

6.  **Access the Application**
    Open your browser and visit:
    `http://localhost:8080` (or the port defined in your configuration).

---

## Future Enhancements

While this is an academic project, the vision for AutoNet includes potential future enhancements:

* **Database Integration:** Transitioning from JSON to a robust database (e.g., MongoDB, PostgreSQL) for dynamic content management.
* **User Authentication:** Allowing users to register, log in, and save favorite vehicles.
* **Dynamic Search:** Implementing advanced search and filtering for vehicle listings.
* **Admin Panel:** A backend interface for managing car listings and blog posts.
* **Advanced CSS Transitions:** Implementing complex hover animations for the image gallery.

---

## License and Ownership

**Copyright © 2025 [DINU BOGDAN]. All Rights Reserved.**

This project is an academic creation developed for the Web Technologies course. Unauthorized copying, modification, distribution, or use of this code for commercial purposes is strictly prohibited without express written permission from the author.
