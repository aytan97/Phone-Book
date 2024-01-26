let formEl = document.querySelector("#form-data");
let inputs = document.querySelectorAll("input");
let addContact = document.getElementById("add-contact");

addContact.addEventListener("click", (event) => {
  event.preventDefault();
  let emptyInputs = [];

  inputs.forEach((input) => {
    if (input.value === "") {
      input.setAttribute(
        "style",
        "border: 1px solid transparent; box-shadow: 0 0 3px red"
      );

      emptyInputs.push(input);

      setTimeout(() => {
        input.removeAttribute("style");
      }, 2000);
    }
  });

  if (emptyInputs.length === 0) {
    const formData = new FormData(formEl);
    const data = Object.fromEntries(formData);

    fetch("http://localhost:3000/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => console.error(err));

    inputs.forEach((input) => (input.value = ""));
  } 
  
  else {
    emptyInputs[0].focus();
  }
});

let tableRoot = document.querySelector("root");

let tble = document.createElement("table");
tableRoot.appendChild(tble);

let tbleHeader = document.createElement("thead");
tble.appendChild(tbleHeader);

let tbleHead = document.createElement("tr");
tbleHeader.appendChild(tbleHead);

let tbleBody = document.createElement("tbody");
tbleBody.classList.add("tbody")
tble.appendChild(tbleBody);

fetch("http://localhost:3000/user")
  .then((res) => res.json())
  .then((json) => {
    json.map((data) => {
      postTableData(data);
    });
  });

let tableHeadNames = {
  "fname": "First Name",
  "lname": "Last Name",
  "tel": "Telephone",
  "email": "Email",
  "action": "Actions"
}

function postTableData(tableData) {

    Object.assign(tableData, { Action: "false" })
   // console.log(tableData);
    // let newTableData =
  if (Object.keys(tableData).length > 0) {
    for (let i = 1; i <= Object.keys(tableData).length; i++) {
      let existingHeaderCell = tbleHead.querySelector(
        `th[data-column="${Object.keys(tableData)[i]}"]`
      );
      if (!existingHeaderCell && i < Object.keys(tableData).length) {
        let tbleHeadElements = document.createElement("th");
        tbleHeadElements.setAttribute("data-column", Object.keys(tableData)[i]);
        let headElementText = document.createTextNode(
          `${Object.values(tableHeadNames)[i-1]}`
        );
        tbleHeadElements.appendChild(headElementText);
        tbleHead.appendChild(tbleHeadElements);
      }
      
    }
  }

  if (Object.values(tableData).length > 0) {
    let tableRow = tbleBody.insertRow();
    tableRow.classList.add("data-row");

    for (let i = 1; i < Object.values(tableData).length; i++) {
      if (i < Object.values(tableData).length-1) {
        let tableDataCell = tableRow.insertCell();  
        let tableDataText = document.createTextNode(
          `${Object.values(tableData)[i]}`
        );
        tableDataCell.appendChild(tableDataText);
      } else {
        
        let deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-btn");
        deleteButton.appendChild(document.createTextNode("Delete"));
        let updateButton = document.createElement("button");
        updateButton.classList.add("update-btn");
        updateButton.appendChild(document.createTextNode("Update"));
        let actionCell = tableRow.insertCell();
        actionCell.appendChild(deleteButton);
        actionCell.appendChild(updateButton);
      }
    }
  }
}


tableRoot.classList.add("container");

tble.classList.add(
  "table",
  "table-hover",
  "shadow-sm",
  "rounded"
);
tbleHead.classList.add("row", "text-break");

let popUp=document.createElement("div");

let overlay=document.createElement("div");

setTimeout(() => {
document.querySelectorAll(".delete-btn").forEach((btn, index) => btn.addEventListener("click", () => {
popUp.setAttribute("id", "pop-up");
    document.querySelector("body").appendChild(popUp);

    let popUpInfo = document.createElement("div");
    document.querySelector("#pop-up").appendChild(popUpInfo);
    popUpInfo.classList.add("pop-up-info");

    let popUpInfoHThree = document.createElement("h3");
    document.querySelector(".pop-up-info").appendChild(popUpInfoHThree);
    popUpInfoHThree.appendChild(document.createTextNode("Selected contact will be deleted"));
    let popUpInfoHTwo = document.createElement("h2");
    document.querySelector(".pop-up-info").appendChild(popUpInfoHTwo);
    popUpInfoHTwo.appendChild(document.createTextNode("Are you sure to proceed?"));
    
    let popUpDecision = document.createElement("div");
    document.querySelector("#pop-up").appendChild(popUpDecision);
    popUpDecision.classList.add("pop-up-decision");

    let popUpDecisionYes = document.createElement("button");
    document.querySelector(".pop-up-decision").appendChild(popUpDecisionYes);
    popUpDecisionYes.appendChild(document.createTextNode("Yes"));

    let popUpDecisionNo = document.createElement("button");
    document.querySelector(".pop-up-decision").appendChild(popUpDecisionNo);
    popUpDecisionNo.appendChild(document.createTextNode("No"));

    document.querySelector("body").appendChild(overlay);
    overlay.classList.add("overlay");
    
    document.querySelector(".pop-up-decision").childNodes.forEach(item => item.addEventListener("click", actionResponce))

    document.querySelector(".pop-up-decision").childNodes[0].addEventListener("click", function(){
    actionRemove(index)
  }  )

}))

}, 1000)



function actionResponce() {
    document.querySelector("body").removeChild(popUp);
    popUp.innerHTML = "";
    document.querySelector("body").removeChild(overlay);

}

function actionRemove(index){
//console.log(document.querySelectorAll(".data-row")[index])
console.log(index);

fetch("http://localhost:3000/user")
  .then((res) => res.json())
  .then((json) => {
   let id= json[index].id
  //console.log(json[index].id);
  removeFromServer(id)
  });


document.querySelector("tbody").removeChild(document.querySelectorAll(".data-row")[index])

}

function removeFromServer(id) {
  //console.log(data)
  //const resourceId =id; 
fetch(`http://localhost:3000/user/${id}`, {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
    
  },
  
})
.then(response => {
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
})
.then(data => {
 
  console.log('Deleted successfully', data);
})
.catch(error => {
 
  console.error('Error deleting resource:', error);
});

}


setTimeout(() => {
  document.querySelectorAll(".update-btn").forEach((btn, index) => {btn.addEventListener("click", function(){
    updateRow(index) //from table row
  })
}
  )
  
  }, 1000)

         let updateData = document.createElement("button")
         updateData.appendChild(document.createTextNode("Update"))
         updateData.classList.add("update-data")
         updateData.setAttribute("type", "click")

          let cancelChange = document.createElement("button")
          cancelChange.appendChild(document.createTextNode("Cancel"))
          cancelChange.classList.add("cancel-change")
          cancelChange.setAttribute("type", "click")
         

function updateRow(index){
  console.log(index)
  formEl.removeChild(addContact)

  formEl.appendChild(updateData)
  formEl.appendChild(cancelChange)

  fetch("http://localhost:3000/user")
  .then((res) => res.json())
  .then((json) => {
    console.log(json[index].fname)
      let firstName = document.getElementById("fname")
      firstName.value = json[index].fname

      let lastName = document.getElementById("lname")
      lastName.value = json[index].lname

      let tel = document.getElementById("tel")
      tel.value = json[index].tel

      let email = document.getElementById("email")
      email.value = json[index].email

      let id = json[index].id
      updateData.addEventListener("click",function(){
        updateRowData(id)
      })

});


}

function resetInputs(){
  formEl.appendChild(addContact)
  formEl.removeChild(updateData)
  formEl.removeChild(cancelChange)
 }

cancelChange.addEventListener("reset", function() {
  resetInputs();
})



function updateRowData(id) {
  alert("Updated")
  
  const formData = new FormData(formEl);
  const data = Object.fromEntries(formData);
console.log(data);
  fetch(`http://localhost:3000/user/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(response => response.json())
    .then(updatedResource => {
      console.log('Resource updated:', updatedResource);
    })
    .then(formEl => console.log(formEl))
    .catch(error => {
      console.error('Error updating resource:', error);
    });

    resetInputs();
    inputs.forEach(input =>  input.value = '')

}




  let findMediaRule = document.styleSheets[0].cssRules

    for (const rule of findMediaRule) {
      if (rule instanceof CSSMediaRule) {
        console.log('Media Rule:', rule.media.mediaText);
    
        if (rule.media.mediaText.includes('(max-width: 930px)')) {
          console.log('Entered if condition');
          
          document.querySelectorAll(".data-row").forEach(tr => {
            let fieldsetTableRow = document.createElement('fieldset');
            fieldsetTableRow.style.zIndex = "1000";
            tr.appendChild(fieldsetTableRow);
    
            let legendRow = document.createElement('legend');
            legendRow.appendChild(document.createTextNode("Contact details"));
            fieldsetTableRow.appendChild(legendRow);
    
       
          });
        } else {
          console.log('Media query does not have max-width: 560px');
        }
      }
    }
  

  

    

