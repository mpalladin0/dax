<div id="top"></div>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/mpalladin0/dax">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Digitial Audio XR (DAX)</h3>

  <p align="center">
    Use your phone to control spacial audio in augmented reality.
    <br />
    <a href="https://github.com/mpalladin0/dax"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://dax.michaelpalladino.io">Phone Demo</a>
    ·
    <a href="https://dax.michaelpalladino.io">Desktop Demo</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About DAX</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About DAX

[![Product Name Screen Shot][product-screenshot]](https://example.com)

Spacial (or 3D) audio is a group of sound effects that manipulate the sound produced by stereo speakers, surround-sound speakers, speaker-arrays, or headphones. This frequently involves the virtual placement of sound sources anywhere in three-dimensional space, including behind, above or below the listener. [(Wikipedia)](https://en.wikipedia.org/wiki/3D_audio_effect)

DAX uses the postion of your phone to automate these manipulations, with the end result being audio seemingly sounding like it's coming from your phone! [Checkout the Demo video for an example]()

<p align="right">(<a href="#top">back to top</a>)</p>


### Client Built With

* [TypeScript](https://www.typescriptlang.org)
* [Node.js](https://nodejs.dev)
* [Three.js](https://threejs.org)
* [Socket.io](https://socket.io)
* [Webpack](https://webpack.js.org)

### Server Built With

* [TypeScript](https://www.typescriptlang.org)
* [Node.js](https://nodejs.dev)
* [Express.js](https://expressjs.com)
* [Nest.js](https://nestjs.com)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->
## **Important:** Running Dax Locally

Dax is comprised of two seperate projects: Client and Server. Both must be running and properly configured. See the Client Guide and the Server Guide for details on setting up and using Dax locally.


<br>

---

<br>

## **__Client__ Guide**

The client hosts the both Desktop and Mobile versions of Dax. They're the same application, but the functionality will defer depending on whether it's being accessed by a mobile device or a desktop device. 

On Mobile, the Dax client acts as a the Controller for the sounds position, doing the following:
* Relaying the phone's current position to the Server, which is then relayed to the Desktop Client.
    * I suspect this middleman can partially or fully be removed with a more robust Socket implementation.

On Desktop, the Dax client acts as the Reciever of Phones position, doing the following:
* Recieves the Phone Client's current position from the Server, and repositions the audio accordingly. 
    * This is done continiously as long user's thumb is placed on the Phone Client's screen.

###  Built With

* [TypeScript](https://nextjs.org/)
* [Node.js](https://reactjs.org/)
* [Three.js](https://svelte.dev/)
* [Socket.io](https://laravel.com)
* [Webpack](https://getbootstrap.com)


### Installation
1. Clone client repository
```sh
git clone https://github.com/mpalladin0/dax-client
```

2. Install the required dependencies
```sh
npm install
```

3. Run the client
```sh
npm run start
```
### Usage Notes
* You must run the client on port 443 and/or serve the files over a secure connection (SSL). **Nothing will work if you don't do this, due to built in security restrictions on accessing the [DeviceMotionEvent](https://developer.mozilla.org/en-US/docs/Web/API/DeviceMotionEvent) and [DeviceOrientationEvent](https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent)**. 
    * You can setup a free [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/tunnel-guide/) to handle this.
* On Desktop, you must use **Google Chrome**. Safari is not supported.
* On Mobile (iPhone), you must download the [WebXR Viewer App](https://apps.apple.com/us/app/webxr-viewer/id1295998056) when accessing the client. This is due to Safari not supporting the WebXR Device API yet. 
* Sounds are stored in ```src/sounds``` as  ```.mp3```. 
    * Currently, only one sound can be played at a time. 
    * To change which sound will be played, open the ```config.env``` file and change ```SOUND="YOUR_SOUND_NAME_HERE"``` parameter to the name of your sound (omit the extension).
* Both the Client and the Server must be running and accessible via secure (SSL/HTTPS) environment.

<br>

---

<br>

## **__Server__ Guide**

The Server acts as the cordinator/middleman between the Desktop and Mobile clients. It establishes the connections and relays positioning information. No data processing is done on here, it's purely a middleman.

###  Built With

* [TypeScript](https://nextjs.org/)
* [Nest.js](https://reactjs.org/)

### Installation
1. Clone client repository
```sh
git clone https://github.com/mpalladin0/dax-server
```

2. Install the required dependencies
```sh
npm install
```

3. Run the client
```sh
npm run start
```
### Usage Notes
* You must run the client on port 443 and/or serve the files over a secure connection (SSL). **Nothing will work if you don't do this, due to built in security restrictions on accessing the [DeviceMotionEvent](https://developer.mozilla.org/en-US/docs/Web/API/DeviceMotionEvent) and [DeviceOrientationEvent](https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent)**. 
    * You can setup a free [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/tunnel-guide/) to handle this.



<p align="right">(<a href="#top">back to top</a>)</p>


<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## **Contact Me**

Michael Palladino
 * [LinkedIn](https://linkedin.com/in/michael-a-palladino)
 * [Email: michael.a.palladino@rutgers.edu](michael.a.palladino@rutgers.edu)
 * [Website](https://michaelpalladino.io)


<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Additional learning resources:

* [Embody: What is an HRTF, or Head Related Transfer Function, and why should it be personalized?](https://www.youtube.com/watch?v=3CXtmG4nXIM)
* [A tale of two clocks - Scheduling web audio with precision](https://www.html5rocks.com/en/tutorials/audio/scheduling/)
* [Mozilla - WebAudio API Docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/mpalladin0/dax.svg?style=for-the-badge
[contributors-url]: https://github.com/mpalladin0/dax/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/mpalladin0/dax.svg?style=for-the-badge
[forks-url]: https://github.com/mpalladin0/dax/network/members
[stars-shield]: https://img.shields.io/github/stars/mpalladin0/dax.svg?style=for-the-badge
[stars-url]: https://github.com/mpalladin0/dax/stargazers
[issues-shield]: https://img.shields.io/github/issues/mpalladin0/dax.svg?style=for-the-badge
[issues-url]: https://github.com/mpalladin0/dax/issues
[license-shield]: https://img.shields.io/github/license/mpalladin0/dax.svg?style=for-the-badge
[license-url]: https://github.com/mpalladin0/dax/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/michael-a-palladino
[product-screenshot]: images/screenshot.png