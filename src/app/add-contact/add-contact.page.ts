import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.page.html',
  styleUrls: ['./add-contact.page.scss'],
})
export class AddContactPage implements OnInit {
  contactForm!: FormGroup; // Form group for the contact form
  saveAttempted: boolean = false; // Flag to track whether the save action has been attempted

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    // Initialize the contact form with validation rules
    this.contactForm = this.formBuilder.group({
      contactName: ['', Validators.required], // Name field with required validation
      contactEmail: ['', [Validators.required, Validators.email]], // Email field with required and email validation
      contactPhone: [
        '', // Phone field with required, pattern, and length validation
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(10),
          Validators.maxLength(11),
        ],
      ],
    });
  }

  // Method to check if a form field is invalid
  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return (
      !!field?.invalid && (field.dirty || field.touched || this.saveAttempted)
    );
  }

  // Method to get error messages for form fields
  getErrorMessage(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'This field is required';
    } else if (fieldName === 'contactEmail' && field?.hasError('email')) {
      return 'Please enter a valid email address';
    } else if (fieldName === 'contactPhone' && field?.hasError('pattern')) {
      return 'Please enter a valid phone number';
    }
    return '';
  }

  // Method to save contact
  saveContact() {
    this.saveAttempted = true;

    // Check if the form is invalid
    if (this.contactForm.invalid) {
      console.error('Please fill all required fields correctly.');
      return;
    }

    // Prepare the body for the HTTP POST request
    const body = {
      fullName: this.contactForm.value.contactName,
      email: this.contactForm.value.contactEmail,
      phone: this.contactForm.value.contactPhone,
    };

    // Send POST request to save the contact
    this.http.post('https://localhost:7138/api/Contacts', body).subscribe(
      (response) => {
        console.log('Contact saved successfully:', response);
        // Navigate back to home page after saving
        this.router.navigate(['/home']);
        // Reset the form after saving
        this.contactForm.reset();
      },
      (error) => {
        console.error('Error saving contact:', error);
      }
    );
  }
}
