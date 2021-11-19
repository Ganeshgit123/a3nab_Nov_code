import { Injectable } from '@angular/core';
import { Router,CanActivate,ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { ApiCallService } from '../services/api-call.service';
import Swal from 'sweetalert2';

@Injectable()
export class RoleGuardService implements CanActivate {
  loginRole:any
  adminRolesArray :any;
  expectedRoleaaAdmin: string;
  constructor( public router: Router, private apiCall: ApiCallService,) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRole = route.data.expectedRole;
    const token = sessionStorage.getItem('permission');
    if(token) {
      this.adminRolesArray = JSON.parse(token)
      this.expectedRoleaaAdmin = '';
      for(let i=0; i<this.adminRolesArray.length; i++){
          let currentPermission = this.adminRolesArray[i].permissionName+this.adminRolesArray[i].readOpt
        if ( currentPermission === expectedRole) {
          this.expectedRoleaaAdmin = currentPermission    
        }
      }
     
      if ( this.expectedRoleaaAdmin !== expectedRole) {
       this.apiCall.showToast('You are not authorized to access !!', 'Error', 'errorToastr')
       this.router.navigate([''], {
          queryParams: {
            return: state.url
        }
      });
        return false;
      }
      return true;
      
    }
    // decode the token to get its payload
    return true;
  }
}