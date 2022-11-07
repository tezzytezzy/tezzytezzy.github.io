# Motivation
I find it is extremely difficult to obtain a whole dataset of [Australian Stock Exchange](https://www2.asx.com.au/)-listed companies: each company's profile page is OK to browse, but not in an easy-to-consume format for data analysts like myself. Its Company Directory page contains very minimal downloadable data. Why not create JSON files for the companies, grouped by industry, for peer analysis?

# Usage
Simply select any hyperlink (*right*-click if you are right-handed) to bring up contextual menu and then "Save link as..." to download a JSON file.

# Data
## Schedule
> Direct API calls to the Exchange by `cron` are scheduled at either 22:00 or 23:00 (AEST) from Sunday through Thursday, dependent on Australian Daylight Saving Time (UTC + 10 or 11). The job always runs each of these days irrespective of trading or non-trading day (e.g. public holiday).

## Completion 
> It creates each industry-grouped JSON file, as well as **asx-lastupdate.log**, in the **./dist/data/** folder. This log contains completion time in one-line text. Github Actions queue scheduled jobs and kick them off with no guaranteed starting time. Typically, all the files are created under 20 minutes and within 40 minutes from the scheduled kick-off time.
