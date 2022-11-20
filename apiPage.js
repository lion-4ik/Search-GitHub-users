const cont = document.getElementById('cont')
const spinner = document.getElementById('spinner')
const search = document.getElementById('search')
const repositories = document.getElementById('repositories')
const params = new URLSearchParams(window.location.search);
const user = Array.from(params.values())

let reposArr = []


const fixForNull = (value, key, name) => {

  if (!value) return key.textContent = 'User has no ' + name
}

const searchSomeRepos = ({target}) => {
  
  repositories.innerHTML=''
  const value = target.value.toLowerCase();
  const newReposArr = reposArr.filter(item=> item.name.toLowerCase().includes(value))

  if (newReposArr.length === 0) return repositories.textContent = 'Repositories not found';
  newReposArr.forEach(elem=>createTableRepos(elem))
  
}


const createSearchRepos = () => {

  const input = document.createElement('input')
  input.placeholder = 'Search for Users Repositories'
  search.appendChild(input)
  input.oninput = searchSomeRepos

}

const createTableRepos = (rep) => {

  const div = document.createElement('div')
  const divA = document.createElement('div')
  const divB = document.createElement('div')
  const name = document.createElement('a')
  const forks = document.createElement('p')
  const starts = document.createElement('p')

  name.textContent = rep.name
  name.href = rep.html_url
  forks.textContent = rep.forks + ' Forks'
  starts.textContent = rep.stargazers_count + ' Starts'


  divA.appendChild(name)
  divB.appendChild(forks)
  divB.appendChild(starts)
  div.appendChild(divA)
  div.appendChild(divB)
  div.classList.add('positioned')
  divA.classList.add('text-style')

  repositories.appendChild(div)
}

const searchRepos = (repos) => {

  if (repos.length === 0) return repositories.textContent = 'user has no repositories'
  
  createSearchRepos()
  
  repos.forEach(element => {
    reposArr.push(element)
    createTableRepos(element)
  });

}


const isSpinner = (start) => {
  
  spinner.style.display = start ? 'block' : 'none'

}


const getRepos = (reposUrl) => {


  fetch(reposUrl)

    .then(json => {
      return json.status == 200 ? json.json() : Promise.reject('err')
    })
    .then(searchRepos)
    .catch(console.log)

}


const createNewUser = (newUser) => {

  const div = document.createElement('div')
  const img = document.createElement('img')
  const name = document.createElement('p')
  const email = document.createElement('p')
  const location = document.createElement('p')
  const followers = document.createElement('p')
  const following = document.createElement('p')


  img.src = newUser.avatar_url


  name.textContent = newUser.name
  email.textContent = newUser.email
  location.textContent = newUser.location
  followers.textContent = 'followers ' + newUser.followers
  following.textContent = 'following ' + newUser.following

  fixForNull(newUser.name, name, 'name')
  fixForNull(newUser.email, email, 'email')
  fixForNull(newUser.location, location, 'location')


  div.appendChild(name)
  div.appendChild(email)
  div.appendChild(location)
  div.appendChild(followers)
  div.appendChild(following)
  cont.appendChild(div)
  cont.prepend(img)


}


const url = 'https://api.github.com/users/'

const getUser = (login) => {

  fetch(url + login)
    .then((json) => {
      return json.status == 200 ? json.json() : Promise.reject('err')
    })
    .then(createNewUser)
    .catch(console.log)


}


const createAllFetch = ()=> {
  isSpinner(true)
  Promise.all([getUser(user),getRepos(url+user+'/repos')])
  .finally(()=> isSpinner(false))
}

createAllFetch()

