import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Person } from '../models/person';
import { PeopleService } from '../services/people.service';
import { DatePipe, Location } from '@angular/common';
import { MatAccordion } from '@angular/material/expansion';
import { PersonSimple } from '../models/person-simple';
import { Name } from '../models/names';
import { Observable } from 'rxjs/Observable';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  person: Person = history.state.data;
  profilePhoto: any;
  uploadingPhoto: boolean = false;
  photoFileName: string = '';
  fileToUpload: any;

  constructor(
    private peopleService: PeopleService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private _location: Location,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {

  }

  ngOnInit(): void {
    this.person = history.state.data;
    const id = this.route.snapshot.paramMap.get('personId');
    if (!this.person) { //no data to show as edit return to profile
      this.router.navigate([`/people/profile/${id}`]);
    } 
  }



  back() {
    this._location.back();
  }


  onFileChanged(event) {
    const files = event.target.files;
    if (files.length === 0)
      return;

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {

      this._snackBar.open("Only images are allowed", '', {
        duration: 10000,
        horizontalPosition: 'start',
        verticalPosition: 'top'
      });
      return;
    }

    const reader = new FileReader();
    let imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.profilePhoto = reader.result;
    }

    this.fileToUpload = files.item(0);

    if (this.person.id) { //in edit mode
      this.uploadPhoto().subscribe(
        data => {
          this.uploadingPhoto = false;
          this.photoFileName = data.data;
        },
        err => {
          console.log(err);
          this.uploadingPhoto = false;
        }
      );
    }
  }

  uploadPhoto() {
    if (this.fileToUpload) {
      console.log("uploading photo");
      this.uploadingPhoto = true;
      return this.peopleService.uploadPhoto(this.person.id, this.fileToUpload);
    }
  }


  submitForm(form: FormGroup) {

    if (this.photoFileName) { //image was uploaded successfully so add the name to dto also
     console.log("there is a photofileName of " + this.photoFileName)
      form.patchValue({
        photo: this.photoFileName
      });
    } else {  //no upload was made to server because there was nothing to upload or because it was in add mode
      if (this.fileToUpload) { // add mode has photo in memory

        console.log("there is a pending file to upload");
        this.uploadPhoto().subscribe(
          data => {
            this.uploadingPhoto = false;
            this.photoFileName = data.data;
            //update form with the uploaded photo filename
            form.patchValue({
              photo: this.photoFileName
            });
          },
          err => {
            console.log(err);
            this.uploadingPhoto = false;
          }
        )
      }

    }



    this.peopleService.createOrUpdatePerson(form.value).subscribe(
      data => {
        this._snackBar.open("Success", '', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        this._location.back();
      },
      err => {
        this._snackBar.open("Error " + err, '', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });

      }
    )
  }
}