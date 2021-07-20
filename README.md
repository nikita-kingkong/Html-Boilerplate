# Static Site Boilerplate
This repository contains all you will need to get started with a static site (Landing Page, Mini Sales Funnel etc) build. Including a task runner, some pre-packaged npm dependancies, optional ebook and thank you pages, and templates for common elements and sections that are used across our standard builds of these types of pages. This Readme will guide you through all of these aspects, address some common pitfalls and explain a recommended build process in order to build these pages as efficiently and effectively as possible.

## Requirements
  * NPM ([Installing NPM](https://www.npmjs.com/get-npm))
  * Gulp ([Installing Gulp](https://gulpjs.com/docs/en/getting-started/quick-start))
  * GraphicsMagick or ImageMagick ([Installing GraphicsMagick](http://www.graphicsmagick.org/)) ([Installing ImageMagick](https://imagemagick.org/index.php))

## Installation
Once downloaded, you will want to place all files in an empty working directory of your choice. Then you will need to navigate to that location in Terminal and install the dependancies with the following command.
`npm install`

This will create a `node_modules` folder, the contents of which will be referenced in our Gulp task.
**This folder should not be uploaded to the preview server or live site**

## Build Tasks
We are using Gulp as our task runner. This takes care of image processing, CSS processing including autoprefixing, minification and sourcemaps, JS processing including minification ES6 Transpiling and sourcemaps and also automatic browser reloading for everything via Browsersync. You should not need to alter the contents of these tasks (located in `gulpfile.js`) at all. The only exception is if you are running Valet as a local development environment in which case you will need to edit the following settings right up the top of the file after the requirements

  * `localEnv`
  * `userName`
  * `siteName`

Again, this is **only** if you are using Valet. You can completely ignore the gulpfile otherwise. 

To use all the functionality the gulp process provides, simple run the `gulp` command in your Terminal from the root of your project.

Also of note is the `gulp prod` task. This will do a final packaging up of assets for you, removing sourcemaps and anything else extra that is helpful while developing. This task only needs to be run right before making a site live.

## Workflow & Structure
In this section we will cover the various parts of the development workflow of a static site, Including the optional Ebook and Thank You pages, the template system and the inheritance structure of our CSS an JS.

Before you do anything, be sure you have the `gulp` task running, which will watch all your files for changes.

#### Templates
In the root directory, you will see there are 3 html files (this may change in the future but the idea will remain the same).

The first is `index.html`. This will obviously act as the root page of your site and in many cases may be the only page of the build. The file included in this repo comes pre-packaged with meta information ready to be filled out, a basic header in the most common style of our static sites, a simple footer and references to the compiled CSS and JS files. Please note that there are no other styles or scripts such as jQuery referenced in this file. This is a deliberate choice and will be explained in the **Scripts & Styles** Section. You will also notice that other than the header and footer, the body of the page is left empty. This is because we have the `template-sections.html` and `template-sections.html` files.

The idea here is that there are some common section layouts and elements in these types of static sites and we have created simple, stripped-back templates for you to copy, paste and adapt into your main `index.html` file.

I have found the best process for this has been to go through the design section by section, find the closest section from the `template-sections.html` file, paste that into the `index.html` file and give it a unique ID. For sections that will need to be built from scratch I will just put in a placeholder section tag with a unique ID referencing the design. From there I just go through and do what I need to do to get the html in the `index.html` to match the design.

Also included out of the box is a pre-made ebook page located in the `ebook` directory and also a pre-made thank you page located in `thank-you`. If the project you are working on doesnt require these the directories can simply be deleted.

#### Scripts & Styles
As mentioned earlier. The `index.html` file only references 1 script and 1 style. This is because we include and compile everything into those two files. For the purposed of this type of build, the `main.scss` and `main.js` files - located at `assets/src/scss/main.scss` and `assets/src/js/main.js` respectively, will act as the endpoint for all of the various inclusions. You can see that both of those files act simply as importers of other files. You will also see that in both the `assets/src/scss` and `assets/src/js` directories, there is a `vendor` directory. This is where any external scripts/styles are to be placed.

As you can see the files I mentioned both live in the `assets/src` directory. **This is the only directory you should be making any changes in**. You will see, if you have run your `gulp` task already, that there is also an `assets/prod` directory. This is where the final files for the site that are referenced in `index.html` are generated, as well as where all the optimised images are generated out to after being placed in `assets/src/images`.

Now that the structure is explained, the rest is fairly self explanatory. For styles, header styles belong in `header.scss` and global styles belong in `global.scss`, commonly used variables such as colours belong in `variables.scss` and so on. I have found an effective pattern to be to use `home.scss` to make any style changes to copied across sections by referencing their IDs and to create a new scss file for each of the completely custom sections.

For scripts, `home.js` contains all the scripts needed for the home page, `ebook.js` contains anything needed specifically for the ebook page and `main.js` joins everything, including vendor scripts together.

### Images
First things first, if you haven't already, be sure to have installed ImageMagick or GraphicsMagick (installation instruction URLs are in the Requirements section) and have available in your PATH.

We use a series of tools in order to generate responsive and optimised images. The workflow for the developer should simply be to move an image into the `assets/src/images` directory. From there our gulp script will generate a series of images with identifying suffixes. 

For example, if you drop `hero.jpg` into the `assets/src/images` folder you will see that the following gets generated out in the `assets/prod/images` folder:

`hero-small.jpg`,
`hero-medium.jpg`,
`hero-large.jpg`,
`hero-extra-large.jpg`,
`hero-cover.jpg`

As the developer, you shouldn't have to worry about these. All you need to do is make sure your image markup looks like the following:

`<img class="lazyload" data-sizes="auto" data-original-src="./assets/prod/images/hero.jpg">`

Now, there are a couple of things to note about this. Firstly, the class of `lazyload` is crucial, as this is the trigger for us to retreive the generated images, and also the trigger for us to workout the most appropriate size.

The `data-sizes="auto"` attribute tells our script to generate `sizes`. This is important and also something you should never have to alter. Just make sure it is included.

The `data-attribute-src` attribute is to be used in place of the traditional `src` attrubute. You will also notice that in the example I have written above, there is no suffix on the image name even though the path is to the `prod` folder. This is because we use a script in the background that takes that path and retreives all the possible options, in order to write out a full `srcset`.

## Feedback
While stable, this framework is being actively worked on and I'm sure there will be some issues that occur on different setups and machines, as well as in situations that haven't been tested. If there are problems you are having with anything explained in this doc. Please report them to us. The goal here is to make the most efficient and effective process possible for everyone so your feedback is really valuable in getting to that point.