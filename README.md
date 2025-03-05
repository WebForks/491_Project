# 491A_Project

Install Nodejs and it to PATH

Check:

node version 22.14.0

npm version 10.9.2

Make sure you cd Tenuity

npm install

npx expo start

https://trello.com/invite/b/67b625551da0da7fd12295a6/ATTIcfa1eef9867235c873a3b22b0f158cfbFA4B067C/491b-sprint-1

[Expo Documentation](https://docs.expo.dev/)

Make sure to update Sample.env with your API key

After running the above command:

1. The development server will start, and you'll see a QR code inside the terminal window.
2. Scan that QR code to open the app on the device. On Android, use the Expo Go > **Scan QR code** option. On iOS, use the default camera app.
3. To run the web app, press w in the terminal. It will open the web app in the default web browser.

## Viewing Tenuity From iPhone

In case scanning the QR code from the default iPhone camera doesnt work, follow these steps to access the project:

1. Download 'Expo Go' app from AppStore
2. Create an Expo account (https://expo.dev)
3. Terminal commands to connect local expo project to your Expo account
   - Insall CLI to login to Expo account
     `npm install -g eas-cli`
   - Login to Expo account
     `eas login`
   - Make sure you're in the project directory
     `eas update:configure`
4. Now when you run `npx expo start` you are able to use the app and tap on the running instance of the Tenuity app
