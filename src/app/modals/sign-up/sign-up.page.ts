import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/providers/config/config.service';
import { ModalController, Platform } from '@ionic/angular';
import { LoadingService } from 'src/providers/loading/loading.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { TermServicesPage } from '../term-services/term-services.page';
import { RefundPolicyPage } from '../refund-policy/refund-policy.page';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy.page';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  formData = {
    customers_firstname: '',
    customers_lastname: '',
    email: '',
    password: '',
    confirmpassword: '',
    customers_telephone: '',
    customers_picture: '',
    mobile_no: '',
    otp: ''
  };
  image = "";
  errorMessage = '';
  consumerKeyEncript: any;
  consumerSecretEncript: any;
  mobileno = "";
  isMobileVerified = false;
  isOtpVerified = false;
  Verified = false;
  constructor(
    public http: HttpClient,
    public config: ConfigService,
    public modalCtrl: ModalController,
    public loading: LoadingService,
    public shared: SharedDataService,
    public platform: Platform,
    private camera: Camera

  ) {
    this.shared.currentOpenedModel = this;
  }
  registerUser() {
    // if(this.formData.password==this.formData.confirmpassword){
    //   alert('Password and Confirm password is not match !')
    // }
    this.loading.show();

    this.errorMessage = '';
    this.formData.customers_picture = this.image;
    // this.formData.customers_telephone=this.customers_telephone;
    //debugger
    this.http.post(this.config.url + 'processregistration', this.formData).subscribe((data: any) => {
      debugger
      this.loading.hide();
      if (data.success == 1) {
        this.shared.login(data.data[0]);
        //this.config.customerData = data.data[0];
        this.dismiss();
      }
      if (data.success == 0) {
        this.errorMessage = data.message;
      }
    });
  }
  onOtpVerification(customers_telephone) {
    this.loading.show();
    this.errorMessage = '';
    localStorage.setItem('customers_telephone', customers_telephone);


    this.config.postHttp('verifymobile', this.formData).then((data: any) => {
      debugger
      this.loading.hide();
      if (data.success == 1) {
        this.shared.toast(data.message);
        this.isMobileVerified = true;
        this.isOtpVerified = true;
      }
      if (data.success == 0) {
        // this.errorMessage = data.message;
        this.shared.toast(data.message);
        this.isMobileVerified = false;
        this.isOtpVerified = false;

      }
    });
  }
  onConfirmOtp(otp) {
    // let modal = this.modalCtrl.create(SignUpPage);
    // modal.present();
    // this.dismiss();

    this.loading.show();
    this.errorMessage = '';

    var mobile_num = localStorage.getItem('customers_telephone')
    // console.log(mobile_num);
    this.formData.customers_telephone = mobile_num;

    this.config.postHttp('confirmmobile', { mobile_no: mobile_num, otp:otp}).then((data: any) => {
      debugger
      this.loading.hide();
      if (data.success == 1) {
        this.shared.toast(data.message);
        this.Verified = true;
        this.isOtpVerified = false;
      }
      if (data.success == 0) {
        // this.errorMessage = data.message;
        this.shared.toast(data.message);
        this.Verified = false;
        this.isOtpVerified = true;

      }
    });
  }
  // openActionSheet() {
  //   debugger
  //   this.translate.get(["Camera", "Gallery", "Cancel", "Choose"]).subscribe(async (res) => {
  //     const actionSheet = await this.actionSheetCtrl.create({
  //       buttons: [
  //         {
  //           text: res["Camera"],
  //           icon: 'camera',
  //           handler: () => {
  //             this.openCamera("camera");
  //           }
  //         }, {
  //           text: res["Gallery"],
  //           icon: 'image',
  //           handler: () => {
  //             this.openCamera("gallery");
  //           }
  //         }, {
  //           text: res["Cancel"],
  //           icon: 'close',
  //           role: 'cancel',
  //           handler: () => {
  //           }
  //         }
  //       ]
  //     });
  //     actionSheet.present();
  //   });
  // }
  openCamera() {
     
    const options: CameraOptions = {
      quality: 80,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true,
      targetWidth: 100,
      targetHeight: 100,
      saveToPhotoAlbum: false,
      correctOrientation: true
    }
    this.platform.ready().then(() => {

      this.camera.getPicture(options).then((imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64:
        this.image = 'data:image/jpeg;base64,' + imageData;
        // // console.log(base64Image);

      }, (err) => { });
    });
  }
  async  openPrivacyPolicyPage() {
    let modal = await this.modalCtrl.create({
      component: PrivacyPolicyPage
    });
    return await modal.present();
  }
  async  openTermServicesPage() {
    let modal = await this.modalCtrl.create({
      component: TermServicesPage
    });
    return await modal.present();
  }
  async  openRefundPolicyPage() {
    let modal = await this.modalCtrl.create({
      component: RefundPolicyPage
    });
    return await modal.present();
  }
  async dismiss() {
    this.modalCtrl.dismiss();
  }

  ngOnInit() {
  }

}
