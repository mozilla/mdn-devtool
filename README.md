mdn-devtool
===========

A new developer tool tab add-on for MDN.


Developing 
==========

To get started with developing and testing this add-on, do the following:

1.  Clone this project:

```
git clone https://github.com/darkwing/mdn-devtool.git
cd mdn-devtool
```

2.  Install Mozilla's JPM tool:

```
npm install jpm -g
```

For more details about JPM and its usage, visit the [JPM page on GitHub](https://github.com/mozilla/jpm)

3.  Run the live preview of the plugin here via the `jpm` command:

```
jpm run --binary /Applications/FirefoxDeveloperEdition.app/
```

The browser will launch within Firefox Dev Edition.  You can then open the Developer Tools panel and see this plugin!