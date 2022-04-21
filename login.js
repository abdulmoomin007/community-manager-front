import { baseURL } from "./config.js";
import { setCookie } from "./utils/cookieUtils.js";
import { post } from "./utils/post.js";

export default async function () {
  const login = `<form>
    <div>
    <h2>Please log in to Manage your App</h2>
    </div>
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
  `;
  document.querySelector("main.main").innerHTML = login;
  const loginBtn = document.querySelector("#loginBtn");
  const email = document.querySelector("#email");
  const password = document.querySelector("#password");

  loginBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    console.log("click");
    const data = await post(`${baseURL}/api/v1/users/login`, {
      email: email.value,
      password: password.value,
    });
    if (data.token) {
      setCookie("jwt", data.token, 3);
      setCookie("role", data.data.user.role, 3);
      location.reload();
    }
  });
}
