let eventBus = new Vue()


Vue.component('column', {
    props:{
        column_name: {
            type : String,
            required : true
        },
        id: {
            type: String,
            required: true,
        }
    },
    template:`
        <div class="column">
            <h2>{{ column_name }}</h2>
            <div class="task_space" v-if="tasks" v-for="task in tasks">
                <h3>{{task.title}}</h3>
                <p>{{task.task1}}</p>
                <p>{{task.task2}}</p>
                <p>{{task.task3}}</p>
                <p v-if="task.task4">{{task.task4}}</p>
                <p v-if="task.task5">{{task.task5}}</p>
            </div>
            <div>

            </div>
        </div>
    `,
    data() {
        return {    
            tasks :[],
            activity:[],
        }
    },
    mounted(){
        eventBus.$on('form-created',function(list){
            if(this.id == 'first'){
                let activity = {};
                let counter=0;
                for(key in list){
                    activity.counter = false;
                    counter++;
                }
                list.done = activity;
                this.tasks.push(list);
                console.log(list.done);
            }
        }.bind(this))
    }
})

Vue.component('creator', {
    template: `
        <div class="form_box">
            <form class="review-form">
                <p class="large_input">
                    <label for="name"><b>Заголовок:</b></label>
                    <input type="text" id="name" v-model="list.title" name="title">
                </p>
                <p class="regular_input">
                    <label for="name">Задача-1:</label>
                    <input type="text" id="tasks" v-model="list.task1" name="task1">
                </p>
                <p class="regular_input">
                    <label for="name">Задача-2:</label>
                    <input type="text" id="tasks" v-model="list.task2" name="task2">
                </p>
                <p class="regular_input">
                    <label for="name">Задача-3:</label>
                    <input type="text" id="tasks" v-model="list.task3" name="task3">
                </p>
                <p class="regular_input"  v-if="!hiddenFlag4">
                    <label for="name">Задача-4:</label>
                    <input type="text" id="tasks" v-model="list.task4" name="task4">
                </p>
                <p class="regular_input"  v-if="!hiddenFlag4 && !hiddenFlag5">
                    <label for="name">Задача-5:</label>
                    <input type="text" id="tasks" v-model="list.task5" name="task5" >
                </p>
                <button class="btn" @click.prevent="addTask" v-if="hiddenFlag5">+++</button><br>
                <button class="btn" @click.prevent="customSubmit">Создать</button>
            </form>
        </div>
  `,
    data() {
        return {
            hiddenFlag4: true,
            hiddenFlag5: true,    
            list: {
                title: null,
                task1: null,
                task2: null,
                task3: null,
                task4: null,
                task5: null,
            },
        }
    },
    methods:{
        addTask(){  
            if(this.hiddenFlag4){
                this.hiddenFlag4 = false;
            }else{
                this.hiddenFlag5 = false;
            }
        },
        customSubmit(){
            let copy = Object.assign({}, this.list)
            eventBus.$emit('form-created', copy);
            this.list.title = null;
            this.list.task1 = null;
            this.list.task2 = null;
            this.list.task3 = null;
            this.list.task4 = null;
            this.list.task5 = null;
        }
    }
})
 


let app = new Vue({
    el: '#app',    
 })