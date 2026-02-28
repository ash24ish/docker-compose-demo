const form = document.getElementById("userForm");
const userList = document.getElementById("userList");

/* ---------------- LOAD USERS ---------------- */

async function loadUsers() {
  const res = await fetch("/users");
  const users = await res.json();

  userList.innerHTML = "";

  users.forEach(user => {
    const div = document.createElement("div");
    div.className = "user-card";

    div.innerHTML = `
  <strong>${user.name}</strong><br>
  Mobile: ${user.mobile}<br>
  Email: ${user.email}<br>
  Address: ${user.address || ""}<br>
  Location: ${user.location || ""}<br>

  <div>
    <b>Photos:</b><br>
    ${user.photos.map(p => {
      const fileName = p.split("\\").pop();
      return `
        <div style="margin-bottom:10px;">
          <img src="/${p}" width="100" /><br>
          <small>${fileName}</small>
        </div>
      `;
    }).join("")}
  </div>

  <div>
    <b>Videos:</b><br>
    ${user.videos.map(v => {
      const fileName = v.split("\\").pop();
      return `
        <div style="margin-bottom:15px;">
          <video width="150" controls>
            <source src="/${v}" type="video/mp4">
          </video><br>
          <small>${fileName}</small>
        </div>
      `;
    }).join("")}
  </div>

  <hr>
`;

    userList.appendChild(div);
  });
}

/* ---------------- SUBMIT FORM ---------------- */

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  await fetch("/users", {
    method: "POST",
    body: formData
  });

  form.reset();
  loadUsers(); // reload list after adding
});

/* ---------------- INITIAL LOAD ---------------- */

loadUsers();