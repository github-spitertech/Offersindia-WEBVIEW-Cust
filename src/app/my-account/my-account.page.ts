import { Component, OnInit, ApplicationRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/providers/config/config.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { NavController, ActionSheetController, Platform } from '@ionic/angular';
import { LoadingService } from 'src/providers/loading/loading.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { TranslateService} from '@ngx-translate/core';
@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.page.html',
  styleUrls: ['./my-account.page.scss'],
})
export class MyAccountPage implements OnInit {

  myAccountData = {
    customers_firstname: '',
    customers_lastname: '',
    customers_telephone: '',
    currentPassword: '',
    password: '',
    customers_dob: '',
    customers_old_picture: ''
  };
  profilePicture = '';
  passwordData: { [k: string]: any } = {};
  placeholder: string = 'assets/placeholder.png';

  constructor(
    public config: ConfigService,
    public shared: SharedDataService,
    public loading: LoadingService,
    public platform: Platform,
    public translate: TranslateService,
    private camera: Camera,
    public actionSheetCtrl: ActionSheetController,
    ) {
  }

  //============================================================================================  
  //function updating user information
  updateInfo = function () {
     
    //this.shared.customerData.password="1234"
    // // console.log(currenrtPassword + "  " + newPassword);
    // // console.log(this.shared.customerData.password);
    // if (newPassword != "" && currenrtPassword == "") {

    //   this.translate.get("Please Enter Current Password").subscribe((res) => {
    //     this.alert.show(res);
    //   });

    // }
    // else if (currenrtPassword != "" && currenrtPassword != this.shared.customerData.password) {

    //   this.translate.get("Please Enter Current Password Correctly").subscribe((res) => {
    //     this.alert.show(res);
    //   });

    // }
    // else if (newPassword != undefined && newPassword != "" && currenrtPassword != this.shared.customerData.password) {

    //   this.translate.get("Please Enter Current Password Correctly").subscribe((res) => {
    //     this.alert.show(res);
    //   });

    // }
    // else {
    this.loading.show();
    this.myAccountData.customers_id = this.shared.customerData.customers_id;

    if (this.profilePicture == this.config.imgUrl + this.shared.customerData.customers_picture) { //// console.log("old picture");
      // this.myAccountData.customers_picture=$rootScope.customerData.customers_picture;
      this.myAccountData.customers_old_picture = this.shared.customerData.customers_picture;
    }
    else if (this.profilePicture == '')
      this.myAccountData.customers_picture = null;
    else
      this.myAccountData.customers_picture = this.profilePicture;

    var dat = this.myAccountData;
    //  // console.log("post data  "+JSON.stringify(data));
    this.config.postHttp('updatecustomerinfo', dat).then((data: any) => {
debugger
      this.loading.hide();
      if (data.success == 1) {
        //   document.getElementById("updateForm").reset();
        this.shared.toast(data.message);
        this.shared.customerData.customers_firstname = this.myAccountData.customers_firstname;
        this.shared.customerData.customers_lastname = this.myAccountData.customers_lastname;
        this.shared.customerData.customers_telephone = this.myAccountData.customers_telephone;
        this.shared.customerData.customers_picture = data.data[0].customers_picture;

        this.shared.customerData.customers_dob = this.myAccountData.customers_dob;
        if (this.myAccountData.password != '')
          this.shared.customerData.password = this.myAccountData.password;

        this.shared.login(this.shared.customerData);

        this.myAccountData.currentPassword = "";
        this.myAccountData.password = "";
      }
      else {
        this.translate.get(data.message).subscribe((res) => {
          this.shared.toast(res);
        });
      }
    }
      , error => {
        this.loading.hide();
        this.shared.toast("Error while Updating!");
      });
    //}
  }
  openActionSheet() {
     
    this.translate.get(["Camera", "Gallery", "Cancel", "Choose"]).subscribe(async (res) => {
      const actionSheet =await this.actionSheetCtrl.create({
        buttons: [
          {
            text: res["Camera"],
            icon: 'camera',
            handler: () => {
              this.openCamera("camera");
              // console.log('Destructive clicked');
            }
          }, {
            text: res["Gallery"],
            icon: 'image',
            handler: () => {
              this.openCamera("gallery");
              // console.log('Archive clicked');
            }
          }, {
            text: res["Cancel"],
            icon: 'close',
            role: 'cancel',
            handler: () => {
              // console.log('Cancel clicked');
            }
          }
        ]
      });
      actionSheet.present();
    });
  }
  openCamera(type) {
    //  this.profilePicture='data:image/jpeg;base64,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'
       
    this.loading.autoHide(1000);

    let source = this.camera.PictureSourceType.CAMERA;
    if (type == 'gallery')
      source = this.camera.PictureSourceType.PHOTOLIBRARY;

    const options: CameraOptions = {
      quality: 80,
      sourceType: source,
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
         
        this.profilePicture = 'data:image/jpeg;base64,' + imageData;
      }, (err) => { });
    });
  }
  removeImage() {
    this.profilePicture = this.placeholder;
  }
  //============================================================================================

  ionViewWillEnter() {
    this.myAccountData.customers_firstname = this.shared.customerData.customers_firstname;
    this.myAccountData.customers_lastname = this.shared.customerData.customers_lastname;

    this.profilePicture = this.config.imgUrl + this.shared.customerData.customers_picture;
    this.myAccountData.customers_old_picture = this.shared.customerData.customers_picture;
    this.myAccountData.customers_telephone = this.shared.customerData.customers_telephone;
    //this.myAccountData.password = this.shared.customerData.password;
    try {
      // // console.log(this.shared.customerData.customers_dob);
      this.myAccountData.customers_dob = new Date(this.shared.customerData.customers_dob).toISOString();
      // // console.log(this.myAccountData.customers_dob);
    } catch (error) {
      this.myAccountData.customers_dob = new Date("1-1-2000").toISOString();
    }

  }

  ngOnInit() {
  }

}
