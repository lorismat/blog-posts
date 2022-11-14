import os
import sys

arg = sys.argv[1]

with open("links/{}.txt".format(arg)) as f:
    f = f.read().split(',')
    f = list(set(f))

print("{} pictures to download".format(len(f)))
os.system("mkdir images/{}".format(arg))

for i in range(len(f)):
    os.system("wget -O 'images/{}/{}.png' '{}'".format(arg,i,f[i]))
