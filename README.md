## Basecamp3-Freshdesk-Integration

- Add multiple to-dos to your Basecamp 3 project for a particular Freshdesk ticket.
- View To-dos , due date, and assignees. 
- Mark To-dos as completed directly from your Freshdesk sidebar. 
- To make things even smoother, to-dos are automatically closed when all to-dos created for the particular ticket gets completed.

### Project folder structure explained

    .
    ├── README.md                  This file.
    ├── config                     Installation parameter configs.
    │   └── iparams.json           Installation parameter config in English language.
    │   
    └── manifest.json              Project manifest.
    └── server                     Business logic for remote request and event handlers.
        ├── lib
        │   └── handle-response.js
        ├── server.js
        └── test_data
            ├── onAppInstall.json
            ├── onAppUninstall.json
            └── onExternalEvent.json