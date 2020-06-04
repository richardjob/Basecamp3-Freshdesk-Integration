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
  renderTodos(listId);
}

function renderTodos(listId) {
  $("#todos").hide();
  $("#todo-details").show();
  loadTodos(listId, function (todoDetails) {
    let html = `
    <div style="padding-bottom: 10px;">
    <h4>"${todoDetails.length}" To-do Found</h4> 
    </div>`;

    todoDetails.forEach((todo) => {
      html =
        html +
        `<div style="margin-bottom: 3px; padding-top: 10px;">
  
          <div style="margin-bottom: 6px;">
          <fw-checkbox class="check-box" class="check-box" value="${
            todo.id
          }, ${listId}"><span>${todo.content}</span>
        <div style="margin-top: 8px">
            <fw-icon name="calendar-time" size="18" color="green"></fw-icon> 
            <fw-label value="${todo.due_on}" color="yellow"></fw-label>
            <fw-icon name="contact" size="18" color="green"></fw-icon>
            <fw-label value="${getAssignees(
              todo.assignees
            )}" color="blue"></fw-label>
          </div></fw-checkbox>
          </div>
          
        </div>`;
    });

    $("#to-dos").html(html);
    $(".check-box").on("fwChange", (e) => {
      let todoId = e.target.value.split(",")[0];
      let listId = e.target.value.split(",")[1];
      e.target.outerHTML = "";
      markCompleted(todoId, listId);
    });
  });
}

function loadTodos(listId, callback) {
  var options = {
    headers: {
      Authorization: "Bearer <%= access_token %>",
      "User-Agent": "Freshworks Integration (https://richardjob.github.io/)",
    },
    isOAuth: true,
  };
  client.request
    .get(
      `https://3.basecampapi.com/<%= iparam.account_id %>/buckets/<%= iparam.project_id %>/todolists/${listId}/todos.json`,
      options
    )
    .then(function (data) {
      callback(JSON.parse(data.response));
    })
    .catch(function (error) {
      console.error("error", error);
    });
}

function getAssignees(assignees) {
  let string = "";
  assignees.map((person) => {
    string = string + person.name + " , ";
  });
  return string;
}

function markCompleted(todoId, listId) {
  var options = {
    headers: {
      Authorization: "Bearer <%= access_token %>",
      "User-Agent": "Freshworks Integration (https://richardjob.github.io/)",
      "Content-Type": "application/json",
    },
    isOAuth: true,
  };
  client.request
    .post(
      `https://3.basecampapi.com/<%= iparam.account_id %>/buckets/<%= iparam.project_id %>/todos/${todoId}/completion.json`,
      options
    )
    .then(function () {
      renderTodos(listId);
      lookupTicketId(todoId, listId);
    })
    .catch(function (error) {
      console.error("error", error);
    });
}

function lookupTicketId(todoId, listId) {
  var dbKey = String(`basecampTodo:${todoId}`).substr(0, 30);

  Promise.all([client.db.get(dbKey)])
    .then((data) => {
      dbKey2 = String(`fdTicket:${data[0].ticketID}`).substr(0, 30);
      Promise.all([client.db.get(dbKey2)])
        .then((value) => {
          let newData = value[0];
          newData.todoID.splice(value[0].todoID.indexOf(todoId), 1);
          newData.todoList.splice(value[0].todoList.indexOf(listId), 1);

          Promise.all([
            client.db.delete(dbKey2),
            client.db.update(
              String(`fdTicket:${data[0].ticketID}`).substr(0, 30),
              "set",
              newData
            ),
          ])
            .then((result) => {
              console.log(result);
            })
            .catch(function (error) {
              console.error("error", error);
            });
        })
        .catch((err) => {
          console.log("err", err);
        });
    })
    .catch((err) => {
      callback(err);
    });
}
