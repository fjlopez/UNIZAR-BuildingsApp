# UNIZAR Buildings App
This is a web and mobile app for students, staff and visitors, etc of the Universidad Zaragoza [UNIZAR](https://www.unizar.es/). It currently provides information and maps about the buildings of the different campuses of this University.

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

- Daniel García Paéz
- Jorge Garuz

Supervised by [Rubén Béjar](http://www.rubenbejar.com)

## Software libraries

# Acknowledgements

