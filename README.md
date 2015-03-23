mdn-devtool
===========

A new developer tool tab add-on for MDN.


Using the Add-on
================

To use the add-on:

	*  Click the "import" button
	*  Select a `.zst` file from your local machine

At present, the test will be run upon selection and results will display in the right pane!


Developing 
==========

To get started with developing and testing this add-on, do the following:

Clone this project:

```
git clone https://github.com/mozilla/mdn-devtool.git
```

Install dependencies:

```
cd mdn-devtool
npm install
```

Run Firefox with the add-on via [`jpm`](https://github.com/mozilla/jpm). E.g.:

```
./node_modules/.bin/jpm run --binary /Applications/FirefoxDeveloperEdition.app/
```

The browser will launch within Firefox Dev Edition. You can then open the
Developer Tools panel and see this plugin!
