import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './shared/common/api.service';
import { Student, StudentForm } from './shared/models/student.model';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly resource = 'students';

  title = 'Student CRUD';
  students: Student[] = [];
  form: StudentForm = this.emptyForm();
  isEditing = false;
  isLoading = false;
  errorMessage = '';
  isDialogOpen = false;

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.apiService.getAll<Student>(this.resource).subscribe({
      next: (data) => {
        this.students = data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load students.';
        this.isLoading = false;
      }
    });
  }

  saveStudent(): void {
    if (!this.form.name.trim() || !this.form.email.trim()) {
      this.errorMessage = 'Name and Email are required.';
      return;
    }

    this.errorMessage = '';
    if (this.isEditing && this.form.id) {
      const payload = this.toPayloadWithId();
      this.apiService.update(this.resource, payload.id, payload).subscribe({
        next: () => {
          this.resetForm();
          this.loadStudents();
          this.closeDialog();
        },
        error: () => {
          this.errorMessage = 'Failed to update student.';
        }
      });
      return;
    }

    const payload = this.toPayload();
    this.apiService.create<Student>(this.resource, payload).subscribe({
      next: () => {
        this.resetForm();
        this.loadStudents();
        this.closeDialog();
      },
      error: () => {
        this.errorMessage = 'Failed to create student.';
      }
    });
  }

  editStudent(student: Student): void {
    this.form = {
      id: student.id,
      name: student.name,
      email: student.email,
      phone: student.phone,
      address: student.address
    };
    this.isEditing = true;
    this.errorMessage = '';
    this.openDialog();
  }

  deleteStudent(student: Student): void {
    this.errorMessage = '';
    this.apiService.delete(this.resource, student.id).subscribe({
      next: () => {
        this.loadStudents();
      },
      error: () => {
        this.errorMessage = 'Failed to delete student.';
      }
    });
  }

  cancelEdit(): void {
    this.resetForm();
    this.closeDialog();
  }

  private resetForm(): void {
    this.form = this.emptyForm();
    this.isEditing = false;
  }

  openDialog(): void {
    this.isDialogOpen = true;
  }

  startAdd(): void {
    this.resetForm();
    this.openDialog();
  }

  closeDialog(): void {
    this.isDialogOpen = false;
  }

  private emptyForm(): StudentForm {
    return {
      name: '',
      email: '',
      phone: '',
      address: ''
    };
  }

  private toPayload(): StudentForm {
    return {
      name: this.form.name.trim(),
      email: this.form.email.trim(),
      phone: this.form.phone?.trim() || null,
      address: this.form.address?.trim() || null
    };
  }

  private toPayloadWithId(): Student {
    return {
      id: this.form.id ?? 0,
      ...this.toPayload()
    };
  }
}
