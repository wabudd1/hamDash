# Ham Radio EmComm Dashboard

## Why?

I've seen a lot of dashboards for amateur radio, but none of them seem to fit the Emergency Communications niche.  Either they are too DIY, requiring the user to locate and borrow data from outside sources and slap them on a page... or they are mostly focused on amateur radio as a hobby, giving you the information needed to make the longest/most contacts on your given mode.

This project intends to provide an out-of-the-box data set that gives an operator situational awareness and data important during an emergency.  Whether that allows for effective communications technique or technical setup or provides critical information that needs to be communicated or used by coordination of efforts.  Other information will still be included, but as more of an afterthought, accessible via a click or two.

## Other goals:
* Minimal setup and load times
* Information relevant to your specific area of concern
* Failure tolerance
  * Server cache of data, in the event internet is unavailable
  * Backup data sources (when available)
* Self-explanitory interface
* Optionally configurable elements
* Free, Open Source

# Building it yourself

* Clone the repository
* Install NodeJS
* `npm install -g yarn`
* `yarn install`
* `ng build` or `ng serve`
* `ng build --production` if you're feeling spicey