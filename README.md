# Motivation
I find it is extremely difficult to obtain a whole dataset of [Australian Stock Exchange](https://www2.asx.com.au/)-listed companies. The exchange itself displays or let you download partial data on their separate web pages---not in an easy-to-consume, all-in-one-place format at all. Why not in the popular JSON format, grouped by industry?

# Usage
Simply select any hyperlink (*right*-click if you are right-handed) to bring up contextual menu and then "Save link as..." to download a JSON file.

# Data
## Schedule
> Direct API calls to the Exchange by `cron` are scheduled at either 22:00 or 23:00 (AEST) from Sunday through Thursday, dependent on Australian Daylight Saving Time (UTC + 10 or 11). The job runs irrespective of the day being a public holiday or not.

## Completion 
> It creates **asx-lastupdate.log** in the **./dist/data/** folder (as well as all the JSON files). This file contains completion time in one-line text. Github Actions queue scheduled jobs and kick them off with no guaranteed starting time. Typically, the JSON files are created under 20 minutes and within 40 minutes from the scheduled kick-off time. 
