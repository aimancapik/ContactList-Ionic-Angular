import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';

import { EditcontactPageRoutingModule } from './editcontact-routing.module';

import { EditcontactPage } from './editcontact.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditcontactPageRoutingModule,
    HttpClientModule
  ],
  declarations: [EditcontactPage]
})
export class EditcontactPageModule {}
