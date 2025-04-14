
document.getElementById('convertBtn').addEventListener('click', () => {
    const output = document.getElementById('output');

    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 0);

    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    const USER_NAME = localStorage.getItem("jiraUserName");
    const JIRA_DOMAIN = localStorage.getItem("jiraBaseUrl");
    const JIRA_BASE_URL = `${JIRA_DOMAIN}/rest/api/2/`;
    const MAX_RESULTS = 1000;
    const startDate = formatDateToYYYYMMDD(firstDay);
    const endDate = formatDateToYYYYMMDD(lastDay);
    let jqlDateRange = `(worklogDate >= "${startDate}" and worklogDate < "${endDate}")`;
    let jqlUser = `worklogAuthor in ("${USER_NAME}")`;
    let jql = encodeURIComponent(`${jqlUser} AND ${jqlDateRange}`);
    let requestFields = "summary,worklog,issuetype,parent,project,status,assignee,reporter,aggregatetimespent,timeoriginalestimate,timeestimate";

    console.log(JIRA_BASE_URL)
    fetch(`${JIRA_BASE_URL}search?jql=${jql}&fields=${requestFields}&maxResults=${MAX_RESULTS}`,)
        .then(response => response.json())
        .then(data => {
            parseJira(data).then(markdown => {
                const result = parseCSVtoMarkdown(markdown);
                output.innerHTML = marked.parse(result);
            });
        });


});

async function parseJira(data) {
    const JIRA_DOMAIN = localStorage.getItem("jiraBaseUrl");
    const JIRA_BASE_URL = `${JIRA_DOMAIN}/rest/api/2/`;
    // const today = new Date();
    // const yesterday = new Date();
    // yesterday.setDate(today.getDate() - 1);
    // today.setHours(0, 0, 0, 0);
    // yesterday.setHours(0, 0, 0, 0);

    const today = new Date();
    const yesterday = new Date();
    if (today.getDay() === 1) {
        yesterday.setDate(today.getDate() - 3);
    } else {
        yesterday.setDate(today.getDate() - 1);
    }
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);

    const standup = {Yesterday: {}, Today: {}};

    for (const issue of data["issues"]) {
        const ticket = issue.key;
        const summary = issue.fields.summary;
        const worklog = issue.fields.worklog;

        if (worklog.maxResults >= worklog.total) {
            worklog.worklogs.forEach(log => {
                const date = new Date(log.started);
                const comment = log.comment;
                const dateKey = sameDay(date, today)
                    ? 'Today'
                    : sameDay(date, yesterday)
                        ? 'Yesterday'
                        : null;
                if (!dateKey) return;

                if (!standup[dateKey][ticket]) {
                    standup[dateKey][ticket] = {Summary: summary, Comment: [comment]};
                } else {
                    standup[dateKey][ticket].Comment.push(comment);
                }
            });
        } else {
            const MAX_RESULTS = 5000;
            const url = `${JIRA_BASE_URL}issue/${ticket}/worklog?maxResults=${MAX_RESULTS}`;

            try {
                const response = await fetch(url);
                const data = await response.json();

                data.worklogs.forEach(log => {
                    const date = new Date(log.started);
                    const comment = log.comment;
                    const dateKey = sameDay(date, today)
                        ? 'Today'
                        : sameDay(date, yesterday)
                            ? 'Yesterday'
                            : null;
                    if (!dateKey) return;

                    if (!standup[dateKey][ticket]) {
                        standup[dateKey][ticket] = {Summary: summary, Comment: [comment]};
                    } else {
                        standup[dateKey][ticket].Comment.push(comment);
                    }
                });
            } catch (error) {
                console.error(`Ошибка загрузки worklog для ${ticket}:`, error);
            }
        }
    }

    return standup;
}

function parseCSVtoMarkdown(standup) {
    const JIRA_DOMAIN = localStorage.getItem("jiraBaseUrl");
    const JIRA_BASE_URL = `${JIRA_DOMAIN}/browse/`;
    let result = "@Enji.ai\n\n";

    ["Yesterday", "Today"].forEach(key => {
        result += `**${key}**:\n`;
        for (const ticket in standup[key]) {
            const entry = standup[key][ticket];
            result += ` - [${ticket}](${JIRA_BASE_URL + ticket}) | ${entry.Summary}\n`;
            entry.Comment.forEach(comment => {
                result += `     - ${comment}\n`;
            });
        }
        result += '\n';
    });
    result += "**Problems**:\n - []\n";
    return result;
}

function sameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
}


function formatDateToYYYYMMDD(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // месяцы с 0
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}