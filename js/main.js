let eventBus = new Vue()

Vue.component('card', {
    props: {
        premium: {
            type: Boolean,
            required: true
        },
        details:{
            type: Array,
            required: true
        }
    },
    data() {
        return {    
            product:'list',
        }
    },
})


Vue.component('list', {
    data() {
        return {    
            product:'list',
        }
    },
})

Vue.component('creator', {
    template: `
        <form class="review-form">
            <p class="large_input">
                <label for="name">Name:</label>
                <input id="name" v-model="name" >
            </p>
            <p class="regular_input">
                <label for="name">Name:</label>
                <input id="tasks" v-model="task" >
            </p>
            <button @click="submit">Добавить</button>

        </form>
  `,
    data() {
        return {    
            name:null,
            tasks:[],
        }
    },
})
 


let app = new Vue({
    el: '#app', 
    data: {

    },
    methods: {
    
     }     
 })