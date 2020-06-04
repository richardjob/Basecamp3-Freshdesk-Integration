"use strict";

function lookupTicketId(todoId, listId, callback) {
  var dbKey = String(`basecampTodo:${todoId}`).substr(0, 30);

  Promise.all([$db.get(dbKey)])
    .then((data) => {
      console.log("data", data);
      dbKey2 = String(`fdTicket:${data[0].ticketID}`).substr(0, 30);
      Promise.all([$db.get(dbKey2)])
        .then((value) => {
          console.log("ticket", value);
          let newData = value[0];
          newData.todoID.splice(value[0].todoID.indexOf(todoId), 1);
          newData.todoList.splice(value[0].todoList.indexOf(listId), 1);

          Promise.all([
            $db.delete(dbKey2),
            $db.update(
              String(`fdTicket:${data[0].ticketID}`).substr(0, 30),
              "set",
              newData
            ),
          ])
            .then((result) => {
              console.log(result);
            })
            .catch((err) => {
              console.error("err", err);
            });
          callback(newData);
        })
        .catch((err) => {
          console.error("err", err);
        });
    })
    .catch((err) => {
      callback(err);
    });
}

exports = {
  events: [
    { event: "onAppInstall", callback: "onInstallHandler" },
    { event: "onAppUninstall", callback: "onUnInstallHandler" },
    { event: "onExternalEvent", callback: "onExternalEventHandler" },
  ],

  onInstallHandler: function (args) {
    generateTargetUrl()
      .then(function (targetUrl) {
        console.log(targetUrl)
        $request
          .post(
            `https://3.basecampapi.com/${args.iparams.account_id}/buckets/${args.iparams.project_id}/webhooks.json`,
            {
              headers: {
                Authorization: "Bearer <%= access_token %>",
                "User-Agent": "Freshworks Integration (https://richardjob.github.io/)",
              },
              isOAuth: true,
              json: {
                payload_url: targetUrl,
                types: ["Todo", "Todolist"],
                active: true
              },
            }
          )
          .then(
            (data) => {
              $db.set("basecampWebhookId", { url: data.response.url }).then(
                function () {
                  console.info("Successfully stored the webhook in the db");
                  renderData();
                },
                (error) => {
                  console.error(
                    "Error: Failed to store the webhook URL in the db"
                  );
                  console.error(error);
                  renderData({ message: "The webhook registration failed" });
                }
              );
            },
            (error) => {
              console.error(
                "Error: Failed to register the webhook for Basecamp"
              );
              console.error(error);
              renderData({ message: "The webhook registration failed" });
            }
          );
      })
      .fail(function () {
        console.error("Error: Failed to generate the webhook");
        renderData({ message: "The webhook registration failed" });
      });
  },

  onUnInstallHandler: function () {
    $db.get("basecampWebhookId").then(
      function (data) {
        $request
          .delete(data.url, {
            headers: {
              Authorization: "Bearer <%= access_token %>",
              "User-Agent": "Freshworks Integration (https://richardjob.github.io/)",
              Accept: "application/json",
            },
            isOAuth: true,
          })
          .then(
            () => {
              console.info(
                "Successfully deregistered the webhook for Basecamp"
              );
              renderData();
            },
            () => renderData()
          );
      },
      (error) => {
        console.error(
          "Error: Failed to get the stored webhook URL from the db"
        );
        console.error(error);
        renderData({ message: "The webhook deregistration failed" });
      }
    );
  },

  onExternalEventHandler: function (payload) {
    
    const payloadData = payload.data;

    if (payloadData.kind === "todo_completed") {

      lookupTicketId(
        payloadData.recording.id,
        payloadData.recording.parent.id,
        (data) => {
          if (data.status === 404) {
            return;
          }
          if (data.todoID.length === 0) {
            $request
              .post(payload.domain + "/api/v2/tickets/" + data.ticketID, {
                headers: {
                  Authorization: "<%= encode(iparam.freshdesk_api_key) %>",
                },
                json: {
                  status: 5,
                },
                method: "PUT",
              })
              .then(
                () => {
                  console.info("Successfully closed the ticket in Freshdesk");
                },
                (error) => {
                  console.error(
                    "Error: Failed to close the ticket in Freshdesk"
                  );
                  console.error(error);
                }
              );
          } else {
            console.log(
              "Failed to close the ticket in Freshdesk, found uncompleted to-dos"
            );
          }
        }
      );
    } else {
      console.error("Kind (action) not handled");
    }
  },
};
