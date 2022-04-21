import { baseURL } from "./config.js";
import { get } from "./utils/get.js";
import logIn from "./login.js";
import { getCookie, setCookie } from "./utils/cookieUtils.js";
import populateMembersTable from "./populateTables/populateMembersTable.js";
import populateUsersTable from "./populateTables/populateUsersTable.js";
import populateUnitsTable from "./populateTables/populateUnitsTable.js";

const token = getCookie("jwt");
const role = getCookie("role");
console.log(role);
const logoutBtn = document.querySelector(".logout");

if (token && token != "") {
  if (role != "admin") {
    const nav = `<ul>
        <li id="member" class="active">Member</li>
        <li id="report">Reports</li>
    </ul>`;
    document.querySelector("nav.nav").innerHTML = nav;
  }
  logoutBtn.style.display = "block";
  const tableContainer = document.querySelector(".tableContainer");
  tableContainer.innerHTML =
    "<h1 style='font-size:x-large;padding:2rem'>loading...</h1>";
  const data = await get(`${baseURL}/api/v1/members/`, token);
  const units = (await await get(`${baseURL}/api/v1/units`, token)).data;
  if (data.status == "success") {
    populateMembersTable(tableContainer, data.data, units);
  } else {
    alert("Error! Something Went Wrong!");
  }

  document
    .querySelector("nav.nav")
    .addEventListener("click", async function (e) {
      [...e.target.parentNode.querySelectorAll("li")].forEach((el) => {
        el.classList.remove("active");
      });
      e.target.classList.add("active");
      if (e.target.id == "member") {
        const tableContainer = document.querySelector(".tableContainer");
        tableContainer.innerHTML =
          "<h1 style='font-size:x-large;padding:2rem'>loading...</h1>";
        const data = await get(`${baseURL}/api/v1/members/`, token);
        const units = await (await get(`${baseURL}/api/v1/units`, token)).data;
        if (data.status == "success") {
          populateMembersTable(tableContainer, data.data, units);
        } else {
          alert("Error! Something Went Wrong!");
        }
      } else if (e.target.id == "user") {
        const tableContainer = document.querySelector(".tableContainer");
        tableContainer.innerHTML =
          "<h1 style='font-size:x-large;padding:2rem'>loading...</h1>";
        const data = await get(`${baseURL}/api/v1/users/`, token);
        console.log(data);
        populateUsersTable(tableContainer, data.data);
      } else if (e.target.id == "unit") {
        const tableContainer = document.querySelector(".tableContainer");
        tableContainer.innerHTML =
          "<h1 style='font-size:x-large;padding:2rem'>loading...</h1>";
        const data = await get(`${baseURL}/api/v1/units/`, token);
        populateUnitsTable(tableContainer, data.data);
      } else if (e.target.id == "report") {
        const tableContainer = document.querySelector(".tableContainer");
        tableContainer.innerHTML =
          "<h1 style='font-size:x-large;padding:2rem'>No Reports Yet.</h1>";
      }
    });
} else {
  logIn();
  logoutBtn.style.display = "none";
}

logoutBtn.addEventListener("click", (e) => {
  e.preventDefault();
  setCookie("jwt", "");
  setCookie("role", "");
  location.reload();
});
