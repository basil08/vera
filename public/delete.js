
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
        for (droplet of json) {
          const checkbox = document.createElement("input");
          checkbox.setAttribute("type", "checkbox");
          checkbox.setAttribute("id", `${droplet._id}`);
          checkbox.setAttribute("class", "visually-hidden toggle");

          const innerCheckboxDiv = document.createElement("div");
          innerCheckboxDiv.setAttribute("class", "inner-checkbox-div")

          const label = document.createElement("Label");
          label.setAttribute("for", `${droplet._id}`)
          const dropletDiv = document.createElement("div");
          dropletDiv.setAttribute("class", "delete-droplet-div")
          const bodySubDiv = document.createElement("div");
          const tsSubDiv = document.createElement("div");
          bodySubDiv.appendChild(document.createTextNode(droplet.body));
          tsSubDiv.appendChild(document.createTextNode(droplet.ts));
          dropletDiv.appendChild(bodySubDiv);
          dropletDiv.appendChild(tsSubDiv);
          label.appendChild(dropletDiv);

          const listElem = document.createElement("div");
          listElem.appendChild(checkbox);
          listElem.appendChild(innerCheckboxDiv);
          listElem.appendChild(label);
          list.appendChild(listElem);
        }

      }
      // setup click event handler
      const conf = document.getElementById("confirm");
      conf.addEventListener("click", async (event) => {
        const selected = document.querySelectorAll(".toggle:checked");
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