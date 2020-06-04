## Basecamp3-Freshdesk-Integration

- Add multiple to-dos to your Basecamp 3 project for a particular Freshdesk ticket.
- View To-dos , due date, and assignees. 
- Mark To-dos as completed directly from your Freshdesk sidebar. 
- To make things even smoother, to-dos are automatically closed when all to-dos created for the particular ticket gets completed.

### Project folder structure explained
```
.
│   .report.json
│   manifest.json
│   README.md
│
├───.fdk
│       localstore
│
├───app
│   │   app.js
│   │   template.html
│   │
│   ├───modal
│   │       addTodo.html
│   │       addTodo.js
│   │       viewTodos.html
│   │       viewTodos.js
│   │
│   └───resources
│       └───img
│               basecamp-logo.svg
│
├───config
│       iparams.json
│       oauth_config.json
│
├───coverage
│   │   base.css
│   │   index.html
│   │   prettify.css
│   │   prettify.js
│   │   sort-arrow-sprite.png
│   │   sorter.js
│   │
│   ├───app
│   │   │   app.js.html
│   │   │   index.html
│   │   │
│   │   └───modal
│   │           addTodo.js.html
│   │           index.html
│   │           modal.js.html
│   │           viewTodos.js.html
│   │
│   ├───modal
│   │       addTodo.js.html
│   │       index.html
│   │       viewTodos.js.html
│   │
│   └───server
│           index.html
│           server.js.html
│
├───dist
│       Basecamp3-Freshdesk-Integration.zip
│
└───server
    │   server.js
    │
    ├───lib
    │       handle-response.js
    │
    └───test_data
            onAppInstall.json
            onAppUninstall.json
            onExternalEvent.json
            
```