export interface UserModel {
  id?:number;
  assignedTo: string;  
  status: string;     
  dueDate: Date;       
  priority: string;   
  comments: string; 
}
