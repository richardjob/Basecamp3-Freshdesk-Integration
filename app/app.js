$(document).ready(function () {
  app
    .initialized()
    .then(function (_client) {
      window.client = _client;
      onTemplateLoad();
    })
    .catch(function (error) {
      console.error("Error during initialization" + error);
    });
});

function onTemplateLoad() {
  client.instance.receive(function (event) {
    var data = event.helper.getData();
    setData({
      ticketID: data.message.ticketId,
      todoID: data.message.todoId,
      todoList: data.message.todoList,
    });
    if (data.message.trigger) {
      showNotification(
        "success",
        "Yay 🎉",
        "A Basecamp todo is successfully created for this ticket"
      );
    }
  });
  loadTodoLists();
}

function loadTodoLists() {
  fetchProject(function (project) {
    let todoSet = project.dock.find((elm) => elm.name === "todoset").id;
    fetchTodosLists(todoSet, function (todoLists) {
      let html = ``;
      todoLists.forEach((list) => {
        html =
          html +
          `<tr>
          <td style="background-color:#b6d6fc;">
            <div style="text-align: center; padding-bottom: 10px;">
              <fw-icon name="add-note" size="18" color="black"></fw-icon>
              <span style="font-size: large;">${list.name}</span>
            </div>
            <div style="text-align: center;">
              <button onclick="addTodo(${list.id})" style="padding: 8px; border: none; border-radius: 10px; width: 85%; margin: 4px;">
                <fw-icon name="edit" style="margin-right: 8px;" size="15" color="black"></fw-icon>Add To-do
              </button>
              <button onclick="viewTodos(${list.id},'${list.name}')" style="padding: 8px; border: none; border-radius: 10px; width: 85%; margin: 4px;">
                <fw-icon name="visible" style="margin-right: 8px;" size="15" color="black"></fw-icon>View To-dos
              </button>
            </div>
          </td>
        </tr>`;
      });
      $("#todoLists").html(html);
      $("#project").html(project.name);
    });
  });
}

function fetchProject(callback) {
  var options = {
    headers: {
      Authorization: "Bearer <%= access_token %>",
      "User-Agent": "Freshworks Integration (https://richardjob.github.io/)",
    },
    isOAuth: true,
  };
  client.request
    .get(
      `https://3.basecampapi.com/<%= iparam.account_id %>/projects/<%= iparam.project_id %>.json`,
      options
    )
    .then(function (data) {
      callback(JSON.parse(data.response));
    })
    .catch(function (error) {
      console.error("error", error);
    });
}

function fetchTodosLists(todoSet, callback) {
  var options = {
    headers: {
      Authorization: "Bearer <%= access_token %>",
      "User-Agent": "Freshworks Integration (https://richardjob.github.io/)",
    },
    isOAuth: true,
  };

  client.request
    .get(
      `https://3.basecampapi.com/<%= iparam.account_id %>/buckets/<%= iparam.project_id %>/todosets/${todoSet}/todolists.json`,
      options
    )
    .then(function (data) {
      callback(JSON.parse(data.response));
    })
    .catch(function (error) {
      console.error("error", error);
    });
}

function addTodo(listId) {
  client.interface.trigger("showModal", {
    title: "Add To-do",
    template: "./modal/addTodo.html",
    data: listId,
  });
}

function viewTodos(listId, listName) {
  client.interface.trigger("showModal", {
    title: listName,
    template: "./modal/viewTodos.html",
    data: listId,
  });
}

function setData(data) {
  var dbKey = String(`fdTicket:${data.ticketID}`).substr(0, 30);
  var dbKey2 = String(`basecampTodo:${data.todoID}`).substr(0, 30);

  Promise.all([
    client.db.update(dbKey, "set", { ticketID: data.ticketID }),
    client.db.update(dbKey, "append", { todoID: [data.todoID] }),
    client.db.update(dbKey, "append", { todoList: [data.todoList] }),
    client.db.update(dbKey2, "set", {
      ticketID: data.ticketID,
      todoID: data.todoID,
    }),
  ])
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log("error", err);
    });
}

function showNotification(type, title, message) {
  client.interface
    .trigger("showNotify", {
      type: `${type}`,
      title: `${title}`,
      message: `${message}`,
    })
    .catch(function (error) {
      console.error("Notification Error : ", error);
    });
}
