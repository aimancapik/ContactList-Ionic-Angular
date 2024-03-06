import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  Usercontacts: any[] = []; // Initialize contacts as an empty array
  filteredContacts: any[] = []; // Initialize filtered contacts array
  searchTerm: string = ''; // Initialize search term
  currentPage: number = 1; // Initialize current page number
  pageSize: number = 5// Initialize page size

  constructor(
    private router: Router,
    private http: HttpClient,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    // Load contacts when the component initializes
    this.loadContacts();
  }

  ionViewWillEnter() {
    // Load contacts every time the user navigates back to this page
    this.loadContacts();
  }

  async doRefresh(event: any) {
    // Call loadContacts method to refresh contacts
    this.currentPage = 1;
    this.pageSize = 5;
    await this.loadContacts();

    // Complete the refresh event to hide the spinner
    if (event) {
      event.target.complete();
    }
  }

  async loadContacts() {
    const loading = await this.loadingController.create({
      message: 'Loading contacts...',
    });
    await loading.present();

    this.http
      .get<any>(
        `https://localhost:7138/api/Contacts?page=${this.currentPage}&pageSize=${this.pageSize}`
      )
      .subscribe(
        (response) => {
          this.Usercontacts = response; // Assign the response to the contacts array
          this.filteredContacts = [...this.Usercontacts]; // Initialize or update filtered contacts array
          loading.dismiss(); // Dismiss the loading spinner
        },
        (error) => {
          console.error('Error loading contacts:', error);
          loading.dismiss(); // Dismiss the loading spinner
        }
      );
  }

  async confirmDeleteContact(contact: any) {
    const alert = await this.alertController.create({
      header: 'Confirm Deletion',
      message: `Are you sure you want to delete ${contact.fullName}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Delete',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Deleting contact...',
            });
            await loading.present();

            this.http
              .delete<any>(`https://localhost:7138/api/Contacts/${contact.id}`)
              .subscribe(
                () => {
                  // If the deletion is successful, reload the contacts
                  this.loadContacts();
                  loading.dismiss();
                },
                (error) => {
                  console.error('Error deleting contact:', error);
                  loading.dismiss();
                }
              );
          },
        },
      ],
    });

    await alert.present();
  }


  navigateToAddContactPage() {
    this.router.navigateByUrl('/add-contact');
  }

  navigateToEditPage(contact: any) {
    this.router.navigate(['/editcontact'], { state: { contact } });
  }

  // Method to filter contacts based on search term
  filterContacts(searchTerm: string | null | undefined) {
    if (!searchTerm || searchTerm.trim() === '') {
      // If search term is empty or undefined, display all contacts
      this.filteredContacts = [...this.Usercontacts];
    } else {
      // Filter contacts based on search term for either name or phone number
      searchTerm = searchTerm.toLowerCase(); // Convert search term to lowercase for case-insensitive search
      this.filteredContacts = this.Usercontacts.filter(
        (contact) =>
          contact.fullName.toLowerCase().includes(searchTerm) || // Check for name
          contact.phone.includes(searchTerm) // Check for phone number
      );
    }
  }

  // Method to load more contacts on infinite scroll
  async loadMoreContacts(event: any) {
    this.currentPage++; // Increment current page number
    await this.http
      .get<any>(
        `https://localhost:7138/api/Contacts?page=${this.currentPage}&pageSize=${this.pageSize}`
      )
      .subscribe(
        (response) => {
          this.Usercontacts = [...this.Usercontacts, ...response]; // Append new contacts to the existing contacts array
          this.filteredContacts = [...this.Usercontacts]; // Update filtered contacts array
          event.target.complete(); // Complete the infinite scroll event
        },
        (error) => {
          console.error('Error loading more contacts:', error);
          event.target.complete(); // Complete the infinite scroll event
        }
      );
  }
}
