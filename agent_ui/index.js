function fetchmsg(){

    var url = 'http://localhost:80/send-msg';
     
     const data = new URLSearchParams();
     for (const pair of new FormData(document.getElementById("myMsg"))) {
         data.append(pair[0], pair[1]);
         console.log(pair)
     }
   
     console.log("abc",data)
       fetch(url, {
         method: 'POST',
         body:data
       }).then(res => res.json())
        .then(response => {
         console.log(response);
         var par = document.createElement("p");
         var text = document.createTextNode(response.Reply);
         par.appendChild(text);
         document.body.appendChild(par);
         
        })
         .catch(error => console.error('Error h:', error));
}

document.getElementById('myMsg').onsubmit = (e)=>{
    e.preventDefault()
    fetchmsg()
}