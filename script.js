let allIssues = []

// LOGIN
function login(){

const user = document.getElementById("username").value
const pass = document.getElementById("password").value

if(user === "admin" && pass === "admin123"){

document.getElementById("loginPage").classList.add("hidden")
document.getElementById("mainPage").classList.remove("hidden")

loadIssues()

}else{

alert("Wrong credentials")

}

}


// LOAD ALL ISSUES
async function loadIssues(){

document.getElementById("loader").classList.remove("hidden")

const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
const data = await res.json()

allIssues = data.data

updateCounts()

displayIssues(allIssues)

document.getElementById("loader").classList.add("hidden")

}


// UPDATE COUNTS
function updateCounts(){

const open = allIssues.filter(i => i.status === "open").length
const closed = allIssues.filter(i => i.status === "closed").length

document.getElementById("allCount").innerText = allIssues.length
document.getElementById("openCount").innerText = open
document.getElementById("closedCount").innerText = closed

}


// DISPLAY CARDS
function displayIssues(issues){

const container = document.getElementById("issueContainer")

container.innerHTML = ""

issues.forEach(issue => {

const border =
issue.status === "open"
? "border-t-4 border-green-500"
: "border-t-4 border-purple-500"

const card = `
<div onclick="openModal(${issue.id})"
class="card bg-base-100 shadow cursor-pointer ${border}">

<div class="card-body">

<h2 class="card-title">${issue.title}</h2>

<p>${issue.description.slice(0,70)}...</p>

<p class="text-sm">Author: ${issue.author}</p>

<p class="text-sm">Priority: ${issue.priority}</p>

<p class="text-sm">Status: ${issue.status}</p>

</div>

</div>
`

container.innerHTML += card

})

}


// FILTER
function filterIssues(type){

setActive(type)

let filtered = allIssues

if(type === "open"){
filtered = allIssues.filter(i => i.status === "open")
}

if(type === "closed"){
filtered = allIssues.filter(i => i.status === "closed")
}

displayIssues(filtered)

}


// ACTIVE BUTTON
function setActive(type){

document.getElementById("allBtn").classList.remove("btn-primary")
document.getElementById("openBtn").classList.remove("btn-primary")
document.getElementById("closedBtn").classList.remove("btn-primary")

if(type === "all") document.getElementById("allBtn").classList.add("btn-primary")
if(type === "open") document.getElementById("openBtn").classList.add("btn-primary")
if(type === "closed") document.getElementById("closedBtn").classList.add("btn-primary")

}


// SEARCH
async function searchIssue(){

const text = document.getElementById("searchInput").value

const res = await fetch(
`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`
)

const data = await res.json()

displayIssues(data.data)

}


// MODAL
async function openModal(id){

const res = await fetch(
`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`
)

const data = await res.json()

const issue = data.data

document.getElementById("modalTitle").innerText = issue.title
document.getElementById("modalDesc").innerText = issue.description
document.getElementById("modalAuthor").innerText = "Author: " + issue.author
document.getElementById("modalPriority").innerText = "Priority: " + issue.priority
document.getElementById("modalLabel").innerText = "Label: " + issue.label
document.getElementById("modalStatus").innerText = "Status: " + issue.status
document.getElementById("modalDate").innerText = "Created: " + issue.createdAt

document.getElementById("issueModal").showModal()

}


// CLOSE MODAL
function closeModal(){
document.getElementById("issueModal").close()
}