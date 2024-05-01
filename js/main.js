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
        },
        arr:{
            type: Array,
            required: true,
        }
    },
    template:`
        <div class="column">
            <h2>{{ column_name }}</h2>
            <div class="task_space" v-if="arr.length" v-for="(task, index) in arr">
                <h2>{{task.title}}</h2>
                <p><input type="checkbox" @click="checkboxClick(index, 1)">{{task.task1}}</p>
                <p><input type="checkbox" @click="checkboxClick(index, 2)">{{task.task2}}</p>
                <p><input type="checkbox" @click="checkboxClick(index, 3)">{{task.task3}}</p>
                <p v-if="task.task4"><input type="checkbox" @click="checkboxClick(index, 4)">{{task.task4}}</p>
                <p v-if="task.task5"><input type="checkbox" @click="checkboxClick(index, 5)">{{task.task5}}</p>
            </div>
        </div>
    `,
    data() {
        return {    

        }
    },
    methods:{
        checkboxClick(firstId, secondId){
            let el;
            firstId = parseInt(firstId);

            el = this.arr[firstId];
                
            if(el){
                switch(secondId){
                    case 1:
                        el.active.task1 = !el.active.task1;
                        break;
                    case 2:
                        el.active.task2 = !el.active.task2;
                        break;
                    case 3:
                        el.active.task3 = !el.active.task3;
                        break;
                    case 4:
                        el.active.task4 = !el.active.task4;
                        break;
                    case 5:
                        el.active.task5 = !el.active.task5;
                        break;
                }
                eventBus.$emit('check-activity', firstId, this.id);
                console.log(el.active);
            }
        },
    },
    computed: {
        
    },
    mounted(){
    
        
    }
})

Vue.component('creator', {
    template: `
        <div class="form_box">
            <form class="review-form">
                <div class="errors_output" v-if="{hidden: errors}" v-for="er in errors">
                    <p v-if="{hidden: errors}">{{ er }}</p>
                </div>
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
            errors: [],
            count1:[],    
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
    mounted(){
        eventBus.$on('checkCount1Response', function(count){
            this.count1 = count;
        }.bind(this))
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
            eventBus.$emit('checkCount1');
            this.errors = [];
            if(!this.list.title){
                this.errors.push("Добавьте заголовок.");
            }
            if(!this.list.task1 || !this.list.task2 || !this.list.task3){
                this.errors.push("Первые три задачи обязательны к заполнению.");
            }

            if(!(this.errors).length){
                if(this.count1 < 3){
                    let copy = Object.assign({}, this.list)
                    eventBus.$emit('form-created', copy);
                    // console.log(this.count1);

                    this.list.title = null; 
                    this.list.task1 = null; 
                    this.list.task2 = null;
                    this.list.task3 = null;
                    this.list.task4 = null;
                    this.list.task5 = null;
                    
                }else{
                    this.errors = ['Достигнуто максимальное колличество списков в первом столбце.'];
                }
                
            }
            
        }
    }
})
 


let app = new Vue({
    el: '#app',
    data(){
        return {
            tasks :[],
            tasks_in_process: [],
            tasks_finished: [],
        }
    },
    mounted(){
        eventBus.$on('form-created',function(list){
            let activity = {};

            for(key in list){
                if(list[key] && key!='title'){
                    activity[key] = false;
                }
            }
            list.active = activity;
            this.tasks.push(list);
            // console.log(list);
            // console.log(list.active);
            
        }.bind(this)),


        eventBus.$on('checkCount1',function(){
            if(this.id=='first'){
                eventBus.$emit('checkCount1Response', (this.tasks).length);
                // console.log("(this.tasks).length) " + (this.tasks).length);
            }
        }.bind(this)),


        eventBus.$on('check-activity', function(index, columnId){
            console.log("Событие дошло до рута, начинается проверка ативности.");
            console.log("index = " + index + ", columnId = " + columnId);
            let list;
            let overTasks;
            let actTasks = 0;
            
            if(columnId == 'first'){
                list=this.tasks[index];
                console.log("Событие произошло в столбце - " + columnId);
                console.log(`Переданный индекс = ${index} , его тип данных ${typeof(index)}`);
            }else if(columnId == 'second'){
                list=this.tasks_in_process[index];
                console.log("Событие произошло в столбце - " + columnId);
                console.log(`Переданный индекс = ${index} , его тип данных ${typeof(index)}`);
            }

            overTasks = Object.keys(list.active).length;
            for(let key in list.active){
                if(list.active[key]){
                    actTasks +=1;
                }   
            }
            console.log(`Переменная overTasks = ${overTasks}`);
            console.log(`Переменная actTasks = ${actTasks}`);

            let blank = Object.assign({}, this.tasks[index]);
            this.tasks_in_process.push(blank);
            console.log("Список задач был перемещен в следующую колонку.");
            console.log("tasks - " + this.tasks);
            console.log("tasks_in_process - " + this.tasks_in_process);

            

        }.bind(this))
    }    
 })