import { baseURL } from "../config.js";
import { getCookie } from "../utils/cookieUtils.js";
import deleteAuth from "../utils/deleteAuth.js";
import { postAuth } from "../utils/postAuth.js";

export default function (tableContainer, data, units) {
  populateDom(tableContainer, data);
  document
    .querySelector("#usersTable")
    .addEventListener("click", async (event) => {
      if (event.target.id == "deleteBtn") {
        const removeId = event.target.parentNode.parentNode.id;
        await deleteAuth(
          `${baseURL}/api/v1/users/${removeId}`,
          getCookie("jwt")
        );
        data.splice(
          data.findIndex((el) => el.id == removeId),
          1
        );
        populate(data);
      }
    });
}

function populate(data) {
  let dom = `<tr>
    <th>Name</th>
    <th>Email</th>
    </tr>`;
  data.forEach((row) => {
    dom += `<tr id="${row.id}">
            <td>${row.name}</td>
            <td>${row.email}</td>
            <td><button id='deleteBtn'>delete</button></td>
            </tr>`;
  });
  document.querySelector("tbody").innerHTML = dom;
}

function populateDom(tableContainer, data) {
  let tableDOM = `<table id="usersTable"><tbody>`;
  tableDOM += `</tbody></table>`;
  tableContainer.innerHTML = tableDOM;
  populate(data);
}
