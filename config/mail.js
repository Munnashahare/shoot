// send grid //
var sgMail = require('@sendgrid/mail');
sgMail.setApiKey("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");

module.exports.registrationMail = function (email, name) {
  console.log("Registration Email " + email);
  const msg = {
    to: email,
    from: 'info@shootservices.in',
    subject: 'Greetings from SHOOT',
    html: `<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
        <meta charset="UTF-8">
        <meta content="width=device-width, initial-scale=1" name="viewport">
        <meta name="x-apple-disable-message-reformatting">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta content="telephone=no" name="format-detection">
        <title></title>
        <!--[if (mso 16)]>conffi
        <style type="text/css">
        a {text-decoration: none;}
        </style>
        <![endif]-->
        <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]-->
        <!--[if gte mso 9]>
    <xml>
        <o:OfficeDocumentSettings>
        <o:AllowPNG></o:AllowPNG>
        <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->
    </head>
    
    <body>
        <div class="es-wrapper-color">
            <!--[if gte mso 9]>
          <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
            <v:fill type="tile" color="#eeeeee"></v:fill>
          </v:background>
        <![endif]-->
            <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0">
                <tbody>
                    <tr>
                        <td class="esd-email-paddings" valign="top">
                            <!-- <table class="es-content esd-header-popover" cellspacing="0" cellpadding="0" align="center">
                                <tbody>
                                    <tr></tr>
                                    <tr>
                                        <td class="esd-stripe" esd-custom-block-id="7954" align="center">
                                            <table class="es-content-body" style="background-color: transparent;" width="600" cellspacing="0" cellpadding="0" align="center">
                                                <tbody>
                                                    <tr>v
                                                        <td class="esd-structure es-p15t es-p15b es-p10r es-p10l" align="left">
                                                            <table class="es-left" cellspacing="0" cellpadding="0" align="left">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="esd-container-frame" width="282" align="left">
                                                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td class="es-infoblock esd-block-text es-m-txt-c" align="left">
                                                                                            <p style="font-family: arial, helvetica\ neue, helvetica, sans-serif;"><br></p>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <table class="es-right" cellspacing="0" cellpadding="0" align="right">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="esd-container-frame" width="278" align="left">
                                                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td align="right" class="es-infoblock esd-block-text es-m-txt-c" esd-links-underline="underline">
                                                                                            <p><a href="https://www.google.com/maps/uv?pb=!1s0x3bc2bbaab9085397%3A0x4cdc8959c0c56a9b!3m1!7e115!4shttps%3A%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipNpSmQv9uBGz4p9bbG5U7Qbhms-OrrpzF-WaiXY%3Dw230-h160-k-no!5sfirst%20crowd%20private%20limited%20-%20Google%20Search!15sCgIgAQ&imagekey=!1e10!2sAF1QipNpSmQv9uBGz4p9bbG5U7Qbhms-OrrpzF-WaiXY&hl=en&sa=X&ved=2ahUKEwiKzoTR5LjvAhX0X3wKHZYWD2wQoiowCnoECBUQAw" target="_blank" class="view" style="font-family: arial, 'helvetica neue', helvetica, sans-serif; text-decoration: underline;">View in browser</a></p>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            [if mso]></td></tr></table><![endif]
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table> -->
                            <table class="es-content" cellspacing="0" cellpadding="0" align="center">
                                <tbody>
                                    <tr></tr>
                                    <tr>
                                        <td class="esd-stripe" esd-custom-block-id="7681" align="center">
                                            <table class="es-header-body" style="background-color: #1b9ba3;" width="600" cellspacing="0" cellpadding="0" bgcolor="#1b9ba3" align="center">
                                                <tbody>
                                                    <tr>
                                                        <td class="esd-structure es-p35t es-p35b es-p35r es-p35l" align="left">
                                                            <!--[if mso]><table width="530" cellpadding="0" cellspacing="0"><tr><td width="340" valign="top"><![endif]-->
                                                            <table class="es-left" cellspacing="0" cellpadding="0" align="left">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="es-m-p0r es-m-p20b esd-container-frame" width="340" valign="top" align="center">
                                                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td class="esd-block-text es-m-txt-c" align="left">
                                                                                            <h2 style="color: #ffffff; line-height: 100%; font-family: 'open sans', 'helvetica neue', helvetica, arial, sans-serif;">&nbsp;&nbsp;Greetings from SHOOT!</h2>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <!--[if mso]></td><td width="20"></td><td width="170" valign="top"><![endif]-->
                                                            <table cellspacing="0" cellpadding="0" align="center">
                                                                <tbody>
                                                                    <tr class="es-hidden">
                                                                        <td class="es-m-p20b esd-container-frame" esd-custom-block-id="7704" width="170" align="center">
                                                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td class="esd-block-spacer es-p5b" align="center" style="font-size:0">
                                                                                            <table width="100%" height="100%" cellspacing="0" cellpadding="0" border="0">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td style="border-bottom: 1px solid #1b9ba3; background: rgba(0, 0, 0, 0) none repeat scroll 0% 0%; height: 1px; width: 100%; margin: 0px;"></td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <!-- <tr>
                                                                                        <td>
                                                                                            <table cellspacing="0" cellpadding="0" align="right">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td align="left">
                                                                                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                                                                                <tbody>
                                                                                                                    <tr>
                                                                                                                        <td class="esd-block-text" align="right">
                                                                                                                            <p><a target="_blank" style="font-size: 18px; line-height: 120%;" href="https://www.shootservices.in/">Shop</a></p>
                                                                                                                        </td>
                                                                                                                    </tr>
                                                                                                                </tbody>
                                                                                                            </table>
                                                                                                        </td>
                                                                                                        <td class="esd-block-image es-p10l" valign="top" align="left" style="font-size:0"><a href="https://www.shootservices.in/" target="_blank"><img src="https://tlr.stripocdn.email/content/guids/CABINET_75694a6fc3c4633b3ee8e3c750851c02/images/77981522050090360.png" alt style="display: block;" width="27"></a></td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr> -->
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <!--[if mso]></td></tr></table><![endif]-->
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table class="es-content" cellspacing="0" cellpadding="0" align="center">
                                <tbody>
                                    <tr>
                                        <td class="esd-stripe" align="center">
                                            <table class="es-content-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center">
                                                <tbody>
                                                    <tr>
                                                        <td class="esd-structure es-p40t es-p35r es-p35l" esd-custom-block-id="7685" align="left">
                                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="esd-container-frame" width="530" valign="top" align="center">
                                                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td class="esd-block-text es-m-txt-l es-p15t" align="left">
                                                                                            <h3>Dear Customer,</h3>
                                                                                            <!-- <h3>Greetings from SHOOT!</h3> -->
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td class="esd-block-text es-p15t es-p10b" align="left">
                                                                                            <p style="font-size: 14px; color: #777777; font-family: 'open sans', 'helvetica neue', helvetica, arial, sans-serif;">Welcome aboard to the world of photography.<br><br>SHOOT is an on-demand photography app to make it easy for customers to book expert photographers and help photographers to grow their business and portfolio.<br> Let's capture every moment, from the little ones to the big ones.Take a peek at our app platform and be left in awe.</p>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td class="esd-block-spacer es-p20t es-p15b" align="center" style="font-size:0">
                                                                                            <table width="100%" height="100%" cellspacing="0" cellpadding="0" border="0">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td style="border-bottom: 3px solid #eeeeee; background: rgba(0, 0, 0, 0) none repeat scroll 0% 0%; height: 1px; width: 100%; margin: 0px;"></td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="esd-structure es-p30t es-p35b es-p35r es-p35l" esd-custom-block-id="7685" align="left">
                                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="esd-container-frame" width="530" valign="top" align="center">
                                                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td class="esd-block-text" align="center">
                                                                                            <h2 style="color: #333333;">What Shoot Offers?</h2>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td class="esd-block-text es-p15t" align="left">
                                                                                            <p style="font-size: 16px; color: #777777;"><li>We help your Photography business grow.</li></p>
                                                                                            <p style="font-size: 16px; color: #777777;"><li>We provide a retail platform for arts, banners & printing products.</li></p>
                                                                                            <p style="font-size: 16px; color: #777777;"><li>Setup your services & products as you need using our specially designed platform.</li></p>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td class="esd-block-text" align="center">
                                                                                            <h2 style="color: #333333;">How Shoot Works?</h2>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td class="esd-block-text es-p15t" align="left">
                                                                                            <p style="font-size: 16px; color: #777777;"><li>Setup your shop in the app.</li></p>
                                                                                            <p style="font-size: 16px; color: #777777;"><li>Provide your services & its prices.</li></p>
                                                                                            <p style="font-size: 16px; color: #777777;"><li>Show your availability.</li></p>
                                                                                            <p style="font-size: 16px; color: #777777;"><li>Get yourself highlighted by going premium.</li></p>
                                                                                          </td>
                                                                                    </tr>
                                                                                    <!-- <tr>
                                                                                        <td class="esd-block-button es-p30t es-p15b" align="center"><span class="es-button-border" style="background: #ed8e20 none repeat scroll 0% 0%;"><a href="https://www.thefirstcrowd.com/" class="es-button" target="_blank" style="font-weight: normal; border-width: 15px 30px; background: #ed8e20 none repeat scroll 0% 0%; border-color: #ed8e20; color: #ffffff; font-size: 18px;">Confirm account</a></span></td>
                                                                                    </tr> -->
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table cellpadding="0" cellspacing="0" class="es-footer" align="center">
                                <tbody>
                                    <tr>
                                        <td class="esd-stripe" esd-custom-block-id="7684" align="center">
                                            <table class="es-footer-body" width="600" cellspacing="0" cellpadding="0" align="center">
                                                <tbody>
                                                    <tr>
                                                        <td class="esd-structure es-p35t es-p40b es-p35r es-p35l" align="left">
                                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="esd-container-frame" width="530" valign="top" align="center">
                                                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                                                <tbody>
                                                                                    <!-- <tr>
                                                                                        <td class="esd-block-image es-p15b" align="center" style="font-size:0"><a target="_blank"><img src="https://tlr.stripocdn.email/content/guids/CABINET_75694a6fc3c4633b3ee8e3c750851c02/images/12331522050090454.png" alt="Shoot logo" style="display: block;" title=Shoot logo" width="37"></a></td>
                                                                                    </tr> -->
                                                                                    <!-- <tr>
                                                                                        <td class="esd-block-text es-p35b" align="center">
                                                                                            <p><strong>D-403 Royal  Entrada </strong></p>
                                                                                            <p><strong>Wakad, Pune 411057</strong></p>
                                                                                        </td>
                                                                                    </tr> -->
                                                                                    <tr>
                                                                                        <td esdev-links-color="#777777" align="left" class="esd-block-text es-m-txt-c es-p5b">
                                                                                            <p style="color: #777777;">If you face any problem in activating your account please contact us at&nbsp;<u><a href="mailto:support@shootservices.in?subject=Re:%20Need%20Assistance%20Answer&body=Email%20Body%20Text">support@shootservices.in</a></u></p>
                                                                                            <!-- <p style="color: #777777;">If you face any problem in activating your account please contact us at&nbsp;<u><a href="" target="_blank" class="view" style="text-decoration: underline;">support@shootservices.in</a></u></p> -->
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td esdev-links-color="#000000" align="left" class="esd-block-text es-m-txt-c es-p5b">
                                                                                            <p style="color: #000000;">Regards,<br>Team SHOOT<br><u><a href="https://www.shootservices.in" target="_blank" class="view" style="text-decoration: underline;">www.shootservices.in</a></u></p>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table class="es-content" cellspacing="0" cellpadding="0" align="center">
                                <tbody>
                                    <tr>
                                        <td class="esd-stripe" align="center">
                                            <table class="es-content-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center">
                                                <tbody>
                                                    <tr>
                                                        <td class="esd-structure es-p15t es-p35r es-p35l" align="left">
                                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="esd-container-frame" width="530" valign="top" align="center">
                                                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td class="esd-block-image" align="center" style="font-size:0"><a target="_blank"><img src="https://tlr.stripocdn.email/content/guids/CABINET_75694a6fc3c4633b3ee8e3c750851c02/images/18501522065897895.png" alt style="display: block;" width="46"></a></td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table class="es-content" cellspacing="0" cellpadding="0" align="center">
                                <tbody>
                                    <tr>
                                        <td class="esd-stripe" esd-custom-block-id="7766" align="center">
                                            <table class="es-content-body" style="border-bottom:10px solid #48afb5;background-color: #1b9ba3;" width="600" cellspacing="0" cellpadding="0" bgcolor="#1b9ba3" align="center">
                                                <tbody>
                                                    <tr>
                                                        <td class="esd-structure" align="left">
                                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="esd-container-frame" width="600" valign="top" align="center">
                                                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td class="esd-block-menu">
                                                                                            <table class="es-menu" width="40%" cellspacing="0" cellpadding="0" align="center">
                                                                                                <tbody>
                                                                                                    <tr class="links-images-top"></tr>
                                                                                                        <!-- <td class="esd-block-text es-m-txt-l es-p15t" align="center">
                                                                                                            <h3 style="color: #ffffff;"> <a target="_blank" href="https://www.shootservices.in/">www.shootservices.in</a></h3>
                                                                                                        </td> -->
                                                                                                         <td class="esd-block-text es-m-txt-l es-p15t" align="center">
                                                                                                            <h4 style="color: #ffffff;">Capturing Moments Creating Art</h4>
                                                                                                         </td>
                                                                                                    </tr>
                                                                                                    <!-- <tr>
                                                                                                        <td class="esd-block-text es-m-txt-c" align="left">
                                                                                                            <h2 style="color: #ffffff; line-height: 100%; font-family: 'open sans', 'helvetica neue', helvetica, arial, sans-serif;">&nbsp&nbspGreetings from SHOOT!</h2>
                                                                                                        </td>
                                                                                                    </tr> -->
                                                                                                    <!-- <tr class="links-images-top">
                                                                                                        <td class="es-p10t es-p10b es-p5r es-p5l " style="padding-bottom: 30px; padding-top: 35px; " width="25.00%" bgcolor="transparent" align="center"><a target="_blank" style="color: #ffffff; font-size: 20px;" href><img src="https://tlr.stripocdn.email/content/guids/CABINET_3ef3c4a0538c293f4c84f503cd8af2cc/images/60961522067175378.png" alt title class="es-p5b" height="27" align="absmiddle"><br></a></td>
                                                                                                        <td class="es-p10t es-p10b es-p5r es-p5l " style="padding-bottom: 30px; padding-top: 35px; " width="25.00%" bgcolor="transparent" align="center"><a target="_blank" style="color: #ffffff; font-size: 20px;" href><img src="https://tlr.stripocdn.email/content/guids/CABINET_3ef3c4a0538c293f4c84f503cd8af2cc/images/72681522067183042.png" alt title class="es-p5b" height="27" align="absmiddle"><br></a></td>
                                                                                                        <td class="es-p10t es-p10b es-p5r es-p5l " style="padding-bottom: 30px; padding-top: 35px; " width="25.00%" bgcolor="transparent" align="center"><a target="_blank" style="color: #ffffff; font-size: 20px;" href><img src="https://tlr.stripocdn.email/content/guids/CABINET_3ef3c4a0538c293f4c84f503cd8af2cc/images/76121522068412489.jpg" alt title class="es-p5b" height="27" align="absmiddle"><br></a></td>
                                                                                                        <td class="es-p10t es-p10b es-p5r es-p5l " style="padding-bottom: 30px; padding-top: 35px; " width="25.00%" bgcolor="transparent" align="center"><a target="_blank" style="color: #ffffff; font-size: 20px;" href><img src="https://drive.google.com/file/d/1b4E6lIZ8uPQnMK-F3kZ5y-ozkWDrV9Nb/view?usp=sharing" alt title class="es-p5b" height="27" align="absmiddle"><br></a></td>
                                                                                                    </tr> -->
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table class="esd-footer-popover es-content" cellspacing="0" cellpadding="0" align="center">
                                <tbody>
                                    <tr>
                                        <td class="esd-stripe" align="center">
                                            <table class="es-content-body" style="background-color: transparent;" width="600" cellspacing="0" cellpadding="0" align="center">
                                                <tbody>
                                                    <tr>
                                                        <td class="esd-structure es-p30t es-p30b es-p20r es-p20l" align="left">
                                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="esd-container-frame" width="560" valign="top" align="center">
                                                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td class="esd-block-image es-infoblock made_with" align="center" style="font-size:0"><a target="_blank" href="https://www.thefirstcrowd.com/"><img src="https://www.google.com/maps/uv?pb=!1s0x3bc2bbaab9085397%3A0x4cdc8959c0c56a9b!3m1!7e115!4shttps%3A%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipNpSmQv9uBGz4p9bbG5U7Qbhms-OrrpzF-WaiXY%3Dw230-h160-k-no!5sfirst%20crowd%20private%20limited%20-%20Google%20Search!15sCgIgAQ&imagekey=!1e10!2sAF1QipPg8tL84ep3uAbWEOSFFft2T5vUiWXVKQyT9Jiu&hl=en&sa=X&ved=2ahUKEwiKzoTR5LjvAhX0X3wKHZYWD2wQoiowCnoECBUQAw#" alt width="125"></a></td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </body>
    
    </html>`
    };
  sgMail.send(msg);
}

module.exports.forgotPasswordMail = function (email, password) {
  console.log("Email admin forgot password " + email);
  const msg = {
    to: email,
    from: 'info@shootservices.in',
    subject: 'Forgot Password - Shoot Admin',
    html: "<h1><b>Admin Password!</b></h1><p> Your pssword has been reset successfully.<br> Password: "+ password +"</p>"
      };
  sgMail.send(msg);
}