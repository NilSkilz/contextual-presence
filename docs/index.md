## What is Contextual-Presence

Contextual-Presence is a [Home Assistant](https://home-assistant.io) integration that uses data from numerous sensors to determine presence in a smart home. 

### The Basics

Presence detection in the home automation space has long been a difficult task. Most existing solutions require the tracking of a specific device (a phone or bluetooth device), simple motion sensors or cameras with facial or object detection.

The aim of this project is to provide somewhat reliable presence detection in every room in the house, by combining the information from simple sensors, with an intelligent algorythm that understands the layout of your house.

#### What are the problems with other systems?
Every approach (including this one) has downsides. For myself, I can't use bluetooth tracking as half the members of my family don't have devices. PIR sensors and microwave sensors are tripped by the dogs and camera's with face detection fail the WAF. 


#### What is required
This project is fairly sensor agnostic. As a minimum, you should really have a simple motion (PIR) sensor in each room, and ideally an [entry/exit sensor](https://github.com/Lyr3x/Roode) on each major thoroughfare. 

The more sensors the better, especially when it comes to presence detection.

#### Occupancy vs Presence
In simple terms, occupancy tells us if a space is occupied by a person, while presence tells us which specific person is in a space.  This project aims to do both - detecting the presence of a person, and (if possible) determining which person it is.


### How Does it Work
