// Для всех страниц кабнета добавляем один файл скрптов - account.js

// Change user password --- START
const initChangePassFormToggles = () => {
    let btns = document.querySelectorAll('#changePasswordForm .account__form-toggle-pass')
    btns = Array.from(btns)

    btns.forEach(el => el.addEventListener('click', function() {
        const input = this.parentNode.querySelector('input')

        if (input.type === 'text') {
            input.type = 'password'
            this.classList.remove('pass-visible')
        } else {
            input.type = 'text'
            this.classList.add('pass-visible')
        }
    }))
}

const blockChangePassForm = () => {
    let button = document.querySelector('#changePasswordForm .account__form-button button')
    button.disabled = true

    setTimeout(() => button.disabled = false, 5000)
}

const changePasswordFormData = {
    currentLength: true,
    newLength: true,
    isEqual: true
}

const resetAllErrorsPasswordForm = () => {
    let controllers = document.querySelectorAll('#changePasswordForm .account__form-controller')
    controllers = Array.from(controllers)
    controllers.forEach(el => el.classList.remove('has-error'))
}

const checkPassLength = (value) => {
    return value.length >= 8
}

const addInputPassHandler = (input) => {
    input.addEventListener('input', () => {
        const container = input.closest('.account__form-controller')
        container.classList.remove('has-error')
    })
}

const checkChangePassForm = (currentInput, newInput) => {
    const isFormValid = changePasswordFormData.currentLength
        && changePasswordFormData.newLength
        && changePasswordFormData.isEqual

    const controllerCurrent = currentInput.closest('.account__form-controller')
    const currentError = controllerCurrent.querySelector('.account__form-error')

    const controllerNew = newInput.closest('.account__form-controller')
    const newError = controllerNew.querySelector('.account__form-error')

    if (!changePasswordFormData.currentLength) {
        currentError.innerText = 'Пароль должен содержать минимум 8 символов'
        controllerCurrent.classList.add('has-error')
    }

    if (!changePasswordFormData.newLength) {
        newError.innerText = 'Пароль должен содержать минимум 8 символов'
        controllerNew.classList.add('has-error')
    } else {
        if(!changePasswordFormData.isEqual) {
            newError.innerText = 'Пароли должны совпадать'
            controllerNew.classList.add('has-error')
        }
    }

    changePasswordFormData.currentLength = true
    changePasswordFormData.newLength = true
    changePasswordFormData.isEqual = true

    return isFormValid
}

const initChangePasswordForm = () => {
    const form = document.querySelector('#changePasswordForm')

    if (!form) return

    const currentPass = form.querySelector('#currentPass')
    const newPass = form.querySelector('#newPass')

    // Handlers
    addInputPassHandler(currentPass)
    addInputPassHandler(newPass)

    form.addEventListener('submit', function(e) {

        // Check value length
        changePasswordFormData.currentLength = checkPassLength(currentPass.value)
        changePasswordFormData.newLength= checkPassLength(newPass.value)
        changePasswordFormData.isEqual = currentPass.value === newPass.value

        // Check form
        if (checkChangePassForm(currentPass, newPass)) {
            resetAllErrorsPasswordForm()
            console.log('Fetching request for updating user password');

            window.showModalMsg('Изменение пароля', 'Пароль был успешно изменен')
            blockChangePassForm()
        }
    })
}
// Change user password --- FINISH

// Update user data --- START
const setErrorOnUserDataController = (inputNode, errorText) => {
    const container = inputNode.closest('.account__form-controller')
    const message = container.querySelector('.account__form-error')

    container.classList.add('has-error')
    message.innerText = errorText

    inputNode.addEventListener('input', () => {
        container.classList.remove('has-error')
    })
}

const resetErrorOnUserDataController = (inputNode) => {
    const container = inputNode.closest('.account__form-controller')
    container.classList.remove('has-error')
}

const blockUserDataForm = () => {
    let button = document.querySelector('#changeUserDataForm .account__form-button button')
    button.disabled = true

    setTimeout(() => button.disabled = false, 5000)
}

const initChangeUserDataForm = () => {
    const form = document.getElementById('changeUserDataForm')

    if (!form) return

    const formValid = {name: true, phone: true, email: true}
    
    
    
    
    // const phoneNumber = form.querySelector('[name="phone"]')

    // // Phone masking
    // const phoneMaskOptions = {
    //     mask: '+{7} (000) 000-00-00',
    //     lazy: true,
    //     placeholderChar: '#'
    // }
    // const phoneMask = IMask(
    //     phoneNumber,
    //     phoneMaskOptions
    // )

    // phoneNumber.addEventListener('focus', () => phoneMask.updateOptions({lazy: false}))
    // phoneNumber.addEventListener('blur', () => phoneMask.updateOptions({lazy: true}))







    form.addEventListener('submit', function(e) {

        const name  = this.querySelector('[name="name"]')
        const phone = this.querySelector('[name="phone"]')
        const email = this.querySelector('[name="email"]')

        // Check name
        if (name.value === '') {
            setErrorOnUserDataController(name, 'Заполните поле ФИО')
            formValid.name = false
        } else {
            resetErrorOnUserDataController(name)
            formValid.name = true
        }

        // Check phone
        if (phone.value === '') {
            setErrorOnUserDataController(phone, 'Заполните поле Телефон')
            formValid.phone = false
        } else {
            if (window.validatePhone(window.clearPhone(phone.value))) {
                resetErrorOnUserDataController(phone)
                formValid.phone = true
            } else {
                setErrorOnUserDataController(phone, 'Некорректный номер телефона')
                formValid.phone = false
            }
        }

        // Check email
        if (email.value !== '') {
            if (window.validateEmail(email.value)) {
                resetErrorOnUserDataController(email)
                formValid.email = true
            } else {
                setErrorOnUserDataController(email, 'Некорректный адрес электронной почты')
                formValid.email = false
            }
        } else {
            resetErrorOnUserDataController(email)
            formValid.email = true
        }

        // Senging form data
        if (formValid.name && formValid.phone && formValid.email) {

            const formData = new FormData(form);

            // Обязательно удалить после внедрения
            for (let [name, value] of formData) {
                console.log(`${name}: ${value}`);
            }

            console.log('Fetching request for updating user data');

            window.showModalMsg('Личные данные', 'Личные данные изменены')
            blockUserDataForm()
        }
    })
}
// Update user data --- FINISH

window.addEventListener('load', () => {
    // Change user password
    initChangePassFormToggles()
    initChangePasswordForm()

    // Update user data
    initChangeUserDataForm()
})