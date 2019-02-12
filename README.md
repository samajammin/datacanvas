*This project is no longer live or maintained*

# Soundscore: See What You Hear

## The Project
[SoundScore](http://www.soundscore.info/) empowers prospective renters and current tenants to explore sound levels of neighborhoods across San Francisco. We collect noise measurements from a network of environmental sensors in order to quantify and visualize the impact of sound on urban quality of life. The project was a submission for the 2015 [Sense Your City Data Art Challenge](http://datacanvas.org/sense-your-city/) and was [selected for exhibition](http://www.swissnexsanfrancisco.org/media/latest-news/dataartchallengewinners/) by the grand jury.

## The Technology
[Data Canvas](http://datacanvas.org/) graciously funded a network of citizen volunteers to deploy 100 [environmental sensors](http://datacanvas.org/sense-your-city/diy-sensor-info/) in 7 cities across the world and provides a [public API](http://map.datacanvas.org/#!/data) in partnership with [Local Data](http://localdata.com/) to access the measurements of temperature, light, noise, pollution, humidity and dust collected every 10 seconds. Soundscore collects, aggregates, and analyzes the millions of noise measurements in our own PostgresSQL database. We use Django Rest Framework to provide our own API endpoint and D3, Crossfilter and DC.js JavaScript libraries to retrieve, manipulate, and visualize the data the straight in the user's web browser. Our application is built with Django and Bootstrap and deployed using AWS.

## The Team
* [Sam Richards](https://www.linkedin.com/in/sambrichards/en) — Engineering
* [Robert Crocker](https://www.linkedin.com/in/robertcrocker/en) — Product Management
* [Nathan Diesel](https://www.linkedin.com/in/nathandiesel/en) — Design

## Contribute
See our [Issue Tracker](https://github.com/sbrichards/datacanvas/issues) for upcoming features & bug fixes. Please check out [Soundscore.info](http://www.soundscore.info/) and submit your own suggestions!
