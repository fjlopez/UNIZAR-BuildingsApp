# UNIZAR Buildings App
This is a web and mobile app for students, staff and visitors of the Universidad Zaragoza [UNIZAR](https://www.unizar.es/). It currently provides information and maps about the buildings of the different campuses of this University.

It has been developed as the final year project of several students of the Degree in Computer Science Engineering at the Engineering and Architecture School of this University ([EINA](https://eina.unizar.es/)).

# Build and Run
## How to run the application
We will first install all the dependencies with the ***npm*** package manager:
```
npm install
```
In order to build *&&* run the application we will use ***gradle***:
```
gradle build
gradle run
```

We can also generate a ***war*** file and put it in an *Apache Tomcat Server*:
```
gradle build
gradle war
```

## How to configure the application for development

### The server side
We will use the same procedure described before:
```
gradle build
gradle run
```

### The web application side
We will use the ***Ionic Framework with Sass*** feature in order to have a more comfortable development. This must be done inside the folder [WebContent](WebContent/)

First of all we have to setup Sass following the instructions on this link: [Ionic Framework - Using Sass](http://ionicframework.com/docs/cli/sass.html)

Once this is done, we will use the following command that will watch for changes in our application. Those changes will be applied immediately:
```
ionic serve
```

#### Note:
The project also include the configuration project files for use *&&* and run the application (server side mainly) with IntelliJ IDEA: [UZapp.iml](UZapp.iml) so we can use the ***gradle*** comands directly in our project.

# License
The source code of this application is licensed under the GNU General Public License version 3.

# Credits
## Contributors

- Daniel García Páez
- Jorge Garuz

Supervised by [Rubén Béjar](http://www.rubenbejar.com)

## Software libraries
This app uses a number of free components and libraries. As the list is evolving as the development goes on, this document may be outdated, but I will try to keep it up to date.

#### Bootstrap free template SB-Admin-2
Copyright 2013-2015 Iron Summit Media Strategies, LLC.  Code released under the [Apache 2.0](https://github.com/IronSummitMedia/startbootstrap-sb-admin-2/blob/gh-pages/LICENSE) license.

<http://startbootstrap.com/template-overviews/sb-admin-2/>
#### jQuery
Copyright 2016 The jQuery Foundation. jQuery License. Released under the MIT license

<http://jquery.org/license>
#### jQuery Validation Plugin
jQuery Validation Plugin - v1.15.0 - 2/24/2016. Copyright (c) 2016 Jörn Zaefferer; Licensed MIT

<http://jqueryvalidation.org/>
#### LoadMask jQuery Plugin
Copyright (c) 2009 Sergiy Kovalchuk (serg472@gmail.com). Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.

<https://code.google.com/archive/p/jquery-loadmask//>
#### jQuery MD5 Plugin
Copyright 2010, Sebastian Tschan <https://blueimp.net>. Licensed under the MIT license

<https://github.com/blueimp/jQuery-MD5>
#### JavaScript Cookie Plugin
Copyright 2006, 2015 Klaus Hartl & Fagner Brack. Released under the MIT license

<https://github.com/js-cookie/js-cookie>

# Acknowledgements

