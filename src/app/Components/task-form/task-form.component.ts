import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserModel } from '../../Model/user';
import { UserService } from '../../Services/user.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  userList: UserModel[] = [];
   editMode: boolean = false;
  task: UserModel = {
    assignedTo: "",
    status: "not started",
    dueDate: new Date(),
    priority: "normal",
    comments: "",
  };

  Assignedtolist: string[] = ["user1", "user2", "user3", "user4"];
  statuslist: string[] = ["not started", "in progress", "completed"];
  prioritylist: string[] = ["normal", "low", "high"];

  constructor(private _userService: UserService, private _toasterService: ToastrService,private _route: ActivatedRoute,
    private _router: Router) {}

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.getTaskDetails(id);
     } 
    // else {
    //   this.getUserList(); // Get user list only when adding a new task
    // }
  }
  getUserList() {
    this._userService.getUsers().subscribe((res) => {
      this.userList = res;
    });
  }
  getTaskDetails(id: string) {
    this._userService.getUserById(id).subscribe(
      (userData: UserModel) => {
        this.task = { ...userData }; // Load the user data into the task object
        // this.getUserList(); // Fetch user list for the select options
      },
      (error) => {
        console.error('Error fetching user data:', error);
        this._toasterService.error('Error fetching user data: ' + error.message, 'Error');
      }
    );
  }
  
  onSubmit(taskForm: NgForm): void {
    if (this.editMode) {
      // Make sure the user has an ID for updating
      if (this.task.id) {
          this._userService.updateUser(this.task).subscribe(() => {
              this.getUserList();
              this._toasterService.success('User updated successfully', 'Success');
              this.editMode = false;
              taskForm.reset();
          }, (error) => {
              this._toasterService.error('Error updating user: ' + error.message, 'Error');
          });
      } else {
          this._toasterService.error('User ID is missing for update', 'Error');
      }
  } else {
      this._userService.addUser(this.task).subscribe(() => {
          this.getUserList();
          this._toasterService.success('User added successfully', 'Success');
          taskForm.reset();
      });
  }
  }
  onEdit(userData: UserModel) {
    this.task = { ...userData };  // Spread operator to clone object, preventing two-way binding issues
    this.editMode = true;
  }

  onDelete(id: any) {
    if (confirm('Are you sure you want to delete this user?')) {
      this._userService.deleteUser(id).subscribe(() => {
        this.getUserList();
        this._toasterService.error('User deleted successfully', 'Deleted');
      });
    }
  }

}
