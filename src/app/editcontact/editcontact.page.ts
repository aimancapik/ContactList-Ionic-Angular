import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-editcontact',
  templateUrl: './editcontact.page.html',
  styleUrls: ['./editcontact.page.scss'],
})
export class EditcontactPage {
  contact: any = { fullName: '', email: '', phone: '' };

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient // Inject HttpClient for making HTTP requests
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      const navigation = this.router.getCurrentNavigation();
      if (navigation && navigation.extras.state) {
        this.contact = navigation.extras.state['contact'];
      }
    });
  }

  saveChanges() {
    // Send a PUT request to update the contact
    this.http.put(`https://localhost:7138/api/Contacts/${this.contact.id}`, this.contact)
      .subscribe(
        (response) => {
          console.log('Contact updated successfully:', response);
        
          this.router.navigate(['/home'])
        },
        (error) => {
          console.error('Error updating contact:', error);
        }
      );
  }
}
