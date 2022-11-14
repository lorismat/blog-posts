from collections import namedtuple
import colorsys
import json
from math import sqrt
import os
from os import listdir
from os.path import isfile, join
import random
import sys
from PIL import Image
from IPython.core.display import display, HTML
from natsort import natsorted

arg = sys.argv[1]

Point = namedtuple('Point', ('coords', 'n', 'ct'))
Cluster = namedtuple('Cluster', ('points', 'center', 'n'))

# two functions to do math computations used in later functions

def calculate_center(points, n):
    vals = [0.0 for i in range(n)]
    plen = 0
    for p in points:
        plen += p.ct
        for i in range(n):
            vals[i] += (p.coords[i] * p.ct)
    return Point([(v / plen) for v in vals], n, 1)

def euclidean(p1, p2):
    return sqrt(sum([
        (p1.coords[i] - p2.coords[i]) ** 2 for i in range(p1.n)
    ]))


# retrieve all points of the picture as a rgb array

def get_points(img):
    points = []
    w, h = img.size
    for count, color in img.getcolors(w * h):
        points.append(Point(color, 3, count))
    return points

def kmeans(points, k, min_diff):
    clusters = [Cluster([p], p, p.n) for p in random.sample(points, k)]

    while 1:
        plists = [[] for i in range(k)]

        for p in points:
            smallest_distance = float('Inf')
            for i in range(k):
                distance = euclidean(p, clusters[i].center)
                if distance < smallest_distance:
                    smallest_distance = distance
                    idx = i
            plists[idx].append(p)

        diff = 0
        for i in range(k):
            old = clusters[i]
            center = calculate_center(plists[i], old.n)
            new = Cluster(plists[i], center, old.n)
            clusters[i] = new
            diff = max(diff, euclidean(old.center, new.center))

        if diff < min_diff:
            break

    return clusters

rtoh = lambda rgb: '#%s' % ''.join(('%02x' % p for p in rgb))

def colorz(filename, n=1):
    try:
        img = Image.open(filename)
        print("success")
        img.thumbnail((200, 200))
        w, h = img.size
        # calling the get_points function
        points = get_points(img)
        # calling the k_means function
        clusters = kmeans(points, n, 1)
        
        rgbs = [map(int, c.center.coords) for c in clusters]
        return map(rtoh, rgbs)
    except:
        print("failed for {}".format(filename))
        pass

mypath = "./images/{}/".format(arg)

files = [f for f in listdir(mypath) if isfile(join(mypath, f))]

# sorting string by numbers
files = natsorted(files)

def recursive(path):
    color = ""
    arrays = []
    for idx,file in enumerate(files):
        print(path+file)
        i = (idx *10)
        try:
            array = list(colorz(path + file))
            arrays.append(array)
            color = color + \
                    """
                  <rect x="{1}" y="0" width="10" height="10" style="fill: {0};" />

                    """.format(array[0],i)

            opening = """ <svg width="{0}" height="100"> """.format((len(files)*10)+100)
            closing = """ </svg> """
        except:
            pass

    return arrays

# arr is a list of 3 hex codes
# arr, html = recursive(mypath)

arr = recursive(mypath)

# converting hex to rgb
for i in range(len(arr)):
    for j in range(0,1):
        arr[i][j] = tuple(int(arr[i][j].lstrip('#')[k:k+2], 16) for k in (0, 2, 4))


# converting rgb to hsb/hsl
for i in range(len(arr)):
    for j in range(0,1):
        arr[i][j] = list(colorsys.rgb_to_hsv(arr[i][j][0]/255.,arr[i][j][1]/255.,arr[i][j][2]/255.))

# converting to the proper number format: [0,360] - [0,100] - [0,100]
for i in range(len(arr)):
    arr[i][0][0] = int(arr[i][0][0] * 360)
    arr[i][0][1] = int(arr[i][0][1] * 100)
    arr[i][0][2] = int(arr[i][0][2] * 100)

dict_colors = { i : arr[i] for i in range(0, len(arr) ) }

# to visualize it interactively, we will use the d3.js library. I'm generating a json file for each movie
# with arrays of 3 elements per frame
with open('./colors/{}.json'.format(arg), 'w') as f:
    json.dump(arr, f)
