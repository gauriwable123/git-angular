import { Routes } from '@angular/router';
import { UserComponent } from './Components/user/user.component';
import { TaskFormComponent } from './Components/task-form/task-form.component';

export const routes: Routes = [
    
    {
        path:'user',
        component:UserComponent
    },
    {
        path:'task-form',
        component:TaskFormComponent
    },
    {
        path: 'task-form/:id', // Capture the 'id' parameter
        component: TaskFormComponent
    },
    {
        path:'',
        redirectTo:'app',
        pathMatch:'full'
    }
];
