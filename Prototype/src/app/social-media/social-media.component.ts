import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-social-media',
  templateUrl: './social-media.component.html',
  styleUrls: ['./social-media.component.sass']
})
export class SocialMediaComponent implements OnInit {
  @Output() socialMedia = new EventEmitter<boolean>();
  
  public socialMediaForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.socialMediaForm = this.formBuilder.group({
      currency: ['', Validators.required],
      StartDate: ['', Validators.required],
      EndDate: ['', Validators.required]
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  get f() { return this.socialMediaForm.controls; }

  public onSubmit() {
    console.log(this.f.currency.value + this.f.StartDate.value + this.f.EndDate.value);
    this.socialMedia.emit(true);
    return false;
    // if (this.loginForm.valid) {
      
    // }
  }
}

