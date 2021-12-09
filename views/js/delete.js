const setupEventHandler = () => {
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
        
        if (response.status === 200) {
          // document.getElementById("banner").innerHTML = "Deleted x elements!";
          // document.getElementById("banner").setAttribute("class", "show");
        }
        // TODO: handle later and inform user gracefully
      });
}
setupEventHandler();