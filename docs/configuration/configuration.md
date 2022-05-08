---
layout: default
title: Configuration
nav_order: 3
has_children: true
---

# Configuration

The first step in configuring CP is to build the model of the space.

#### Decay
Once a sensor has been triggered, our confidence that a person is still in the room automatically decreases over time. The decay rate can be used to alter the rate at which confidence decreases.
For example, in a hallway where people tend to walk through, but not stop, I would expect the decay rate to be quite high, wherase in the living room by the TV, I would expect it to be much lower.
