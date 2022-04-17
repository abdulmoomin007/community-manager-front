import { baseURL } from "./config.js";
import { get } from "./utils/get.js";
import logIn from "./login.js";
import { getCookie, setCookie } from "./utils/cookieUtils.js";
import populateMembersTable from "./populateTables/populateMembersTable.js";
import populateUsersTable from "./populateTables/populateUsersTable.js";
import populateUnitsTable from "./populateTables/populateUnitsTable.js";

const token = getCookie("jwt");

if (token && token != "") {
  const tableContainer = document.querySelector(".tableContainer");
  tableContainer.innerHTML =
    "<h1 style='font-size:x-large;padding:2rem'>loading...</h1>";
  const data = await get(`${baseURL}/api/v1/members/`, token);
  const units = (await await get(`${baseURL}/api/v1/units`, token)).data;
  // if (data.data && data.data.length == 0) {
  //   populateMembersTable(tableContainer, data.data, units);
  // tableContainer.insertAdjacentHTML(
  //   "beforeend",
  //   "<h1 style='font-size:x-large;padding:2rem'>No Data Found!</h1>"
  // );
  // } else
  if (data.status == "success") {
    populateMembersTable(tableContainer, data.data, units);
  } else {
    alert("Error! Something Went Wrong!");
  }
} else {
  const login = `<form>
    <div>
      <label for="email">Email address</label>
      <input type="email" id="email" />
    </div>
  
    <div>
      <label for="password">Password</label>
      <input type="password" id="password" />
    </div>
  
    <button type="button" id="loginBtn" class="btn btn-primary btn-block mb-4">Sign in</button>
  </form>
  <div>
  <h1>Please log in to Manage your App</h1>
  </div>
  `;
  document.querySelector("main.main").innerHTML = login;
  logIn();
}

const logoutBtn = document.querySelector(".logout");

logoutBtn.addEventListener("click", (e) => {
  e.preventDefault();
  setCookie("jwt", "");
  setCookie("user", "");
  location.reload();
});

document.querySelector("nav.nav").addEventListener("click", async function (e) {
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
