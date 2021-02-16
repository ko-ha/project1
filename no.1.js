
const storageName = 'data'

class Counter {

    constructor(title, desc) {
        this.title = title
        this.desc = desc
        this.counter = 0
    }

    create() {

        const li = document.createElement('li')
        li.classList.add('target-li')
        const h3 = document.createElement('h3')
        h3.innerText = this.title
        li.appendChild(h3)
        const p1 = document.createElement('p')
        p1.innerText = this.desc
        li.appendChild(p1)
        const p2 = document.createElement('p')
        p2.className = 'counter-value'
        p2.innerText = this.counter
        li.appendChild(p2)

        const btnHol = document.createElement('div')
        btnHol.className = 'count-buttons'
        const minus = Counter.createButton('count-btn', '-', this.update) // 呼び出し元
        const plus = Counter.createButton('count-btn', '+', this.update)
        btnHol.appendChild(minus)
        btnHol.appendChild(plus)
        li.appendChild(btnHol)

        return li
    }

    update(e) {
        const { target } = e // 
        const li = target.parentNode.parentNode
        const counterValue = li.querySelector('.counter-value')
        if (target.innerText === '+') counterValue.innerText = ++counterValue.innerText
        else counterValue.innerText = --counterValue.innerText
    }

    static createButton(cls, txt, fn) {
        const btn = document.createElement('button')
        btn.className = cls
        btn.innerText = txt
        btn.addEventListener('click', fn)
        return btn
    }

}

class UI {

    static show() {
        const counters = Storage.read()
        counters.forEach(({ title, desc }) => {
            const cnt = new Counter(title, desc)
            UI.append(cnt.create())
            UI.hiddeMessage()
        })
    }

    static append(li) {  //この li はパラメーター
        const ulTarget = document.getElementById('target')
        ulTarget.appendChild(li)
    }

    static clearForm() {
        document.querySelector('#modal input[name="title"]').value = ''
        document.querySelector('#modal input[name="description"]').value = ''
    }

    static clearList() {
        const ulTarget = document.getElementById('target')
        ulTarget.innerHTML = ''
    }

    static toggle() {
        document.getElementById('modal').classList.toggle('hidden')
    }

    static hiddeMessage() {
        document.querySelector('.message')
        .classList.add('hidden')
        document.getElementById('target')
        .classList.remove('hidden')
    }

    static showMessage() {
        document.querySelector('.message')
        .classList.remove('hidden')
        document.getElementById('target')
        .classList.add('hidden')
    }

    static fillBoth () {
        const fillBth = 'Please fill in both fields'
        return window.alert(fillBth)
    }

    static confirm() {
        const resetOk = 'Are you sure you want to reset?'
        return window.confirm(resetOk)
    }
}

class Storage {

    static add(counter) {
        const tmp = Storage.read()
        tmp.push(counter)
        Storage.save(tmp)
    }

    static read() {
        const localData = localStorage.getItem(storageName)
        if (localData) return JSON.parse(localData)
        return[]
    }

    static clear() {
        localStorage.removeItem(storageName)
    }

    static save(data) {
        const dataString = JSON.stringify(data)
        localStorage.setItem(storageName, dataString)
    }
}

function toggle() {
    UI.toggle()
}

function reset() {

    const confirmed = UI.confirm()
    if (!confirmed) return console.log('cancelled!')

    Storage.clear()

    UI.clearForm()
    UI.clearList()
    UI.showMessage()
}

function addCounter(e) {  // e = submit
    
    e.preventDefault()

    const title = document.querySelector('#modal input[name="title"]').value
    const desc = document.querySelector('#modal input[name="description"]').value
    
    const cntr = new Counter(title, desc)
    if (!(title && desc)) return UI.fillBoth()
    UI.append(cntr.create()) // パラメーターliに値を渡してる
    

    UI.hiddeMessage()

    Storage.add(cntr)
    UI.clearForm()
    UI.toggle()
}

