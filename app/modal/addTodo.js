$(document).ready(function () {
  app
    .initialized()
    .then(function (_client) {
      window.client = _client;
      client.instance
        .context()
        .then(function (context) {
          onModalLoad(context.data);
        })
        .catch(function (error) {
          console.error("error", error);
        });
    })
    .catch(function (error) {
      console.error("Error during initialization" + error);
    });
});

function onModalLoad(listId) {
  renderForm(listId);
}

function renderForm(listId) {
  $("#todos").hide();

  let html = `<div style="margin-left: 5px;">
          <label for="todoText">Todo *</label>
          <textarea style="width: 400px; height: 200px; margin-left: -3px; margin-bottom: 7px" class="form-control" id="todoText" rows="4"></textarea>
        
          </div>
          <fw-select id="todoAssignee" style="margin-left: 5px; width: 300px;" label="Assigned to" multiple>`;

  loadPeople(function (people) {
    people.forEach((assignee) => {
      html =
        html +
        `<fw-select-option value=${assignee.id}>${assignee.name}</fw-select-option>`;
    });

    html =
      html +
      ` </fw-select>
        
            <input id="todoDate" style="width: 300px;" type="date" class="datepicker">
        
            <div style="margin-top: 15px;">
              <button id="createTodo" onclick="createTodo(${listId})" style="background-color: mediumseagreen; color: white; padding: 10px; border-style: none;">Add this to-do</button>
            <button onclick="cancelTodo()" style="color: black; padding: 8px; border-style: solid; border-color: mediumseagreen;">Cancel</button>
            </div>`;

    client.data.get("ticket").then((data) => {
      document.getElementById("todoText").innerHTML =
        data.ticket.description_text;
    });

    $("#add-todo-form").html(html);
  });
}

function loadPeople(callback) {
  var options = {
    headers: {
      Authorization: "Bearer <%= access_token %>",
      "User-Agent": "Freshworks Integration (https://richardjob.github.io/)",
    },
    isOAuth: true,
  };
  client.request
    .get(
      `https://3.basecampapi.com/<%= iparam.account_id %>/projects/<%= iparam.project_id %>/people.json`,
      options
    )
    .then(function (data) {
      callback(JSON.parse(data.response));
    })
    .catch(function (error) {
      console.error("error", error);
    });
}

function createTodo(listId) {
  var options = {
    headers: {
      Authorization: "Bearer <%= access_token %>",
      "User-Agent": "Freshworks Integration (https://richardjob.github.io/)",
      "Content-Type": "application/json",
    },
    isOAuth: true,
    body: JSON.stringify({
      content: document.getElementById("todoText").value,
      assignee_ids: document.getElementById("todoAssignee").value
        ? document.getElementById("todoAssignee").value.map(Number)
        : [],
      due_on: document.getElementById("todoDate").value
        ? document.getElementById("todoDate").value
        : "",
    }),
  };

  client.request
    .post(
      `https://3.basecampapi.com/<%= iparam.account_id %>/buckets/<%= iparam.project_id %>/todolists/${listId}/todos.json`,
      options
    )
    .then(function (data) {
      data = JSON.parse(data.response);
      client.data
        .get("ticket")
        .then(function (ticketData) {
          client.instance.send({
            message: {
              trigger: true,
              ticketId: ticketData.ticket.id,
              todoId: data.id,
              todoList: listId,
            },
          });
          client.instance.close();
        })
        .catch(function (error) {
          console.error("error", error);
        });
    })
    .catch(function (error) {
      console.error("error", error);
    });
}

function cancelTodo() {
  client.instance.close()
}
