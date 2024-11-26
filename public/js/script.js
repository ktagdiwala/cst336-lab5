// Event listeners
let authorLinks = document.querySelectorAll("a");
for (authorLink of authorLinks) {
    authorLink.addEventListener("click", getAuthorInfo);
}

document.querySelector("#searchByLikes").addEventListener("click", validateLikes);

// functions
async function getAuthorInfo(){
    var myModal = new bootstrap.Modal(document.getElementById("authorModal"));
    myModal.show();
    let url = `/api/author/${this.id}`;
    let response = await fetch(url);
    let data = await response.json();
    // console.log(data);
    let authorInfo = document.querySelector("#authorInfo");
    authorInfo.innerHTML = "";
    authorInfo.innerHTML += `<h1> ${data[0].firstName}
                                  ${data[0].lastName}</h1>`;
    authorInfo.innerHTML += `<img src="${data[0].portrait}"
                            width="200"><br>`;
    authorInfo.innerHTML += `<p>Date of Birth: ${data[0].dob}<p>`;
    authorInfo.innerHTML += `<p>Date of Death: ${data[0].dod}<p>`;
    authorInfo.innerHTML += `<p>Sex: ${data[0].sex}<p>`;
    authorInfo.innerHTML += `<p>Profession: ${data[0].profession}<p>`;
    authorInfo.innerHTML += `<p>Country: ${data[0].country}<p>`;
    authorInfo.innerHTML += `<p>${data[0].biography}<p>`;
}

function validateLikes(){
    let lower = document.querySelector("#lower");
    let upper = document.querySelector("#upper");
    let feedback = document.querySelector("#likesFb");
    if(lower.value == "" || upper.value == ""){
        feedback.innerHTML = "Please enter valid numbers";
    }else{
        feedback.innerHTML = "";
    }
}