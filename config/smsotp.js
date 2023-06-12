const http = require('http');

//OTP for User
module.exports.userOTP = function (phone, otp, user_id, res) {
	// const otpurl = 'http://login.yourbulksms.com/api/sendhttp.php?authkey=17913AiBeDkMEuhdw5feb3e3cP15&mobiles=91' +phone+' &message=Hi+your+OTP+for+Shoot+User+is+'+ otp + '.+Kindly+do+not+share+this+with+others.&sender=iSHOOT&route=4';
	const otpurl = 'http://login.yourbulksms.com/api/sendhttp.php?authkey=17913AiBeDkMEuhdw5feb3e3cP15&mobiles='+phone+'&message=Hi your OTP for Shoot is '+otp+'. Kindly do not share this with others.&sender=vSHOOT&route=4&country=91&DLT_TE_ID=1207161727692245685'

	
	http.get(otpurl, (resp) => {
		let data = '';
		// console.log(resp);
		// A chunk of data has been recieved.
		resp.on('data', (chunk) => {
			data += chunk;
		});

		// The whole response has been received. Print out the result.
		resp.on('end', () => {
			if (data.substring(0, 3) === 'ERR') {
				console.log("error: " + data);
				return res.json({ status: false });
			}
			else {
				console.log("success:" + data);
				return res.json({ status: true, response: { msg: "OTP send successfully!", user_id: user_id, phone: phone } });
			}
		});

	}).on("error", (err) => {
		console.log("Error: " + err.message);
		return res.json({ status: false, error: err });
	});
}

//OTP for Merchant
module.exports.merchantOTP = function (phone, otp, merchant_id, res) {
        console.log(otp)
	const otpurl = 'http://login.yourbulksms.com/api/sendhttp.php?authkey=17913AiBeDkMEuhdw5feb3e3cP15&mobiles='+phone+'&message=Hi your OTP for Shoot is '+otp+'. Kindly do not share this with others.&sender=vSHOOT&route=4&country=91&DLT_TE_ID=1207161727692245685'
	// const otpurl = 'http://login.yourbulksms.com/api/sendhttp.php?authkey=17913AiBeDkMEuhdw5feb3e3cP15&mobiles=91' +phone+' &message=Hi+your+OTP+for+Shoot+Merchant+is+'+ otp + '.+Kindly+do+not+share+this+with+others.&sender=iSHOOT&route=4';
    console.log(otpurl);
	http.get(otpurl, (resp) => {
		console.log(resp);
		let data = '';

		// A chunk of data has been recieved.
		resp.on('data', (chunk) => {
			data += chunk;
		});

		// The whole response has been received. Print out the result.
		resp.on('end', () => {
			if (data.substring(0, 3) === 'ERR') {
				console.log("error: " + data);
				return res.json({ status: false });
			}
			else {
				console.log("success:" + data);
				return res.json({ status: true, response: { msg: "OTP send successfully!", merchant_id: merchant_id, phone: phone } });
			}
		}); 
	}).on("error", (err) => {
		console.log("Error: " + err.message);
		return res.json({ status: false, error: err });
	});
}

// module.exports.transactionMsg = function (mobile, msg) {
// 	const otpurl = 'http://api.unicel.in/SendSMS/sendmsg.php?uname=BIKERR_TRANS&pass=bykerR16&send=BYKERR&dest=' + mobile + '&msg='+msg;

// 	http.get(otpurl, (resp) => {
// 		let data = '';

// 		// A chunk of data has been recieved.
// 		resp.on('data', (chunk) => {
// 			data += chunk;
// 		});

// 		// The whole response has been received. Print out the result.
// 		resp.on('end', () => {
// 			if (data.substring(0, 3) === 'ERR') {
// 				console.log("error: " + data);
// 			}
// 			else {
// 				console.log("success:" + data);
// 			}
// 		});

// 	}).on("error", (err) => {
// 		console.log("Error: " + err.message);
// 	});
// }