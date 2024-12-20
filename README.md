# Friendly Plan
<img src="./doc-assets/Przyjazny_plan_logo.png" width="200" height="200"/>

## About the App and Autism Therapy
“Friendly Plan” is an application supporting autism therapy for children and adults. It is based on two therapy methods: activity schedules and scripts. 

<b>Autism</b> is a developmental disorder characterized by difficulties with social interaction and communication and by restricted and repetitive behavior. Parents often notice signs of autism during the first three years of their child's life. Although there is no known cure, early therapy can help children with autism develop social and communication skills.
<b>Activity schedules</b> are a behavioral method of autism treatment. They help people with autism learn how to perform different tasks or activities on their own and develop social behaviours. Schedules are presented as pictures or texts (lists).
<b>Scripts</b> are written or visual prompts that initiate or sustain interaction. They teach an autistic person to start a conversation on his or her own, without verbal hints like “Say: hello”. 
Both methods were verified by scientists at Princeton Child Development Institute in the USA. More about the treatment and some success stories on <a href="http://pcdi.org/videos//">PCDI website (EN)</a>.

<b>The app</b> allows users to create activity schedules in a digital form and freely modify them. It makes the preparation of schedules, which previously involved a lot of manual work, much faster and easier. “Friendly Plan” supports therapy sessions also by showing schedules in a form adjusted to the development level of the patient (global settings of the text size, use of illustrations etc.).

## Old Version
There are two apps in use at the moment: one for the therapist and one for the child. You can see <b>videos from therapy sessions</b> on <a href="http://www.fundacja.iwrd.pl/nasze-dzialania/aplikacje-na-tablety">the website of Institute for Child Development in Gdańsk (PL)</a>.
You can <b>download the old app from</b> <a href="https://play.google.com/store/apps/details?id=com.przyjaznydamianek&hl=pl">Google Play</a>.

## New Version
The new version of “Friendly Plan”, which is currently being developed, will be a <b>single app for two types of users</b>.

We have planned <b>three touchpoints</b> for the new version of our app:<br> 
-> smartphone: for spontaneous changes to the schedules if other touchpoints are unavailable to the therapist<br>
-> tablet: for therapy sessions with autistic children<br>
-> desktop: therapists prefer to create and edit schedules using their PCs<br>

You can read more about the <b>redesign</b> in our presentation <a href="https://drive.google.com/file/d/1tKYoyRbTVCIqxEusUSXjoZBLIKkgWVYQ/view?usp=sharing"> (PL)</a>  <a href="https://drive.google.com/file/d/1FUV9Wg1WyNPA_I7Ac4VNBV1Dj3INeXsZ/view?usp=sharing">(EN)</a> also explore the <a href="https://xd.adobe.com/view/e1817941-aab9-4dbb-7541-0257a3f1a366-97b0/grid">interactive prototype of the new app (PL)</a>.

Child view<br>
<img src="./doc-assets/app screenshot1.jpg" width="900"/><br>
Plan view<br>
<img src="./doc-assets/app screenshot2.jpg" width="900"/><br>
Preparing a task<br>
<img src="./doc-assets/app screenshot3.jpg" width="900"/><br>

## Run the application

### Step 1: Install required dependencies

First, you will need to download the libraries that the app is using.

To download the dependencies, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm install

# OR using Yarn
yarn install
```

### Step 2: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

### Step 3: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ app:

#### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

## Deploying the application

To deploy the application to Google Play Store:
1. Open repository on Github
2. Go to `Actions` tab
3. On the left panel select `Build and Deploy`
4. On the right click on the `Run workflow` dropdown
5. Set proper app version numbers and click `Run workflow`
6. After build finishes (refresh the page to see it building) download `.aab` file from created Artifacts and create new internal release with it on Google Play Console.
7. After tests are done on the internal track, promote version to production.


## Environment configuration 
Below are listed recommended versions of tools used for the app development:

* Node.js: **v20.10.0**
* Java Development Kit: **17.0.10**
* react-native-cli: **2.0.1**
* react-native: **0.73.4**

Note: newer/older versions may work as well. Versions listed above are currently used for development.

## License
The project is developed by people who want to make other people's lives easier. Because of that Friendly Plan is going to be free to use, download and develop for everybody, forever.
Except as otherwise noted, this software is licensed under the [GNU General Public License, v3](https://www.gnu.org/licenses/gpl-3.0.txt).

## Partners
<img src="./doc-assets/kdp-logo.jpg" height="150" /><img src="/doc-assets/iwrd-logo.png" height="150" /><img src="./doc-assets/pg-logo.jpg" height="150" /><img src="/doc-assets/bright_inventions_logo.png" height="150" /><img src="/doc-assets/stx_logo.png" height="150" />

