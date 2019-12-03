(function() {
    const gitAPI = 'https://api.github.com/';
    const otherProjects = [{
        url: 'databasedashboard.co',
        name: 'Database Dashboard',
        description: 'App that allows users to aggregate and view data in SQL databases.'
    }]; // Load non git projects into here
    const projectsElem = document.getElementById('projects'); // Get HTML element for projects

    const idGenerator = (function() { // Used for generating unique ids for elements inserted into the page
        let id = 0;
        return {
            get: () => {
                id += 1;
                return id;
            }
        }
    })();

    const projectBox = (link, name, description) => // HTML box containing project info
        `
            <h2><a href="${link}">${name}</a></h2>
            <p>${description}</p>
        `;

    const loadProject = (proj) => {
        const projDiv = document.createElement('div'); // Make empty div elem
        projDiv.setAttribute('id', idGenerator.get()); // Set id to unique generated id
        projDiv.classList.add('subject');
        if (!proj.description) {
            proj.description = 'Check out the code on Github using the link above!';
        }
        projDiv.innerHTML = projectBox(proj.html_url, proj.name, proj.description); // Add project div
        projectsElem.appendChild(projDiv); // Add to projects div
    };

    const xmlh = new XMLHttpRequest();

    xmlh.onreadystatechange = () => {
        if (xmlh.readyState == XMLHttpRequest.DONE) { // XMLHttpRequest.DONE == 4
            if (xmlh.status == 200) {
                try {
                    const resp = JSON.parse(xmlh.response);
                    if (resp) {
                        resp.forEach(loadProject);
                        return;
                    }
                } catch (err) {
                    // Unfortunately, there was an error with getting my repositories, nothing to load
                }
            }
            loadProject({
                url: 'https://github.com/RileyMcCuen',
                name: 'My Github Account',
                description: 'It appears that my public repositories could not be gotten at this time. Feel free to take the link to my Github profile.'
            }); // Github api did not return list of repositories, put in link to Github account
        }
    };

    xmlh.open("GET", `${gitAPI}users/RileyMcCuen/repos`, true);
    xmlh.send();

    otherProjects.forEach(loadProject);
})();
