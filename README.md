## Basecamp3-Freshdesk-Integration

- Add multiple to-dos to your Basecamp 3 project for a particular Freshdesk ticket.
- View To-dos , due date, and assignees. 
- Mark To-dos as completed directly from your Freshdesk sidebar. 
- To make things even smoother, to-dos are automatically closed when all to-dos created for the particular ticket gets completed.

### Before you begin

- Replace BASECAMP_3_CLIENT_ID in oauth_config.json file with your own Basecamp3 client ID.
- Replace BASECAMP_3_CLIENT_SECRET in oauth_config.json file with your own Basecamp3 client secret.

### Project folder structure explained
```
.
│   .report.json
│   manifest.json
│   README.md                               This File
│
├───.fdk
│       localstore
│
├───app
│   │   app.js                              Sidebar JS file
│   │   template.html                       Sidebar template file
│   │
│   ├───modal
│   │       addTodo.html                    Add Todo form modal template
│   │       addTodo.js                      Add Todo form modal JS file
│   │       viewTodos.html                  View Todos modal template
│   │       viewTodos.js                    View Todos modal JS file
│   │
│   └───resources
│       └───img
│               basecamp-logo.svg           App icon/logo
│
├───config
│       iparams.json                        Installation parameters file
│       oauth_config.json                   OAuth configuration file
│
├───coverage
│
├───dist
│       Basecamp3-Freshdesk-Integration.zip
│
└───server
    │   server.js                           server event handling file
    │
    ├───lib
    │       handle-response.js
    │
    └───test_data
            onAppInstall.json
            onAppUninstall.json
            onExternalEvent.json

```