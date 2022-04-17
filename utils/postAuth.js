export const postAuth = async (url, body, token) => {
  const response = await fetch(url, {
    method: "post",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(body),
  });
  return await response.json();
};
