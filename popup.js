window.addEventListener("load", function (){
    const jiraBaseUrl = localStorage.getItem("jiraBaseUrl");
    const option = document.getElementById("jira-standup-options");
    const input = document.getElementById("jira-standup-url");

    if (!jiraBaseUrl) {
      option.style.display = "none";
      input.style.display = "block";
    } else {
      option.style.display = "block";
      input.style.display = "none";
      const jiraDashboard = document.getElementById("go-to-jira-dashboard");
      jiraDashboard.setAttribute("href", `${jiraBaseUrl}/secure/RapidBoard.jspa`);
    }
    const form = document.getElementById("set-jira-base-url");
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const inputUrl = document.getElementById("jira-base-url-input").value;
        if (!isValidURL(inputUrl)) {
            alert("Please enter a valid URL.");
            return;
        }
        const domain = getDomainWithHttps(inputUrl);
        if (!domain) {
            alert("Please enter a valid URL.");
            return;
        }
        localStorage.setItem("jiraBaseUrl", domain);
        option.style.display = "block";
        input.style.display = "none";
        console.log("Jira Base URL: ", domain);
        const jiraBaseUrl = localStorage.getItem("jiraBaseUrl");
        fetch(`${jiraBaseUrl}/rest/api/2/myself`).then(data => data.json()).then(data => {
            const userName = data.name;
            localStorage.setItem("jiraUserName", userName);
            const jiraUserName = localStorage.getItem("jiraUserName");
            console.log("Jira UserName: ", jiraUserName);
        });
    });

    function getDomainWithHttps(url) {
      try {
        const parsed = new URL(url);
        return `https://${parsed.hostname}`;
      } catch (_) {
        return null;
      }
    }

    function isValidURL(string) {
      try {
        new URL(string);
        return true;
      } catch (_) {
        return false;
      }
    }
});
