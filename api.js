const url = 'https://api.github.com/users/'
let dataLogin = []
const wrapper = document.getElementById('wrapper')
const search = document.getElementById('search')
const btn = document.getElementById('btn')
const cont = document.getElementById('cont')



const renderError = (boolean) => {
  
  const div=document.createElement('div')

  boolean ? div.textContent = 'Enter name' : div.textContent='User has founded'
  div.classList.add('modaler')
  div.classList.add('show')
  wrapper.prepend(div)

  const deleteClass = () => div.remove()
  setTimeout(deleteClass, 3000)
 
}

const openUser = (div,user) => {
  div.onclick = function() {
    window.open('apiPage.html?login='+user.login)
  }
}


const creatUser = (user) => {

 
  dataLogin.push(user.login.toLowerCase())

  const div = document.createElement('div')
  const divB = document.createElement('div')
  const divC = document.createElement('div')
  const img = document.createElement('img')
  const name = document.createElement('p')
  const repo = document.createElement('p')
  
  
  img.src=user.avatar_url
  user.name ? name.textContent=user.name : name.textContent='User no name'
  repo.textContent='Repo:' + user.public_repos
  div.classList.add('positioned')

  openUser(divB,user)
  

  div.appendChild(img)
  divB.appendChild(name)
  divC.appendChild(repo)
  div.appendChild(divB)
  div.appendChild(divC)
  cont.prepend(div)

  localStorage.setItem('users', JSON.stringify(dataLogin))
  
}


const getUser = (login)=> {

fetch(url +login)
    .then((json)=>{
      return  json.status == 200 ? json.json() : Promise.reject('Error')
    })
    .then(creatUser)
    .catch(console.log)
}


const searchUsers = ()=>{

  if (search.value.trim() == '') return renderError(true)

  if (dataLogin.includes(search.value.toLowerCase())) return renderError(false)
  
  getUser(search.value.trim())
  search.value=''
}

btn.addEventListener('click', searchUsers);
search.addEventListener('keydown', function(e){
  if (e.keyCode === 13 ) return searchUsers()
});




(function(){
  const arr = JSON.parse(localStorage.getItem('users'))
  if (!arr) return;

  Promise.all(arr.map(login => getUser(login)))
  
})()