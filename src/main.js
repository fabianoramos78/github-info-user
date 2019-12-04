import api from './api'

class App {
  constructor() {
    this.repositories = []

    this.formElement = document.getElementById('repo-form')
    this.inputElement = document.querySelector('input[name=repository]')
    this.listElement = document.getElementById('repo-list')

    this.registerHandlers()
  }

  registerHandlers() {
    this.formElement.onsubmit = event => this.addRepository(event)
  }

  setLoading(loading = true) {
    if (loading === true) {
      let loadingElement = document.createElement('span')
      loadingElement.appendChild(document.createTextNode('Carregando'))
      loadingElement.setAttribute('id', 'loading')

      this.formElement.appendChild(loadingElement)
    } else {
      document.getElementById('loading').remove()
    }
  }

  async addRepository(event) {
    event.preventDefault()

    const user = this.inputElement.value

    if (user.length === 0) return

    this.setLoading()

    try {
      const response = await api.get('/users/' + user)

      const { name, bio, html_url, avatar_url } = response.data

      this.repositories.push({
        name,
        bio,
        avatar_url,
        html_url,
      })

      this.inputElement.value = ''

      this.render()

    } catch (error) {

      alert(`Usuário "${user}" nao encontrado no diretório do GitHub`)

    }

    this.setLoading(false)

  }

  render() {
    this.listElement.innerHTML = ''

    this.repositories.forEach(usuario => {
      let imgElement = document.createElement('img')
      imgElement.setAttribute('src', usuario.avatar_url)

      let titleElement = document.createElement('strong')
      titleElement.appendChild(document.createTextNode(usuario.name))

      let descriptionElement = document.createElement('p')
      descriptionElement.appendChild(document.createTextNode(usuario.bio))

      let linkElement = document.createElement('a')
      linkElement.setAttribute('target', '_blank')
      linkElement.setAttribute('href', usuario.html_url)
      linkElement.appendChild(document.createTextNode('Acessar'))

      let listItemElement = document.createElement('li')
      listItemElement.appendChild(imgElement)
      listItemElement.appendChild(titleElement)
      listItemElement.appendChild(descriptionElement)
      listItemElement.appendChild(linkElement)

      this.listElement.appendChild(listItemElement)
    })
  }

}

new App()