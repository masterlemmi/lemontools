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
  fileToUpload;

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
    } else {

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

    if (this.person.id) {
      this.fileToUpload = files.item(0);
      this.uploadPhoto();
    }
  }

  uploadPhoto() {
    if (this.fileToUpload) {
      console.log("uploading photo");
      this.uploadingPhoto = true;

      this.peopleService.uploadPhoto(this.person.id, this.fileToUpload).subscribe(
        data => {
          this.uploadingPhoto = false;
        },
        err => {
          console.log(err);
          this.uploadingPhoto = false;
        }
      )
    }
  }
}