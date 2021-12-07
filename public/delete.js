
const list = document.getElementById("list");
const info = document.getElementById("info");

const constructList = () => {
  const data = fetch("/payload")
    .then(data => data.json())
      .then(json => {
        if (json.length <= 0) {
          const p = document.createElement("p");
          p.innerHTML = "No droplets! Go create some!";
          info.appendChild(p);
          info.className = "";
        } else {
          console.log(info.className);
          for (droplet of json) {
            const checkbox = document.createElement("input");
            checkbox.setAttribute("type", "checkbox");
            checkbox.setAttribute("id", `${droplet._id}`);
            const label = document.createElement("Label");
            label.setAttribute("for", `${droplet._id}`)
            label.innerHTML = droplet.body + " | " + droplet.ts;
            const listElem = document.createElement("div");
            listElem.appendChild(checkbox);
            listElem.appendChild(label);
            list.appendChild(listElem);
          }

        }
        // setup click event handler
        const conf = document.getElementById("confirm");
        conf.addEventListener("click", async (event) => {
          const selected = document.querySelectorAll("input[type=checkbox]:checked");
          const ids = [] // use .map but selected is not Array, its NodeList :')
          for (s of selected) { ids.push(s.id) }
          // TODO: Encrypt this FFS
          ids.push(document.getElementById("password").value);
          const response = await fetch("/delete", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(ids)
          })
          // TODO: handle later and inform user gracefully
          // Good UI/UX
          location.reload();

        })
      });
}

constructList();