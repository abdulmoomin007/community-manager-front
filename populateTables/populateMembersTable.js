import { baseURL } from "../config.js";
import { getCookie } from "../utils/cookieUtils.js";
import deleteAuth from "../utils/deleteAuth.js";
import { patchAuth } from "../utils/patchAuth.js";
import { postAuth } from "../utils/postAuth.js";

export default function (tableContainer, data, units) {
  let tableDOM = `<table id="membersTable"><tbody></tbody></table>`;
  tableContainer.innerHTML = tableDOM;
  populate(data, units);
  document
    .querySelector("#membersTable")
    .addEventListener("click", async (event) => {
      if (event.target.id == "deleteBtn") deleteBtnHandler(event, data, units);
      else if (event.target.id == "editBtn") editBtnHandler(event, data, units);
      else if (event.target.id == "addBtn") addBtnHandler(event, data, units);
      else if (event.target.id == "updateBtn")
        updateBtnHandler(event, data, units);
      else if (event.target.id == "cancelBtn") populate(data, units);
    });
}

function populate(data, units) {
  let dom = `<tr>
    <th>Member ID</th>
    <th>Name</th>
    <th>Gender</th>
    <th>DOB</th>
    <th>DOJ</th>
    <th>Unit</th>
    <th>Actions</th>
    </tr>`;
  data.forEach((row) => {
    dom += `<tr id="${row.id}">
            <td>${row.memberId}</td>
            <td>${row.name}</td>
            <td>${row.gender}</td>
            <td>${row.dob}</td>
            <td>${row.doj}</td>
            <td>${units.find((unit) => unit.id == row.unitId).name}</td>
            <td><button id='editBtn'>edit</button><button id='deleteBtn'>delete</button></td>
            </tr>`;
  });
  dom += `<tr>
  <td><input type="text" id="memberId"></td>
  <td><input type="text" id="memberName"></td>
  <td><select id="memberGender"><option value="male">Male</option><option value="female">Female</option><option value="others">Others</option><select></td>
  <td><input type="date" id="memberDOB"></td>
  <td><input type="date" id="memberDOJ"></td>
  <td><select id="memberUnit">${units.map(
    (unit) =>
      "<option id='" +
      unit.id +
      "' value='" +
      unit.id +
      "'>" +
      unit.name +
      "</option>"
  )}</select></td>
  <td><button id='addBtn'>Add</button></td>
  </tr>`;
  document.querySelector("tbody").innerHTML = dom;
}

async function addBtnHandler(event, data, units) {
  console.log("Add");
  const memberId = document.querySelector("#memberId").value;
  const name = document.querySelector("#memberName").value;
  const gender = document.querySelector("#memberGender").value;
  const dob = document.querySelector("#memberDOB").value;
  const doj = document.querySelector("#memberDOJ").value;
  const unitId = document.querySelector("#memberUnit").value;
  const res = await postAuth(
    `${baseURL}/api/v1/members`,
    { memberId, name, gender, dob, doj, unitId },
    getCookie("jwt")
  );
  data.push(res.data);
  populate(data, units);
}

async function deleteBtnHandler(event, data, units) {
  const removeId = event.target.parentNode.parentNode.id;
  await deleteAuth(`${baseURL}/api/v1/members/${removeId}`, getCookie("jwt"));
  data.splice(
    data.findIndex((el) => el.id == removeId),
    1
  );
  populate(data, units);
}

async function editBtnHandler(event, data, units) {
  console.log("Edit");
  const row = event.target.parentNode.parentNode;
  const rowId = row.id;
  const rowData = data.find((el) => el.id == rowId);
  console.log(row, rowId, rowData);
  const innerDOM = `<tr>
  <td><input type="text" id="memberId" value="${rowData.memberId}"></td>
  <td><input type="text" id="memberName" value="${rowData.name}"></td>
  <td><select id="memberGender"><option value="male" ${
    rowData.gender == "male" ? "selected" : ""
  }>Male</option><option value="female" ${
    rowData.gender == "female" ? "selected" : ""
  }>Female</option><option value="others" ${
    rowData.gender == "others" ? "selected" : ""
  }>Others</option><select></td>
  <td><input type="date" id="memberDOB" value="${rowData.dob}"></td>
  <td><input type="date" id="memberDOJ" value="${rowData.doj}"></td>
  <td><select id="memberUnit">${units
    .map(
      (unit) =>
        "<option id='" +
        unit.id +
        "' value='" +
        unit.id +
        "' " +
        (rowData.unitId == unit.id ? "selected" : "") +
        ">" +
        unit.name +
        "</option>"
    )
    .join()}</select></td>
  <td><button id='updateBtn'>Update</button><button id='cancelBtn'>Cancel</button></td>
  </tr>`;
  row.innerHTML = innerDOM;
}

async function updateBtnHandler(event, data, units) {
  const currentRow = event.target.parentNode.parentNode;
  const memberId = currentRow.querySelector("#memberId").value;
  const name = currentRow.querySelector("#memberName").value;
  const gender = currentRow.querySelector("#memberGender").value;
  const dob = currentRow.querySelector("#memberDOB").value;
  const doj = currentRow.querySelector("#memberDOJ").value;
  const unitId = currentRow.querySelector("#memberUnit").value;
  const res = await patchAuth(
    `${baseURL}/api/v1/members/${currentRow.id}`,
    { memberId, name, gender, dob, doj, unitId },
    getCookie("jwt")
  );
  const index = data.findIndex((el) => el.id == res.data.id);
  data[index] = res.data;
  populate(data, units);
}
