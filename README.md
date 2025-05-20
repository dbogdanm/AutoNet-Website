## AutoNet - Premium Car Listings & Automotive Platform

**AutoNet** is a sophisticated web application designed for showcasing and exploring a curated portfolio of luxury, super, and exotic cars from around the world. This project serves as a comprehensive platform for automotive connoisseurs and collectors, built with Node.js, Express, and EJS templating.

**Key Features Implemented:**

*   **Dynamic Homepage:** Featuring a hero section, car recommendations, event tables, and blog/news snippets.
*   **Static Image Gallery:** Displays a collection of vehicles, filterable by server time and limited to a a maximum number of entries. Implemented with JSON data source and responsive grid layout. (Currently uses `div` and `a` tags, planned upgrade to `<figure>`/`<figcaption>`).
*   **EJS Templating:** Utilizes EJS for server-side rendering of dynamic content and page fragments (header, footer, head).
*   **Responsive Design:** CSS Grid and Flexbox are used to ensure a good user experience across various screen sizes, with specific layouts for desktop, medium, and small screens.
*   **Static Asset Serving:** Express serves static resources like CSS, JavaScript, images, and videos.
*   **Error Handling:** Custom error pages for 400, 403, 404, and 500 status codes, with error data loaded from a JSON file.
*   **Complex Routing:** Includes regex-based routing for specific resource access control (e.g., preventing direct access to EJS templates or directory listings).
*   **Dark Theme:** A visually appealing dark theme has been applied to most sections of the site for a premium feel.
*   **Video Integration:** Sections for video promotions and individual video presentation pages.

**Technology Stack:**

*   **Backend:** Node.js, Express.js
*   **Frontend:** HTML5, CSS3 (including Flexbox, Grid), JavaScript (ES6+)
*   **Templating Engine:** EJS
*   **Data Handling:** JSON files for static data (errors, image gallery).

**Project Goals (Academic/Learning):**

*   Demonstrate proficiency in web development fundamentals.
*   Implement server-side logic with Node.js and Express.
*   Create dynamic web pages using a templating engine.
*   Design and style a responsive and visually engaging user interface.
*   Manage static assets and implement basic security measures for routes.
*   Handle data from external sources (JSON).

This project is part of a "Web Technologies" academic course, focusing on practical application of web development principles.
