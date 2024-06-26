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
                <p><input type="checkbox" @click="checkboxClick(index, 1)" v-model="arr[index].active.task1" v-if="task">{{task.task1}}</p>
                <p><input type="checkbox" @click="checkboxClick(index, 2)" v-model="arr[index].active.task2" v-if="task">{{task.task2}}</p>
                <p><input type="checkbox" @click="checkboxClick(index, 3)" v-model="arr[index].active.task3" v-if="task">{{task.task3}}</p>
                <p v-if="task.task4"><input type="checkbox" @click="checkboxClick(index, 4)" v-model="arr[index].active.task4">{{task.task4}}</p>
                <p v-if="task.task5"><input type="checkbox" @click="checkboxClick(index, 5)" v-model="arr[index].active.task5">{{task.task5}}</p>
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
            console.log('checkboxClick---------------------');
            console.log(el);
            console.log(el.active);
            console.log(`Переданные данные : columnId- ${this.id}, index- ${firstId}`);
            
            

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
            count1:0,    
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
            
        }.bind(this)),


        eventBus.$on('checkCount1',function(){
            eventBus.$emit('checkCount1Response', (this.tasks).length);
        }.bind(this)),


        eventBus.$on('check-activity', function(index, columnId){
            let list;
            let overTasks;
            let actTasks = 0;
            
            if(columnId == 'first'){
                list=this.tasks[index];
            }else if(columnId == 'second'){
                list=this.tasks_in_process[index];
            }

            if(list != undefined){
                overTasks = Object.keys(list.active).length;
                for(let key in list.active){
                    if(list.active[key]){
                        actTasks +=1;
                    }   
                }

                
                let blank = Object.assign({}, this.tasks[index]);
                
                blank.active = Object.assign({}, this.tasks[index].active)
                console.log("checkActivity-------------------");
                console.log("Копируемый объект и его активность");
                console.log(blank);
                console.log(blank.active);
                console.log(`Переданные данные : columnId- ${columnId}, index- ${index}`);
                if(columnId == 'first'){
                    this.tasks.splice(index, 1);
                    this.tasks_in_process.push(blank);
                }
                
                // eventBus.$emit('tasksPop', index, id);
            }
        }.bind(this)),


        eventBus.$on('tasksPop', function(index, id){
            if(id === 'first'){
                this.tasks.splice(index, 1);
            }else if(id === 'second'){
                this.tasks_in_process.splice(index, 1)
            }
        }.bind(this))
    }    
 })