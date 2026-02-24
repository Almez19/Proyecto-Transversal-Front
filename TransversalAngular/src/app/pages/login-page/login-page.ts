import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../service/login-service';
@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {


  loginService = inject (LoginService);

  modelForm : FormGroup;

  constructor(){

    this.modelForm = new FormGroup({

      email : new FormControl (null, [ Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$' ) ] ) ,
      contrasena : new FormControl (null, [ Validators.required,/* Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&._-])[A-Za-z\\d@$!%*?&._-]{8,}$') */] ),


  })

  }

  getDataForm() {

    this.loginService.login(

      {
        email: this.modelForm.value.email,
        contrasena: this.modelForm.value.contrasena,

      }

    )

  }

}
