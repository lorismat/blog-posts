# Analysing Colors From Instagram

[Link of the blog post](https://www.lorismat.com/blog/analysing-brand-colors-from-instagram)  

This project fetches image urls from instagram accounts, download them, and capture the average color for each of them. The average colors are then stored in a `.json` file.    
All scripts can be run independently, with either `node` or `python`.  
They are wrapped in the `run.sh` shell script, that can be run with `sh run.sh the_instagram_account`, _the instagram account_ being the one where you want to fetch and get the average color.  

## Structure of the repository

- `run.sh` is a bash script to run all required scripts. Prior to run it, you should have `python`, `node` and `puppeteer` installed. Run it as follow: `sh run.sh _the instagram account_` for instance: `sh run.sh kenzo`
- `reconnect.js` is the first script run by `run.sh`. It opens up a chromium page to the instagram account you are interested in. Prior to running either `run.sh` or `reconnect.js` independently, you should be connected to instagram with your account. All urls from pictures will be accessible in a newly created .txt fil in the _links_ folder
- `dl.py` is a python script which executes the `wget` command to download all images from their url. They will be stored into the `images` folder
- `kmeans.py` is another python script to compute the average color, inspired by the [following article](https://charlesleifer.com/blog/using-python-and-k-means-to-find-the-dominant-colors-in-images/) from Charles Leifer. The data will be stored into the `colors` folder as a .json file ready for visualization