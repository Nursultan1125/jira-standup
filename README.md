# Jira Standup Chrome Extension

A Chrome extension that helps generate standup reports from Jira worklogs and converts them into Markdown format.

## Description

This Chrome extension allows you to automatically generate standup reports from your Jira worklogs. It fetches your worklog entries for the current day and previous day, organizes them by date, and formats them into a clean Markdown document.

## Features

- Automatic worklog fetching from Jira
- Support for both today's and yesterday's worklogs
- Markdown formatting with Jira ticket links
- Customizable Jira domain configuration
- Easy-to-use popup interface
- Options page for generating standup reports

## Installation

1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the project directory

## Configuration

1. Click the extension icon in your Chrome toolbar
2. Set your Jira base URL in the popup
3. Configure your Jira username in the options page

## Usage

1. Click the extension icon in your Chrome toolbar
2. Use the "Generate standup" link to open the options page
3. Click the "Convert" button to generate your standup report
4. The report will be displayed in Markdown format with:
   - Yesterday's work
   - Today's work
   - Problems section

## Format

The generated standup follows this format:

```markdown
@Enji.ai

**Yesterday**:
 - [TICKET-123](https://jira.example.com/browse/TICKET-123) | Ticket summary
     - Worklog comment 1
     - Worklog comment 2

**Today**:
 - [TICKET-456](https://jira.example.com/browse/TICKET-456) | Ticket summary
     - Worklog comment 1

**Problems**:
 - []
```

## Permissions

The extension requires the following permissions:
- `storage`: For saving configuration
- `activeTab`: For accessing the current tab
- `scripting`: For executing scripts
- Access to your Jira domain

## Development

The project structure:
- `manifest.json`: Extension configuration
- `popup.html` & `popup.js`: Popup interface
- `options.html` & `option.js`: Standup generation interface
- `marked.min.js`: Markdown parsing library
- `icon.png`: Extension icon

## License

This project is open source and available under the MIT License.
