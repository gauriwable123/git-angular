import { Component, OnInit } from '@angular/core';
import { UserModel } from '../../Model/user';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../Services/user.service';
import { ToastrService } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-user',
  standalone: true,
  imports: [FormsModule, CommonModule,RouterModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  userList: UserModel[] = [];
  editMode: boolean = false;
  user: UserModel = {
    assignedTo: "",
    status: "",
    dueDate: new Date(),
    priority: "",
    comments: "",
  };

  Assignedtolist: string[] = ["user1", "user2", "user3", "user4"];
  statuslist: string[] = ["not started", "in progress", "completed"];
  prioritylist: string[] = ["normal", "low", "high"];

  constructor(private _userService: UserService, private _toasterService: ToastrService) { }

  ngOnInit(): void {
    this.getUserList();
  }

  getUserList() {
    this._userService.getUsers().subscribe((res) => {
      this.userList = res;
    });
  }

  onSubmit(uform: NgForm): void {
    if (this.editMode) {
        // Make sure the user has an ID for updating
        if (this.user.id) {
            this._userService.updateUser(this.user).subscribe(() => {
                this.getUserList();
                this._toasterService.success('User updated successfully', 'Success');
                this.editMode = false;
                uform.reset();
            }, (error) => {
                this._toasterService.error('Error updating user: ' + error.message, 'Error');
            });
        } else {
            this._toasterService.error('User ID is missing for update', 'Error');
        }
    } else {
        this._userService.addUser(this.user).subscribe(() => {
            this.getUserList();
            this._toasterService.success('User added successfully', 'Success');
            uform.reset();
        });
    }
}


  onEdit(userData: UserModel) {
    this.user = { ...userData };  // Spread operator to clone object, preventing two-way binding issues
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
