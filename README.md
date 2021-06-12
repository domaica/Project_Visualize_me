# Project 2 Group 2.- US Supersize me !!!

The requirements of this project asked for visualization under following requirements:

- Project must be powered by a data set with at least 100 records. We have used 10.000 records
- Visualization must include a Python Flask – powered API, HTML/CSS, JavaScript, and at least one database (in our case MongoDB)
- The project is a dashboard page with multiple charts that update from the same data.
- Our final visualization include at least 3 views.



## Main technologies used to deploy this project

- 'Javascript' programming language.
- 'Python' programming language.
- 'leaflet.js' JavaScript library for interactive maps. MAPBOX
- 'Bootstrap' collection of reusable code written in HTML, CSS, and JavaScript

- 'HTML' standard markup language for creating Web pages
- 'CSS' (Cascading Style Sheets) specifies style—page layouts, colors and fonts.

- 'Flask' API of Python that allows us to build up web-applications.


## Main folder for solution is called: 'Project_Visualize_me'

Inside that root folder, we can among others, the following subfolders:

- 'templates' containing 'index.html' with code for the webpage for the project.

- 'static/js' subfolder with 2 files:
    'logic.js' (coding) file invoked from html containing the javascript code.
    'config.js' with API-KEY required to access mapbox, provider of online maps for websites.
    'states_dict.js' containing different states coordinates and zoom levels needed for mapbox plotting.
  
- 'static/css' subfolder which contains a filled named 'style.css'. It is a .css Cascading Style Sheets used to adapt the presentation of webpage by modifying and enhancing colors, layouts, margin, fonts, etc.

- 'ppt' containing file 'Project_2_group_visualize_me_v3.pptx' -> Powerpoint containing screenshots, explaining process and main images of the outcomes, of webpages and additional details. Presentation done for project.

And files, main one:

- 'README.md' -> Markdown with project explanation.


### - Cross-origin resource sharing (CORS)

 CORS is a mechanism that restricts access to resources on a web page being requested from another domain outside the domain from which the first resource was served.
 
This project has been done by accessing the folder where "index.html" was located with command prompt, activate python and run the command 'python -m http.server'. This python command allows for separating Python code implementing an application’s logic from the HTML (or other) output that it produces. Therefore it lets us to work avoiding CORS security checks.

After running that command, you can access your webpage by browsing in 'localhost:8000' and see the results of your html and js development.



