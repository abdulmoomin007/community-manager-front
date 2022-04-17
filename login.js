import { baseURL } from "./config.js";
import { setCookie } from "./utils/cookieUtils.js";
import { post } from "./utils/post.js";

export default async function () {
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
      location.reload();
    }
  });
}
