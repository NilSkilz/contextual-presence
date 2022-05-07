---
layout: default
title: Introduction
nav_order: 1
---

Beta
{: .label }


# Introduction

Contextual-Presence is a [Home Assistant](https://home-assistant.io){:target="_blank"} integration that uses data from numerous sensors to determine presence in a smart home. 

## The Basics

Presence detection in the home automation space has long been a difficult task. Most existing solutions require the tracking of a specific device (a phone or bluetooth device), simple motion sensors or cameras with facial or object detection.

The aim of this project is to provide somewhat reliable presence detection in every room in the house, by combining the information from simple sensors, with an intelligent algorythm that understands the layout of your house.

#### What are the problems with other systems?
Every approach (including this one) has downsides. For myself, I can't use bluetooth tracking as half the members of my family don't have devices. PIR sensors and microwave sensors are tripped by the dogs and camera's with face detection fail the WAF. 


## What is required
### Hardware
This project is fairly sensor agnostic. As a minimum, you should really have a simple motion (PIR) sensor in each room, and ideally an [entry/exit sensor](https://github.com/Lyr3x/Roode){:target="_blank"} on each major thoroughfare. 

The more sensors the better, especially when it comes to presence detection.

### Software
This project is designed to work in a docker container, so should be fairly straight-forward to bring in to Home Assistant. However, as we're still in Alpha, we've not quite gotten to that yet....

## How Does it Work
The concept is fairly simple. We start by building a "Map" of the house. The map is a simple model of your home that describes the rooms and the sensors within those rooms. It also describes the passageways between those rooms, and any sensors that exist on those passageways. Once the system knows about the arrangement of the rooms, and the sensors that exist it can start being a bit smarter than just monitoring individual sensors.

#### An Example
```
"Room A" and "Room B" are connected, but there are no other entrances. 
There is a person in room "A". A PIR sensor is then triggered in room "B". 
We can therefore determine that the person moved from A to B, and is no longer in A.
```

While this may seem overly simplistic, it can open the door to some powerful automations.


## Occupancy vs Presence
In simple terms, occupancy tells us if a space is occupied by a person, while presence tells us which specific person is in a space.  This project aims to do both - detecting the presence of a person, and (if possible) determining which person it is.

## Confidence and Decay
When a sensor is triggered, we can be 99% confident that a person is present. After that point, our confidence starts to decrease. The rate of this decrease is determined by a number of factors (how many rooms/entrances with or without sensors etc). If there is an adjoining room with no sensors, then the decay in confidence would be high, whereas if the adjoining rooms had sensors, then the decay would be much less (but still present to allow for false negatives).