/* 
1. Use the inquirer npm package to get user input.
2. Use the qr-image npm package to turn the user entered URL into a QR code image.
3. Create a txt file to save the user input using the native fs node module.
*/
import inquire from "inquirer";
import qr from "qr-image";
import fs from "fs";

inquire.prompt([{
    message: "Type your url: ",
    name: "URL",
},
{
    message: "Enter a name for your QR image file (without extension): ",
    name: "imageName",
}]).
    then(function (answer) {
        const url = answer.URL;
        const imageName = answer.imageName.trim().replace(/\s+/g, "_");
        const imageFileName = `QR_IMAGES/${imageName}_${Date.now()}.png`;
        var qr_png = qr.image(url);
        qr_png.pipe(fs.createWriteStream(imageFileName));

        fs.appendFile("QR_TEXT/url.txt", `${url}\n`, function (err) {
            if (err) throw (err);
            console.log("File is updated")
        });
    });