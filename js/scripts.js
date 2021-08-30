(function() {
    const gitAPI = 'https://api.github.com/';
    const otherProjects = [{
        'html_url': 'https://databasedashboard.co',
        name: 'Database Dashboard',
        description: 'App that allows users to aggregate and view data in SQL databases.',
        date: 'z'
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
        console.log(proj);
        const projDiv = document.createElement('div'); // Make empty div elem
        projDiv.setAttribute('id', idGenerator.get()); // Set id to unique generated id
        projDiv.classList.add('subject');
        if (!proj.description) {
            proj.description = 'Check out the code on Github using the link above!';
        }
        projDiv.innerHTML = projectBox(proj.html_url, proj.name, proj.description); // Add project div
        projectsElem.appendChild(projDiv); // Add to projects div
    };

    (async function() {
        try {
            // get list of projects
            const resp = await fetch(`${gitAPI}users/RileyMcCuen/repos`);
            const projects = await resp.json();

            // get date of last commit for each project
            let projPromPairs = [];
            for (let project of projects) {
                projPromPairs.push({project: project, promise: fetch(project.commits_url.replace('{/sha}', ''))})
            }
            for (let pair of projPromPairs) {
                const promResult = (await pair.promise);
                if (promResult.ok) {
                    pair.project.date = (await promResult.json())[0].commit.committer.date;
                } else {
                    pair.project.date = 'z';
                }
            }

            // sort by date, most recent commits first
            projFromPairs.sort((a, b) => {
                return a.project.date > b.project.date;
            });
    
            // display each project
            projPromPairs.forEach(pair => loadProject(pair.project));
        } catch (e) {
            console.log(e)
            loadProject({
                'html_url': 'https://github.com/RileyMcCuen',
                name: 'My Github Account',
                description: 'It appears that my public repositories could not be gotten at this time. This is likely due to rate limiting on the Github API, all of these projects are loaded dynmically! Feel free to take the link to my Github profile instead.'
            }); // Github api did not return list of repositories, put in link to Github account
        }
    })();
})();
